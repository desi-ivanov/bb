export type Node<T> = {
  value: T;
  next: Node<T> | null;
};

export type AbstractQueue<T> = {
  add: (value: T) => void;
  empty: () => boolean;
  nextOrThrow: () => T;
};

export const Queue = <T>(): AbstractQueue<T> => {
  let top: Node<T> | null = null;
  let bot: Node<T> | null = null;
  return {
    add: (value: T) => {
      const node = { value, next: null };
      if (bot === null) {
        bot = node;
        top = bot;
      } else {
        bot.next = node;
        bot = node;
      }
    },
    empty: () => top === null,
    nextOrThrow: () => {
      if (top === null) throw new Error("Empty queue");
      const value = top.value;
      top = top.next;
      if (top === null) bot = null;
      return value;
    },
  };
};
