import { Button, Textarea, TextInput, Tooltip } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { TOOL_NAME, TOOL_VERSION } from '../Constants';
import { useSongFile } from '../context/useSongFile';
import TimeAmountInput from '../elements/TimeAmountInput';
import useReduxStringField from '../hooks/useReduxStringField';
import { fileActions } from '../state/fileSlice';
import type { RootState } from '../state/store';
import { getAudioDuration, getLineSpan, openFile } from '../util';
import styles from './DataPanel.module.scss';

const ENDL = "\n";

export interface DataPanelProps {
  
}

function DataPanel ({
  
}: DataPanelProps) {
  const songCtx = useSongFile();

  const file = useSelector((state: RootState) => state.file);
  const dispatch = useDispatch();

  const [ lyrics, setLyrics ] = useState("a\nb");

  const lyricsRef = useRef<HTMLTextAreaElement>(null);

  const title = useReduxStringField(
    file.title,
    v => fileActions.updateDataField({ field: 'title', value: v, }),
  );
  const artist = useReduxStringField(
    file.artist,
    v => fileActions.updateDataField({ field: 'artist', value: v, }),
  );
  const album = useReduxStringField(
    file.album,
    v => fileActions.updateDataField({ field: 'album', value: v, }),
  );
  const author = useReduxStringField(
    file.author,
    v => fileActions.updateDataField({ field: 'author', value: v, }),
  );
  const lyricist = useReduxStringField(
    file.lyricist,
    v => fileActions.updateDataField({ field: 'lyricist', value: v, }),
  );
  const by = useReduxStringField(
    file.by,
    v => fileActions.updateDataField({ field: 'by', value: v, }),
  );

  useEffect(() => {
    setLyrics(file.lyrics.join(ENDL));
  }, [file.lyrics]);

  useEffect(() => {
    if (songCtx.highlightedLine === null) return;
    if (!lyricsRef.current) return; 

    const span = getLineSpan(file.lyrics.join(ENDL), songCtx.highlightedLine);
    
    lyricsRef.current.focus();
    lyricsRef.current.setSelectionRange(span.start, span.end);
    
    songCtx.setHighlightedLine(null);
  }, [songCtx.highlightedLine]);

  return (
    <div className={styles.panel}>
      <div className={styles.form}>
        <Tooltip
          label="Open a song file to import some of its data and to be able to play it."
        >
          <Button
            onClick={handleOpenSong}
          >
            Open song file
          </Button>
        </Tooltip>

        <TextInput
          label="Title"
          placeholder="The song's title"
          value={title.value}
          onChange={title.handleChange}
          onBlur={title.handleBlur}
        />

        <div className={styles.row}>
          <TextInput
            label="Artist"
            placeholder="The artist(s) interpreting the song."
            value={artist.value}
            onChange={artist.handleChange}
            onBlur={artist.handleBlur}
          />

          <TextInput
            label="Album"
            placeholder="The album the song belongs to."
            value={album.value}
            onChange={album.handleChange}
            onBlur={album.handleBlur}
          />
        </div>

        <div className={styles.row}>
          <TextInput
            label="Author"
            placeholder="The author of the song."
            value={author.value}
            onChange={author.handleChange}
            onBlur={author.handleBlur}
          />

          <TextInput
            label="Lyricist"
            placeholder="The author of the song's lyrics."
            value={lyricist.value}
            onChange={lyricist.handleChange}
            onBlur={lyricist.handleBlur}
          />
        </div>

        <TimeAmountInput
          label="Length"
          tooltip="The duration of the song."
          value={file.length}
          onBlur={handleTimeBlur}
          required
        />

        <TextInput
          label="Offset (ms)"
          placeholder="An offset, in milliseconds, indicating how earlier lyrics appear before their explicit timestamp."
        />

        <TextInput
          label="By"
          placeholder="You: the author of this file."
          value={by.value}
          onChange={by.handleChange}
          onBlur={by.handleBlur}
        />

        <Textarea
          ref={lyricsRef}
          classNames={{
            root: styles.lyricsTextarea,
            wrapper: styles.lyricsTextareaWrapper,
            input: styles.lyricsTextareaInput,
          }}
          label="Lyrics"
          placeholder="One line per line that will appear in the file."
          value={lyrics}
          onChange={evt => setLyrics(evt.currentTarget.value)}
          onBlur={handleLyricsBlur}
        />
      </div>

      <div className={styles.appInfo}>
        {TOOL_NAME} — {TOOL_VERSION} (BETA)
      </div>
    </div>
  );

  async function handleOpenSong () {
    const f = await openFile("audio/*");
    if (!f) return;

    const url = URL.createObjectURL(f);
    songCtx.setFileUrl(url);

    const duration = await getAudioDuration(url);
    if (duration === undefined) return;
    dispatch(fileActions.updateLength(duration));
  }

  function handleLyricsBlur (
    evt: React.FocusEvent<HTMLTextAreaElement, Element>
  ) {
    const lines = evt.currentTarget.value.split("\n").filter(l => l !== "");

    dispatch(fileActions.updateLyrics(lines));
  }

  function handleTimeBlur (ms: number) {
    dispatch(fileActions.updateLength(ms));
  }
}

export default DataPanel;
