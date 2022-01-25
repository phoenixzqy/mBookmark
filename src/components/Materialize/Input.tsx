import { For, Show, createEffect, createMemo, createSignal, onCleanup, onMount } from 'solid-js';

import { EnterKey } from '../../utils/constants';
import { generateElementId } from '../../utils/helpers';
import materialize from '../../utils/materialize';

export function Input(props) {
  const id = generateElementId();
  const { type = "text", onChange, onInput, style = {}, className = "", ref, disabled = false, maxlength } = props;
  const inputProps = { type, onChange, onInput, ref, disabled, maxlength };
  const value = createMemo(() => props.value)

  return (
    <div class={`input-field ${className}`} style={style}>
      <input id={id} class="validate" {...inputProps} value={value()} />
      <Show when={props.label} children={<></>}>
        <label for={id} classList={{ active: value() }}>{props.label}</label>
      </Show>
      <Show when={props.helperText} children={<></>}>
        <span class="helper-text">{props.helperText}</span>
      </Show>
    </div>
  )
}
export function TextArea(props) {
  const id = generateElementId();
  const { type = "text", onChange, onInput, style = {}, className = "", ref, rows, cols, maxlength } = props;
  const inputProps = { type, onChange, onInput, ref, rows, cols, maxlength };
  const value = createMemo(() => props.value)

  return (
    <div class={`input-field mbm-textarea ${className}`} style={style}>
      <textarea id={id} class="validate" {...inputProps} value={value()} />
      <Show when={props.label} children={<></>}>
        <label for={id} classList={{ active: value() }}>{props.label}</label>
      </Show>
      <Show when={props.helperText} children={<></>}>
        <span class="helper-text">{props.helperText}</span>
      </Show>
    </div>
  )
}

export function SearchBar(props) {
  const { type = "text", onChange, onInput, style = {}, className = "", ref } = props;
  const inputProps = { type, onChange, onInput, ref };
  const value = createMemo(() => props.value || "")
  return (
    <div class={`mbm-search-bar ${className}`} style={style}>
      <label><i class="material-icons left">search</i></label>
      <input {...inputProps} value={value()} />
    </div>
  );
}


export function Chips(props) {
  const {
    options = {},
    label = "",
    helperText = "",
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
    try {
      if (inputEle()) {
        (inputEle() as HTMLElement).removeEventListener("focus", onFocuse);
        (inputEle() as HTMLElement).removeEventListener("blur", () => onBlur);
      }
    } catch (e) {
      console.error(e);
    }
  })
  return (
    <div class="input-field">
      <div id={id} class="chips chips-placeholder chips-autocomplete"></div>
      <Show when={label} children={<></>}>
        <label for={id} style={{ top: "-25px" }} classList={{ "keywords-input-label-active": focused() }}>{label}</label>
      </Show>
      <Show when={helperText} children={<></>}>
        <span class="helper-text" style={{ "margin-top": "-14px" }}>{helperText}</span>
      </Show>
    </div>

  );
}

export interface SelectOpion {
  value: string;
  disabled?: boolean;
  selected?: boolean;
  display: string
}
export function Select(props) {
  let ref;
  const { label = "", options = [] as SelectOpion[], onSelected } = props;
  const [instance, setInstance] = createSignal(undefined as any);
  let id = generateElementId();
  onMount(() => {
    const ele = document.getElementById(id);
    const instance = materialize.FormSelect.init(ele);
    setInstance(instance);
    let list: HTMLElement[] = Array.from(ref.querySelectorAll(".select-dropdown li")) || [];
    const baseId = ref.querySelector("ul").id;
    list.forEach(item => item.addEventListener("click", (e: MouseEvent) => {
      const index = (e.target as HTMLElement)?.parentElement?.id.replace(baseId, "");
      console.log(index)
      if (index !== undefined && typeof onSelected === "function") {
        onSelected(options[index].value);
      }
    }));
    list.forEach(item => item.addEventListener("keyup", (e: KeyboardEvent) => {
      if (e.key !== EnterKey) return;
      const index = (e.target as HTMLElement)?.parentElement?.id.replace(baseId, "");
      if (index !== undefined && typeof onSelected === "function") {
        onSelected(options[index].value);
      }
    }));
  });
  onCleanup(() => {
    instance().destroy();
  });
  return <div ref={ref} class="input-field">
    <select id={id}>
      <For each={options} children={<></>}>
        {(item: SelectOpion) => <option value={item.value} disabled={item.disabled ? true : false} selected={item.selected ? true : false}>{item.display}</option>}
      </For>
    </select>
    <label>{label}</label>
  </div>
}