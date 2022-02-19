import { AbstractQueue, Node } from "./Queue";

export const Stack = <T>(): AbstractQueue<T> => {
  let top: Node<T> | null = null;
  return {
    add: (value: T) => {
      top = { value, next: top };
    },
    empty: () => top === null,
    nextOrThrow: () => {
      if (top === null) throw new Error("Empty stack");
      const value = top.value;
      top = top.next;
      return value;
    },
  };
};
