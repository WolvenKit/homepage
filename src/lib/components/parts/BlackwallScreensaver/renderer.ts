import type { Point } from "$lib/utils";

type Ctx = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
type Style = CSSStyleDeclaration;

// CSS to Canvas modes
const COMPOSITION_MODES: Record<string, GlobalCompositeOperation> = {
  normal: "source-over",
  multiply: "multiply",
  lighten: "screen",
};

export async function renderElement(
  ctx: Ctx,
  element: HTMLElement,
  offset: Point = [0, 0],
  skipRoot = false,
  background?: string,
) {
  const style = window.getComputedStyle(element);
  const bbox = element.getBoundingClientRect();

  if (
    !element.hasAttribute("data-force-glitch") &&
    (style.maskImage != "none" ||
      style.visibility == "hidden" ||
      style.display == "none" ||
      style.opacity == "0" ||
      (style.mixBlendMode != "normal" && !(style.mixBlendMode in COMPOSITION_MODES)) ||
      style.backgroundClip != "border-box")
  ) {
    return; // Skip masked and invisible elements
  }

  ctx.save();

  let offscreen: OffscreenCanvas | undefined = undefined;
  let renderCtx: Ctx = ctx;
  if (style.mixBlendMode != "normal") {
    offscreen = new OffscreenCanvas(ctx.canvas.width, ctx.canvas.height);
    renderCtx = offscreen.getContext("2d")!;
  }

  // If within viewport
  if (bbox.y < window.innerHeight && bbox.y + bbox.height > 0) {
    if (!skipRoot) {
      renderClip(renderCtx, style.clipPath, bbox);
      renderBox(renderCtx, style, bbox);
      if (element.tagName === "IMG") renderImage(renderCtx, bbox, element as HTMLImageElement);
      else if (element.tagName === "VIDEO" && element.getAttribute("poster")) {
        const img = new Image();
        img.src = element.getAttribute("poster")!;
        if (!img.complete) await new Promise((r) => (img.onload = r));
        renderImage(renderCtx, bbox, img);
      }
      renderBorders(renderCtx, style, bbox);
    }

    for (const node of element.childNodes) {
      switch (node.nodeType) {
        case node.TEXT_NODE:
          if (node.nodeValue?.trim()) {
            renderText(renderCtx, style, node);
          }
          break;
        case node.ELEMENT_NODE:
          await renderElement(renderCtx, node as HTMLElement, undefined, undefined, background);
          break;
      }
    }
  }

  if (offscreen) {
    ctx.globalCompositeOperation = COMPOSITION_MODES[style.mixBlendMode];
    ctx.drawImage(offscreen, 0, 0);
  }

  ctx.restore();
  ctx.translate(-offset[0], -offset[1]);
}

const POINT_RE = /(calc\(\d+(?:px|%) . \d+(?:px|%)\))|(\d+(?:px|%))/g;

function renderClip(ctx: Ctx, clipPath: string, bbox: DOMRect) {
  if (!clipPath.startsWith("polygon")) return;

  const parts = clipPath.slice("polygon(".length, -1).split(",");

  ctx.beginPath();
  let first = true;

  for (const part of parts) {
    POINT_RE.lastIndex = 0;
    const match = [POINT_RE.exec(part), POINT_RE.exec(part)];

    if (!match[0] || !match[1]) {
      console.warn("Failed to parse clipPath", clipPath);
      ctx.beginPath();
      return; // give up
    }

    const x = bbox.x + parseClipPathValue(match[0][0], bbox.width);
    const y = bbox.y + parseClipPathValue(match[1][0], bbox.height);

    if (first) {
      ctx.moveTo(x, y);
      first = false;
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.clip();
}

function renderBox(ctx: Ctx, style: Style, bbox: DOMRect) {
  ctx.beginPath();
  ctx.roundRect(bbox.x, bbox.y, bbox.width, bbox.height, style.borderRadius.split(" ").map(parseFloat));

  if (style.backgroundColor != "none") {
    ctx.fillStyle = style.backgroundColor;
    ctx.fill();
  }

  if (style.border) {
    const width = parseFloat(style.borderWidth);

    if (width) {
      ctx.lineWidth = width;
      ctx.strokeStyle = style.borderColor;
      ctx.stroke();
    }
  }
}

function renderBorders(ctx: Ctx, style: Style, bbox: DOMRect) {
  const stroke = (side: "Top" | "Left" | "Right" | "Bottom") => {
    ctx.lineWidth = parseFloat(style[`border${side}Width`]);
    ctx.strokeStyle = style[`border${side}Color`];
    ctx.stroke();
  };

  if (style.borderTop && style.borderTopWidth != "0px") {
    ctx.beginPath();
    ctx.moveTo(bbox.x, bbox.y);
    ctx.lineTo(bbox.x + bbox.width, bbox.y);
    stroke("Top");
  }

  if (style.borderRight && style.borderRightWidth != "0px") {
    ctx.beginPath();
    ctx.moveTo(bbox.x + bbox.width, bbox.y);
    ctx.lineTo(bbox.x + bbox.width, bbox.y + bbox.height);
    stroke("Right");
  }

  if (style.borderBottom && style.borderBottomWidth != "0px") {
    ctx.beginPath();
    ctx.moveTo(bbox.x, bbox.y + bbox.height);
    ctx.lineTo(bbox.x + bbox.width, bbox.y + bbox.height);
    stroke("Bottom");
  }

  if (style.borderLeft && style.borderLeftWidth != "0px") {
    ctx.beginPath();
    ctx.moveTo(bbox.x, bbox.y);
    ctx.lineTo(bbox.x, bbox.y + bbox.height);
    stroke("Left");
  }
}

function renderText(ctx: Ctx, style: Style, node: Node) {
  ctx.font = style.font;
  ctx.fillStyle = style.color;
  ctx.textAlign = "start";
  ctx.textBaseline = "top";
  ctx.wordSpacing = style.wordSpacing;

  let text = node.nodeValue!;

  const uppercase = style.textTransform.includes("uppercase");
  if (uppercase) text = text.toUpperCase();

  const range = document.createRange();
  // begin at the first char
  range.selectNode(node);
  // initial position
  let line = 0;
  let current = 1; // we already got index 0
  let lastFound = 0;
  let lastTop = range.getBoundingClientRect().top;

  const rects = range.getClientRects();

  // iterate over all characters
  while (current <= text.length) {
    // move our cursor
    range.setStart(node, current);

    const rangeBbox = range.getBoundingClientRect();

    if (rangeBbox.top != lastTop) {
      // line break
      ctx.fillText(text.slice(lastFound, current), rects[line].x, rects[line].top, rects[line].width);
      lastTop = rangeBbox.top;
      lastFound = current;
      line++;
    }
    current++;
  }
}

function renderImage(ctx: Ctx, bbox: DOMRect, element: HTMLImageElement) {
  ctx.drawImage(element, bbox.x, bbox.y, bbox.width, bbox.height);
}

function parseClipPathValue(value: string, size: number) {
  const getVal = (str: string) => {
    let val = parseFloat(str);
    if (str.endsWith("%")) val = size * (val / 100);
    return val;
  };

  if (value.startsWith("calc")) {
    const [str1, op, str2] = value.slice("calc(".length, -1).split(" ");

    const val1 = getVal(str1);
    const val2 = getVal(str2);

    switch (op) {
      case "+":
        return val1 + val2;
      case "-":
        return val1 - val2;
      case "*":
        return val1 * val2;
      case "/":
        return val1 / val2;
    }
  }

  return getVal(value);
}
