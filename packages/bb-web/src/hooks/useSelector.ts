import { Context, useContext, useMemo } from "react";

export const useSelector = <T, U>(ctx: Context<T>, selector: (x: T) => U): U => {
  const x = selector(useContext(ctx));
  return useMemo(() => x, [x]);
}