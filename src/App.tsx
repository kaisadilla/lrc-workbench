import { Group, Panel } from 'react-resizable-panels';
import AppRibbon from './components/AppRibbon';
import ResizableSeparator from './components/ResizableSeparator';

// eslint-disable-next-line import/order
import '@mantine/core/styles.css';
// eslint-disable-next-line import/order
import './styles/root.scss';

import styles from './App.module.scss';
import DataPanel from './components/DataPanel';
import LyricsTimeline from './components/LyricsTimeline';

function App () {
  return (
    <div className={styles.app}>
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
  )
};

export default App
