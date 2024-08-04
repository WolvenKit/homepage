/** Just a flag for template string to signify tailwind classes for IntelliSense */
export const tw = String.raw;

export type Point = [x: number, y: number];

export type Corner = "tl" | "tr" | "bl" | "br";
export type CornerConfig = Partial<Record<Corner, boolean>>;

export type Combine<T extends object, U extends object> = T | U | (T & U);
