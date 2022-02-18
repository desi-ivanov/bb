import { AbstractQueue } from "./Queue";

export const PriorityQueue = <T>(p: (x: T) => number): AbstractQueue<T> => {
  const heap: T[] = [];
  const compare = (a: T, b: T) => p(a) - p(b);
  const heapify = (i: number) => {
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    let largest = i;
    if(left < heap.length && compare(heap[left], heap[largest]) > 0) {
      largest = left;
    }
    if(right < heap.length && compare(heap[right], heap[largest]) > 0) {
      largest = right;
    }
    if(largest !== i) {
      const tmp = heap[i];
      heap[i] = heap[largest];
      heap[largest] = tmp;
      heapify(largest);
    }
  };
  return {
    add: (value: T) => {
      heap.push(value);
      let i = heap.length - 1;
      while(i > 0) {
        const parent = Math.floor((i - 1) / 2);
        if(compare(heap[i], heap[parent]) > 0) {
          const tmp = heap[i];
          heap[i] = heap[parent];
          heap[parent] = tmp;
          i = parent;
        } else {
          break;
        }
      }
    },
    empty: () => heap.length === 0,
    nextOrThrow: () => {
      if(heap.length === 0) throw new Error("Empty heap");
      const value = heap[0];
      heap[0] = heap[heap.length - 1];
      heap.pop();
      heapify(0);
      return value;
    }
  }
}