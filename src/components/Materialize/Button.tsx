import { Show, createMemo } from "solid-js";

export function Button(props) {
  const { disabled = false, className = "", size, onClick, style = {} } = props;
  const computedClass = createMemo((): string => {
    let cn = "waves-effect waves-light";
    if (disabled) cn += ` disabled`;
    if (size === "small") cn += ` btn-small`;
    else if (size === "large") cn += ` btn-large`;
    else cn += ` btn`;
    if (className) cn += ` ${className}`;
    return cn;
  });
  return <a class={computedClass()} onClick={onClick} style={style}>
    <Show when={props.icon} children={<></>}>
      <i class="material-icons left">{props.icon}</i>
    </Show>
    {props.children}
  </a>
}