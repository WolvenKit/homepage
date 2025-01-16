import { tw, type Corner, type CornerConfig, type Point } from "./utils";

export type GameTheme = "cyberpunk" | "witcher";

export type Theme = "default" | GameTheme;

export const THEME_CLASSES: Record<
  Theme | "default",
  Record<"text" | "label" | "background" | "font", string> & { border: Record<"text" | "border", string> }
> = {
  default: {
    border: { text: tw`text-red-dark`, border: tw`border-red-dark` },
    text: tw`text-zinc-300`,
    label: tw`text-zinc-300`,
    font: tw``,
    background: tw`bg-zinc-800`,
  },
  cyberpunk: {
    border: { text: tw`text-yellow`, border: tw`border-yellow` },
    text: tw`text-cyan`,
    label: tw`text-yellow`,
    font: tw``,
    background: tw`bg-black`,
  },
  witcher: {
    border: { text: tw`text-zinc-400`, border: tw`border-zinc-400` },
    text: tw`text-zinc-300`,
    label: tw`text-witcher-gold`,
    font: tw`font-witcher`,
    background: tw`bg-zinc-700`,
  },
};

export const THEME_CORNERS: Partial<Record<Theme, Record<"points" | "outline", Point[]>>> = {
  cyberpunk: {
    points: [
      [0, 15],
      [0, 14],
      [14, 0],
      [15, 0],
    ],
    outline: [
      [0, 15],
      [0, 14],
      [14, 0],
      [15, 0],
    ],
  },

  witcher: {
    points: [
      [0, 15],
      [0, 5],
      [5, 5],
      [5, 15],
      [15, 15],
      [15, 5],
      [5, 5],
      [5, 0],
      [15, 0],
    ],
    outline: [
      [0, 15],
      [0, 5],
      [5, 5],
      [5, 0],
      [15, 0],
    ],
  },
};

function toRelativeCorner(points: Point[], corner: Corner) {
  if (corner == "tr" || corner == "bl") points = points.toReversed();

  return points.map((point) => {
    switch (corner) {
      case "tl":
        return `${point[0]}px ${point[1]}px`;
      case "tr":
        return `calc(100% - ${point[0]}px) ${point[1]}px`;
      case "br":
        return `calc(100% - ${point[0]}px) calc(100% - ${point[1]}px)`;
      case "bl":
        return `${point[0]}px calc(100% - ${point[1]}px)`;
    }
  });
}

export function scalePath(path: Point[], scale: number): Point[] {
  return path.map((p) => [p[0] * scale, p[1] * scale]);
}

export function outlineToPath(
  outline: Point[],
  { tl, tr, br, bl }: CornerConfig = { tl: true, tr: true, br: true, bl: true },
) {
  return (
    "polygon(" +
    [
      // Top left
      tl ? toRelativeCorner(outline, "tl") : "0 0",
      // Top right
      tr ? toRelativeCorner(outline, "tr") : "100% 0",
      // Bottom right
      br ? toRelativeCorner(outline, "br") : "100% 100%",
      // Bottom left
      bl ? toRelativeCorner(outline, "bl") : "0 100%",
    ]
      .flat()
      .join(", ") +
    ")"
  );
}
