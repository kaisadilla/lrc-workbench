import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../state/store";

export default function useReduxStringField (
  stateValue: string,
  getAction: (value: string) => Parameters<AppDispatch>[0],
) {
  const dispatch = useDispatch();
  const [ value, setValue ] = useState(stateValue);

  useEffect(() => {
    setValue(stateValue);
  }, [stateValue]);

  function handleChange (evt: React.ChangeEvent<HTMLInputElement>) {
    setValue(evt.target.value);
  }

  function handleBlur (evt: React.FocusEvent<HTMLInputElement>) {
    dispatch(getAction(evt.target.value));
  }

  return {
    value: value,
    handleChange,
    handleBlur,
  }
}
