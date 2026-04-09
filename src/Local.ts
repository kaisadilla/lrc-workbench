import type { FileSlice } from "./state/fileSlice";

const KEY_PREFIX = "azaria/lrc-workbench";
const KEY_FILE = KEY_PREFIX + "/file";

const Local = {
  saveFile (file: FileSlice) {
    try {
      const json = JSON.stringify(file);
      localStorage.setItem(KEY_FILE, json);
    }
    catch (err) {
      console.error("Error storing file", err);
    }
  },

  loadFile () : FileSlice | null {
    try {
      const json = localStorage.getItem(KEY_FILE);
      if (!json) return null;

      return JSON.parse(json) as FileSlice; // TODO: validate json.
    }
    catch (err) {
      console.error("Error reading file", err);
      return null;
    }
  },
};

export default Local;
