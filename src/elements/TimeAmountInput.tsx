import { Input, NumberInput, type InputWrapperProps } from '@mantine/core';
import { useEffect, useState, type ComponentProps } from 'react';
import styles from './TimeAmountInput.module.scss';

type NumberInputEvt = Parameters<
  NonNullable<ComponentProps<typeof NumberInput>['onChange']>
>[0];

export interface TimeAmountInputProps extends Omit<InputWrapperProps, 'onBlur'> {
  label?: string;
  tooltip?: string;
  required?: boolean;
  /**
   * The amount of time, in milliseconds.
   */
  value?: number;
  onBlur?: (value: number) => void;
}

function TimeAmountInput ({
  label,
  tooltip,
  required,
  value,
  onBlur,
  ...inputWrapperProps
}: TimeAmountInputProps) {
  value ??= 0;

  const [ minutes, setMinutes ] = useState(Math.floor(value / 60_000));
  const [ seconds, setSeconds ] = useState(Math.floor((value % 60_000) / 1000));
  const [ ms, setMs ] = useState(value % 1000);

  useEffect(() => {
    setMinutes(Math.floor(value / 60_000));
    setSeconds(Math.floor((value % 60_000) / 1000));
    setMs(value % 1000);
  }, [value]);

  return (
    <Input.Wrapper
      label={label}
      required={required}
      onBlur={handleBlur}
      {...inputWrapperProps}
    >
      <div className={styles.container}>
        <NumberInput
          allowDecimal={false}
          allowNegative={false}
          clampBehavior='blur'
          min={0}
          hideControls
          w={60}
          style={{ textAlign: 'end', }}
          value={minutes}
          onChange={handleChangeMinutes}
        />
        <div>:</div>
        <NumberInput
          allowDecimal={false}
          allowNegative={false}
          clampBehavior='blur'
          min={0}
          hideControls
          w={60}
          value={seconds}
          onChange={handleChangeSeconds}
        />
      </div>
    </Input.Wrapper>
  );

  function handleChangeMinutes (evt: NumberInputEvt) {
    setMinutes(Number(evt.valueOf()));
  }

  function handleChangeSeconds (evt: NumberInputEvt) {
    setSeconds(Number(evt.valueOf()));
  }

  function handleBlur () {
    onBlur?.((minutes * 60_000) + (seconds * 1_000) + ms);
  }
}

export default TimeAmountInput;
