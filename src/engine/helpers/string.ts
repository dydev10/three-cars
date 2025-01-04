  /**
   * Reverse given string
   */
  export const reverseString = (s: string): string => {
    // maybe fixed bugs by passing empty string to split
    return s?.split('').reverse().join('');
  }
