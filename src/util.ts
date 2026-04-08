/**
 * Generates the className string from the arguments given.
 * Two types of arguments can be passed:
 ** A string, which will be added to the class names.
 ** An array containing a string and a boolean. The string will be added as
 * a class name only if the boolean given is true.
 * @param params 
 * @returns 
 */
export function $cl(
  ...params: (string | boolean | [string, boolean | undefined] | undefined | null)[]
): string | undefined {
  let str = "";

  for (const classEntry of params) {
    if (classEntry === undefined) {
      continue;
    }
    if (classEntry === null) {
      continue;
    }
    if (classEntry === false) {
      continue;
    }
    // if the entry is conditional.
    if (Array.isArray(classEntry)) {
      if (classEntry[1]) {
        str += classEntry[0] + " ";
      }
    }
    else {
      str += classEntry + " ";
    }
  }

  const cls = str.trim();
  return cls === "" ? undefined : cls;
}

export function range (end: number) : number[] {
  return Array.from({ length: end, }, (_, i) => i);
}
