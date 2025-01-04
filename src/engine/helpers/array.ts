type ArrayType<T> = T[];

/**
   * Returns a random element from given array
   */
export function pickRandom<Type> (list: Type[]): Type {
  return list[Math.floor((Math.random() * list.length))];
}

/**
 * Reverses the portion of array from start to end index.
 * 
 * changes original array
 */
export function reverse<Type> (arr: Type[], start: number, end: number) {
  while (start < end) {
    [arr[start], arr[end]] = [arr[end], arr[start]]; // Swap elements
    start++;
    end--;
  }
};

/**
 * Rotates the array in-place in clockwise direction(right).
 * 
 * changes original array
 */
export function rotateArray<Type> (list: Type[], rotation: number): Type[] {
  const len = list.length;
  const newList: Type[] = [];

  for (let i = 0; i < len; i++) {
    newList[i] = list[(i - rotation + len) % len]
  }
  return newList;
}

export function rotateArrayInPlace<Type>(list: Type[], rotation: number): Type[] {
  const len = list.length;
  rotation = ((rotation % len) + len) % len; // Normalize rotation to handle negative values or large numbers

  // Step 1: Reverse the entire array
  reverse(list, 0, len - 1);
  // Step 2: Reverse the first part (rotated portion)
  reverse(list, 0, rotation - 1);
  // Step 3: Reverse the second part
  reverse(list, rotation, len - 1);

  return list;
}
