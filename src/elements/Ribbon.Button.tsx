import { $cl } from '../util';
import DescriptiveTooltip from './DescriptiveTooltip';
import styles from './Ribbon.Button.module.scss';

export interface Ribbon_ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>
{
  variant?: 'danger';
  label?: string;
  tooltip?: string;
  onClick?: () => void;
}

function Ribbon_Button ({
  variant,
  label,
  tooltip,
  className,
  children,
  onClick,
  ...buttonProps
}: Ribbon_ButtonProps) {
  if (tooltip) return (
    <DescriptiveTooltip
      label={label}
      description={tooltip}
    >
      <Ribbon_Button
        className={className}
        variant={variant}
        onClick={onClick}
        {...buttonProps}
      >
        {children}
      </Ribbon_Button>
    </DescriptiveTooltip>
  );

  return (
    <button
      {...buttonProps}
      className={$cl(styles.button, className)}
      data-variant={variant}
      onClick={() => onClick?.()}
    >
      {children}
    </button>
  );
}

export default Ribbon_Button;
