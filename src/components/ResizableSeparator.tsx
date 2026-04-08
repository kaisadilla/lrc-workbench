import { Separator } from 'react-resizable-panels';
import styles from './ResizableSeparator.module.scss';

export interface ResizableSeparatorProps {
  
}

function ResizableSeparator (props: ResizableSeparatorProps) {

  return (
    <Separator className={styles.separator}>
      <div />
    </Separator>
  );
}

export default ResizableSeparator;
