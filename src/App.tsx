import { Group, Panel } from 'react-resizable-panels';
import AppRibbon from './components/AppRibbon';
import ResizableSeparator from './components/ResizableSeparator';

// eslint-disable-next-line import/order
import '@mantine/core/styles.css';
// eslint-disable-next-line import/order
import '@mantine/notifications/styles.css';
// eslint-disable-next-line import/order
import './styles/root.scss';

import { Tabs } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useJoyride } from 'react-joyride';
import { useDispatch } from 'react-redux';
import styles from './App.module.scss';
import CodeEditor from './components/CodeEditor';
import DataPanel from './components/DataPanel';
import Lyrics from './components/Lyrics';
import LyricsTimeline from './components/LyricsTimeline';
import MusicPlayer from './components/MusicPlayer';
import { useSongFile } from './context/useSongFile';
import JOYRIDE_STEPS from './joyride';
import { fileActions } from './state/fileSlice';
import { isEventTargetEditable } from './util';

type DocTab = 'timeline' | 'code' | 'preview';

function App () {
  const dispatch = useDispatch();
  const songCtx = useSongFile();

  const [ docTab, setDocTab ] = useState<DocTab | null>('timeline');
  
  const tour = useJoyride({
    steps: JOYRIDE_STEPS,
    continuous: true,
    options: {
      spotlightRadius: 0,
      primaryColor: 'var(--color-primary)',
      backgroundColor: 'white',
      textColor: 'black',
      arrowColor: 'white',
      zIndex: 1_000_000_000,
      skipBeacon: true,
      showProgress: true,
      dismissKeyAction: 'close',
      targetWaitTimeout: 100,
    },
  });

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, [dispatch, songCtx]);

  return (
    <div className={styles.app}>
      <div className={styles.panelContainer}>
        {tour.Tour}

        <AppRibbon onStartTour={handleStartTour} />

        <Group id="lrc-workbench-app-page">
          <Panel minSize={1} defaultSize={3}>
            <DataPanel />
          </Panel>
          <ResizableSeparator />
          <Panel className={styles.editorPanel} minSize={1} defaultSize={4}>
            <Tabs
              classNames={{
                root: styles.editorTabsRoot,
                panel: styles.editorTabsPanel,
              }}
              value={docTab}
              onChange={evt => setDocTab(evt as DocTab | null)}
            >
              <Tabs.List>
                <Tabs.Tab value='timeline'>
                  Timeline
                </Tabs.Tab>

                <Tabs.Tab id="editor-panel-tab-code-button" value='code'>
                  Code
                </Tabs.Tab>

                <Tabs.Tab id="editor-panel-tab-preview-button" value='preview'>
                  Preview
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value='timeline'>
                <LyricsTimeline />
              </Tabs.Panel>

              <Tabs.Panel value='code'>
                {docTab === 'code' && <CodeEditor />}
              </Tabs.Panel>

              <Tabs.Panel value='preview'>
                <Lyrics />
              </Tabs.Panel>
            </Tabs>
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

  function handleStartTour () {
    tour.controls.start();
  }
};

export default App
