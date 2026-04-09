import { Group, Panel } from 'react-resizable-panels';
import AppRibbon from './components/AppRibbon';
import ResizableSeparator from './components/ResizableSeparator';

// eslint-disable-next-line import/order
import '@mantine/core/styles.css';
// eslint-disable-next-line import/order
import './styles/root.scss';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styles from './App.module.scss';
import DataPanel from './components/DataPanel';
import LyricsTimeline from './components/LyricsTimeline';
import MusicPlayer from './components/MusicPlayer';
import { useSongFile } from './context/useSongFile';
import { fileActions } from './state/fileSlice';
import { isEventTargetEditable } from './util';

function App () {
  const dispatch = useDispatch();
  const songCtx = useSongFile();

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, [dispatch, songCtx]);

  return (
    <div className={styles.app}>
      <div className={styles.panelContainer}>
        <AppRibbon />
        <Group id="lrc-workbench-app-page">
          <Panel minSize={1} defaultSize={3}>
            <DataPanel />
          </Panel>
          <ResizableSeparator />
          <Panel minSize={1} defaultSize={4}>
            <LyricsTimeline

            />
          </Panel>
        </Group>
      </div>
      {songCtx.fileUrl && <div className={styles.playerContainer}>
        <MusicPlayer />
      </div>}
    </div>
  )
  
  function handleKeyDown (evt: KeyboardEvent) {
    if (isEventTargetEditable(evt.target)) return;
    if (songCtx.isPlaying === false) return;

    if (evt.code === 'KeyA') {
      dispatch(fileActions.addTimestamp(songCtx.time));
    }
  }
};

export default App
