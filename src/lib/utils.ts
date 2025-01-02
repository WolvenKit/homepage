import { error, isHttpError } from "@sveltejs/kit";

/** Just a flag for template string to signify tailwind classes for IntelliSense */
export const tw = String.raw;
/** Just a flag for template string to signify GraphQL */
export const gql = String.raw;

export type Point = [x: number, y: number];

export type Corner = "tl" | "tr" | "bl" | "br";
export type CornerConfig = Partial<Record<Corner, boolean>>;

export type Combine<T extends object, U extends object> = T | U | (T & U);

export type Promisable<T> = Promise<T> | T;

export function isFn<Args extends [], Return>(input: unknown): input is (...args: Args) => Return {
  return typeof input == "function";
}

export function asPromise<T>(promisable: Promisable<T>): Promise<T> {
  return promisable && typeof promisable == "object" && "then" in promisable ? promisable : Promise.resolve(promisable);
}

export async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export function jsonLd(content: Record<string, unknown>) {
  return '<script type="application/ld+json">' + JSON.stringify(content) + "</" + "script>";
}

export function logAndReturnError(e: Error, base?: Partial<App.Error>) {
  console.error(e);

  if (isHttpError(e)) throw e;

  return error("status" in e ? (e.status as number) : 500, {
    ...base,
    name: e.name,
    message: e.message,
    errno: getFromErrorOrCause<number>(e, "errno"),
    code: getFromErrorOrCause<string>(e, "code"),
  });
}

function getFromErrorOrCause<T>(e: Error, field: string): T | undefined {
  if (field in e) return e[field as keyof typeof e] as T;
  return e.cause && field in (e.cause as Error) ? e.cause[field as keyof typeof e.cause] : undefined;
}

export function wrapCatch(baseError?: Partial<App.Error>) {
  return (e: Error) => logAndReturnError(e, baseError);
}
