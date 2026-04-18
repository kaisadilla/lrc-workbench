import { modals } from '@mantine/modals';
import { ArrowLineDownIcon, FilePlusIcon, FloppyDiskIcon, FolderOpenIcon, InfoIcon } from '@phosphor-icons/react';
import { saveAs } from "file-saver";
import { useDispatch, useSelector } from 'react-redux';
import { useSongFile } from '../context/useSongFile';
import Button from '../elements/Button';
import DescriptiveTooltip from '../elements/DescriptiveTooltip';
import Local from '../Local';
import { fileActions, generateLrcFile } from '../state/fileSlice';
import type { RootState } from '../state/store';
import { openFile } from '../util';
import styles from './AppRibbon.module.scss';

export interface AppRibbonProps {
  onStartTour: () => void;
}

function AppRibbon ({
  onStartTour,
}: AppRibbonProps) {
  const file = useSelector((state: RootState) => state.file);
  const dispatch = useDispatch();

  const songCtx = useSongFile();

  const newModal = () => modals.openConfirmModal({
    title: "New document",
    children: "Your changes will be discarded. Are you sure?",
    labels: { confirm: "Accept", cancel: "Cancel", },
    onConfirm: handleNew
  })

  return (
    <div className={styles.nav}>
      <DescriptiveTooltip
        label={"New file"}
        description={"Discard all changes and get a blank file."}
        position='right'
      >
        <Button
          onClick={newModal}
        >
          <FilePlusIcon size={24} weight='thin' />
        </Button>
      </DescriptiveTooltip>

      <DescriptiveTooltip
        label={"Open file"}
        description={"Open a .lrc file."}
        position='right'
      >
        <Button
          onClick={handleOpen}
        >
          <FolderOpenIcon size={24} weight='thin' />
        </Button>
      </DescriptiveTooltip>
      
      <DescriptiveTooltip
        id="ribbon-commit-button"
        label={"Commit"}
        description={"Commit changes locally, preserving them after you close this app."}
        position='right'
      >
        <Button
          onClick={handleCommit}
        >
          <ArrowLineDownIcon size={24} weight='thin' />
        </Button>
      </DescriptiveTooltip>
      
      <DescriptiveTooltip
        id="ribbon-save-button"
        label={"Save file"}
        description={"Save the current document as a .lrc file, ready to use elsewhere."}
        position='right'
      >
        <Button
          onClick={handleSave}
        >
          <FloppyDiskIcon size={24} weight='thin' />
        </Button>
      </DescriptiveTooltip>

      <DescriptiveTooltip
        label={"Start tour"}
        description={"Do a quick tour around this app's interface to explain it."}
      > 
        <Button
          onClick={onStartTour}
        >
          <InfoIcon size={24} weight='thin' />
        </Button>
      </DescriptiveTooltip>
    </div>
  );

  function handleNew () {
    dispatch(fileActions.restart());
    
    songCtx.setFileUrl(null);
  }

  async function handleOpen () {
    const file = await openFile(".lrc,.txt,*");
    if (!file) return;

    const txt = await file.text();
    dispatch(fileActions.openFile(txt));
  }

  function handleCommit () {
    Local.saveFile(file);
  }

  function handleSave () {
    const txt = generateLrcFile(file);

    const blob = new Blob([txt], {
      type: "text/plain;charset=utf-8",
    });

    saveAs(blob, `${file.title.toLocaleLowerCase().replaceAll(" ", "-")}.lrc`);
  }
}

export default AppRibbon;
