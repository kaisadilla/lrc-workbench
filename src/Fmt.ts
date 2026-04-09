const Fmt = {
  timestamp (
    seconds: number,
    msDigits: number = 0,
    startAt: 'h' | 'm' | 's' = 's',
  ) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    const parts = [];

    const startAtValue = startAt === 'h' ? 3 : startAt === 'm' ? 2 : 1;
    const showHours = h > 0 || startAtValue >= 3;
    const showMins = h > 0 || m > 0 || startAtValue >= 2;
    
    if (showHours) parts.push(String(h).padStart(2, '0'));
    if (showMins) parts.push(String(m).padStart(2, '0'));

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
