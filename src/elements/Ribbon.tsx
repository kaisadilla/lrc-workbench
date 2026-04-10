import type { DivProps } from "../types";
import { $cl } from "../util";
import Ribbon_Button from "./Ribbon.Button";
import styles from "./Ribbon.module.scss";

export interface RibbonProps extends DivProps {
  position?: 'top' | 'bottom';
  align?: 'left' | 'right';
  children?: React.ReactNode;
}

function Ribbon ({
  position = 'top',
  align = 'left',
  children,
  className,
  ...divProps
}: RibbonProps) {
  return (
    <div
      className={$cl(styles.ribbon, className)}
      data-position={position}
      data-align={align}
      {...divProps}
    >
      {children}
    </div>
  );
}

Ribbon.Button = Ribbon_Button;

export default Ribbon;
