import { Show, createEffect, createMemo, createSignal, onCleanup, onMount } from 'solid-js';

import { generateElementId } from '../../utils/helpers';
import materialize from '../../utils/materialize';

export function Input(props) {
  const id = generateElementId();
  const { type = "text", onChange, onInput, style = {}, className = "" } = props;
  const inputProps = { type, onChange, onInput };
  const value = createMemo(() => props.value)

  return (
    <div class={`input-field ${className}`} style={style}>
      <input id={id} class="validate" {...inputProps} value={value()} />
      <Show when={props.label} children={<></>}>
        <label for={id}>{props.label}</label>
      </Show>
    </div>
  )
}


export function Chips(props) {
  const {
    options = {},
    label = "",
    onChange = (v) => { }
  } = props;
  const id = generateElementId();
  const [focused, setFocused] = createSignal(false);
  const [inputEle, setInputEle] = createSignal();
  const onFocuse = () => {
    setFocused(true);
  }
  const onBlur = () => {
    setFocused(false);
  }
  const onChipChange = () => {
    const kw = materialize.Chips.getInstance(document.getElementById(id)).chipsData;
    onChange(kw);
  }
  createEffect(() => {
    if (inputEle()) {
      // materialize.Autocomplete.getInstance(inputEle()).updateData(props.options?.autocompleteOptions?.data || {});
      // update chips data and autocomplete data
      materialize.Chips.init(
        document.getElementById(id),
        {
          ...props.options,
          onChipAdd: onChipChange,
          onChipDelete: onChipChange,
        }
      );
    }
  });
  onMount(() => {
    let ele = document.getElementById(id);
    if (ele) {
      materialize.Chips.init(
        document.getElementById(id),
        {
          ...options,
          onChipAdd: onChipChange,
          onChipDelete: onChipChange,
        }
      );
      setInputEle(() => {
        const inputEle = ele.querySelector("input")
        inputEle.addEventListener("focus", onFocuse);
        inputEle.addEventListener("blur", () => onBlur);
        return inputEle;
      });
    }
  });
  onCleanup(() => {
    (inputEle() as HTMLElement).removeEventListener("focus", onFocuse);
    (inputEle() as HTMLElement).removeEventListener("blur", () => onBlur);
  })
  return (
    <div class="input-field">
      <div id={id} class="chips chips-placeholder chips-autocomplete"></div>
      <label for={id} style={{ top: "-25px" }} classList={{ "keywords-input-label-active": focused() }}>{label}</label>
    </div>

  );
}