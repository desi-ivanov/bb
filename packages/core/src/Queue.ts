export type Node<T> = {
  value: T
  next: Node<T> | null
}

export type AbstractQueue<T> = {
  top: () => Node<T> | null
  push: (value: T) => void
  empty: () => boolean
  popOrThrow: () => T
}

export const Queue = <T>() => {
  let top: Node<T> | null = null
  let bot: Node<T> | null = null
  return {
    top: () => top,
    push: (value: T) => {
      const node = { value, next: null }
      if(bot === null) {
        bot = node
        top = bot
      } else {
        bot.next = node
        bot = node
      }
    },
    empty: () => top === null,
    popOrThrow: () => {
      if(top === null) throw new Error("Empty queue");
      const value = top.value;
      top = top.next;
      if(top === null) bot = null;
      return value;
    },
  }
}