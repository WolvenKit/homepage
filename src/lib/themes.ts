import { tw, type Corner, type CornerConfig, type Point } from "./utils";

export type Theme = "Cyberpunk" | "Witcher";

export const THEME_COLORS = {
  Cyberpunk: {
    border: { text: tw`text-red`, border: tw`border-red` },
    background: tw`bg-black`,
  },
  Witcher: {
    border: { text: tw`text-zinc-400`, border: tw`border-zinc-400` },
    background: tw`bg-zinc-700`,
  },
} satisfies Record<Theme, { border: Record<"text" | "border", string>; background: string }>;

export const THEME_CORNERS = {
  Cyberpunk: {
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

  Witcher: {
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
} satisfies Record<Theme, Record<"points" | "outline", Point[]>>;

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
