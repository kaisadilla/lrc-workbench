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

/**
 * Given the hex color of a background, calculates whether the color of higher
 * contrast for text in that background is black or white.
 * @param background 
 */
export function chooseW3CTextColor (background: string) : 'black' | 'white' {
  // Done according to this: https://stackoverflow.com/a/3943023/23342298

  if (background === "transparent") return 'black';

  if (background.startsWith("#")) background = background.substring(1, 7);
  if (background.length < 6) {
    console.error(`'${background}' is not a valid color.`);
    return 'black';
  };


  const r = parseInt(background.substring(0, 2), 16);
  const g = parseInt(background.substring(2, 4), 16);
  const b = parseInt(background.substring(4, 6), 16);

  let rVal = calculateVal(r);
  let gVal = calculateVal(g);
  let bVal = calculateVal(b);

  const l = (0.2126 * rVal) + (0.7152 * gVal) + (0.0722 * bVal);

  return l > 0.179 ? 'black' : 'white';

  function calculateVal (c: number) {
    c /= 255;

    if (c < 0.04045) {
      return c / 12.92;
    }
    else {
      return ((c + 0.055) / 1.055) ** 2.4;
    }
  }
}

export function rgbToHex (r: number, g: number, b: number): string {
  return (
    "#" +
    r.toString(16).padStart(2, "0") +
    g.toString(16).padStart(2, "0") +
    b.toString(16).padStart(2, "0")
  );
}

export function openFile (accept: string = "*/*") : Promise<File | null> {
  return new Promise(resolve => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.style.display = 'none';

    document.body.appendChild(input);

    input.onchange = () => {
      const file = input.files?.[0] ?? null;
      document.body.removeChild(input);
      resolve(file);
    };

    input.click();
  });
}

export function jsonSortKeysCallback (key: string, value: any) {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return Object.keys(value)
      .sort()
      .reduce((sorted, k) => {
        sorted[k] = value[k];
        return sorted;
      }, {} as Record<string, any>);
  }

  return value;
}

export function getNamespaces (ids: string[]) : Set<string> {
  const namespaces = new Set<string>();

  for (const id of ids) {
    const rl = id.split(":");
    namespaces.add(rl[0]);
  }

  return namespaces;
}

/**
 * Returns true if the target of an event is editable - i.e. it receives
 * keyboard input.
 * @param target The target of an event (evt.target).
 */
export function isEventTargetEditable (target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;

  if (target.isContentEditable) return true;

  const tag = target.tagName.toLowerCase();

  if (tag === 'textarea') return true;

  if (tag === 'input') {
    const input = target as HTMLInputElement;
    const type = input.type?.toLowerCase() ?? 'text';

    return type === 'text'
      || type === 'search'
      || type === 'password'
      || type === 'email'
      || type === 'url'
      || type === 'tel'
      || type === 'number'
      ;
  }

  return false;
}

export async function getAudioDuration (url: string) {
  const audio = new Audio(url);

  await new Promise(
    res => audio.addEventListener('loadedmetadata', res, { once: true })
  );

  return Math.floor(audio.duration * 1000);
}

/**
 * Given a string, returns the indices of the start and end of the line given.
 * @param str The string in which to run the calculation.
 * @param line The index of the line (starting from 0).
 */
export function getLineSpan (
  str: string, line: number, separator: string = "\n"
) {
  const lines = str.split(separator);
  const start = lines.slice(0, line).join(separator).length + (line > 0 ? 1 : 0);
  const end = start + lines[line].length;
  
  return { start, end, };
}
