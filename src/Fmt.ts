const Fmt = {
  timestamp (seconds: number, msDigits: number = 0) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    const parts = [];
    
    if (h > 0) parts.push(String(h).padStart(2, '0'));
    
    if (h > 0 || m > 0) parts.push(String(m).padStart(2, '0'));

    let secondsStr = String(s).padStart(2, '0');
    if (msDigits > 0) {
      const ms = Math.round((seconds % 1) * 1000);

      secondsStr += '.' + String(ms).padStart(msDigits, '0');
    }

    parts.push(secondsStr);

    return parts.join(':');
  },
}

export default Fmt;
