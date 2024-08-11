type Ctx = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
type Style = CSSStyleDeclaration;

export async function renderElement(ctx: Ctx, root: HTMLElement, skipRoot = false) {
  const style = window.getComputedStyle(root);
  const bbox = root.getBoundingClientRect();

  if (
    style.maskImage != "none" ||
    style.mixBlendMode != "normal" ||
    style.visibility == "hidden" ||
    style.display == "none" ||
    style.opacity == "0"
  ) {
    return; // Skip masked and invisible elements
  }

  ctx.save();

  // If within viewport
  if (bbox.y < window.innerHeight && bbox.y + bbox.height > 0) {
    if (!skipRoot) {
      renderClip(ctx, style.clipPath, bbox);
      renderBox(ctx, style, bbox);
      if (root.tagName === "IMG") renderImage(ctx, bbox, root as HTMLImageElement);
      else if (root.tagName === "VIDEO" && root.getAttribute("poster")) {
        const img = new Image();
        img.src = root.getAttribute("poster")!;
        if (!img.complete) await new Promise((r) => (img.onload = r));
        renderImage(ctx, bbox, img);
      }
      renderBorders(ctx, style, bbox);
    }

    for (const node of root.childNodes) {
      switch (node.nodeType) {
        case node.TEXT_NODE:
          if (node.nodeValue) {
            const range = document.createRange();
            range.selectNode(node);
            renderText(ctx, style, range.getBoundingClientRect(), node.nodeValue);
          }
          break;
        case node.ELEMENT_NODE:
          await renderElement(ctx, node as HTMLElement);
          break;
      }
    }
  }

  ctx.restore();
}

const POINT_RE = /(calc\(\d+(?:px|%) . \d+(?:px|%)\))|(\d+(?:px|%))/g;

function renderClip(ctx: Ctx, clipPath: string, bbox: DOMRect) {
  if (!clipPath.startsWith("polygon")) return;

  const parts = clipPath.slice("polygon(".length, -1).split(",");
  let success = true;

  ctx.beginPath();
  let first = true;

  for (const part of parts) {
    POINT_RE.lastIndex = 0;
    const match = [POINT_RE.exec(part), POINT_RE.exec(part)];

    if (!match[0] || !match[1]) {
      console.warn("Failed to parse clipPath", clipPath);
      success = false;
      break; // give up
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

  if (success) ctx.clip();
  else ctx.beginPath();
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

function renderText(ctx: Ctx, style: Style, bbox: DOMRect, text: string) {
  ctx.font = style.font;
  ctx.fillStyle = style.color;
  ctx.textAlign = "start";
  ctx.textBaseline = "top";

  const uppercase = style.textTransform.includes("uppercase");
  if (uppercase) text = text.toUpperCase();

  ctx.fillText(text, bbox.x, bbox.y);
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
