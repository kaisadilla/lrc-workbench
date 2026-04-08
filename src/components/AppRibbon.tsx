import styles from './AppRibbon.module.scss';

export interface AppRibbonProps {
  
}

function AppRibbon (props: AppRibbonProps) {

  return (
    <div className={styles.nav}>
      NAV
    </div>
  );
}

export default AppRibbon;
