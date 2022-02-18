import { AbstractQueue, Node } from "./Queue";


export const Stack = <T>(): AbstractQueue<T> => {
  let top: Node<T> | null = null
  return {
    top: () => top,
    push: (value: T) => {
      top = { value, next: top }
    },
    empty: () => top === null,
    popOrThrow: () => {
      if(top === null) throw new Error("Empty stack");
      const value = top.value;
      top = top.next;
      return value;
    },
  }
}