import { notifications } from '@mantine/notifications';
import { Editor } from '@monaco-editor/react';
import { ArrowCounterClockwiseIcon, ArrowLineDownIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Ribbon from '../elements/Ribbon';
import { fileActions, generateLrcFile, openLrcFile, validateLrc } from '../state/fileSlice';
import type { RootState } from '../state/store';
import styles from './CodeEditor.module.scss';

export interface CodeEditorProps {
  
}

function CodeEditor (props: CodeEditorProps) {
  const file = useSelector((state: RootState) => state.file);
  const dispatch = useDispatch();

  const [ code, setCode ] = useState(generateLrcFile(file));

  return (
    <div className={styles.viewport}>
      <div className={styles.editorContainer}>
        <Editor
          defaultLanguage='ini'
          value={code}
          onChange={txt => setCode(txt ?? "")}
          theme='vs-light'
          options={{
            fontSize: 13,
            minimap: {
              enabled: true
            }
          }}
        />
      </div>
      
      <Ribbon align='right' position='bottom'>
        <Ribbon.Button
          tooltip="Apply your changes, or show an error if the file is no longer valid."
          onClick={handleApply}
        >
          <ArrowLineDownIcon size={24} weight='thin' />
          <div>Apply</div>
        </Ribbon.Button>

        <Ribbon.Button
          tooltip="Discard your changes to the code."
          onClick={handleDiscard}
        >
          <ArrowCounterClockwiseIcon size={24} weight='thin' />
          <div>Discard</div>
        </Ribbon.Button>
      </Ribbon>
    </div>
  );

  function handleApply () {
    try {
      validateLrc(code);

      dispatch(fileActions.openFile(code));

      setCode(generateLrcFile(openLrcFile(code)));

      notifications.show({
        title: "Success",
        message: "Your changes have been applied."
      });
    }
    catch (err) {
      console.info(err);

      notifications.show({
        color: 'red',
        title: 'Error',
        message: `Invalid file content. No changes were applied. (${err})`,
      });
    }
  }

  function handleDiscard () {
    setCode(generateLrcFile(file));
  }
}

export default CodeEditor;
