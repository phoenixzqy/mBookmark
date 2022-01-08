import { For, createMemo, createSignal, onCleanup, onMount } from 'solid-js';

import { generateElementId } from '../../utils/helpers';
import materialize from '../../utils/materialize';

export function Dropdown(props) {
  const { className = "", style = {}, useContextMenu = false } = props;
  const id = generateElementId();
  const menuItems = createMemo(() => props.menuItems || []);
  const options = createMemo(() => props.options);
  const [ele, setEle] = createSignal();
  const hideMenu = () => {
    const listElem = (ele() as HTMLElement).querySelector("ul");
    // hide menu
    listElem.style.display = "none";
    listElem.style.left = undefined;
    listElem.style.top = undefined;
    listElem.style.transformOrigin = undefined;
    listElem.style.opacity = undefined;
    listElem.style.transform = undefined;
  };
  onMount(() => {
    const elem = document.getElementById(`${id}-trigger`);
    setEle(elem);
    if (!elem) return;
    if (useContextMenu) {
      elem.addEventListener("contextmenu", (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const listElem = elem.querySelector("ul");
        // show menu
        listElem.style.display = "block";
        listElem.style.left = `${e.offsetX}px`;
        listElem.style.top = `${e.offsetY}px`;
        listElem.style.transformOrigin = "0px 0px";
        listElem.style.opacity = "1";
        listElem.style.transform = "scaleX(1) scaleY(1)";
        window.addEventListener("click", hideMenu);
        return;
      });
    } else {
      materialize.Dropdown.init(elem, options());
    }
  });
  onCleanup(() => {
    window.removeEventListener("click", hideMenu);
  })
  return (
    <div data-target={id} id={`${id}-trigger`} style={style} class={className}>
      {props.children}
      <ul id={id} class='dropdown-content'>
        <For each={menuItems()} children={<></>}>
          {(item) => <li><a
            href="#!"
            style={item.style || {}}
            onClick={e => {
              if (useContextMenu) {
                e.preventDefault();
                e.stopPropagation();
                hideMenu();
              }
              if (typeof item.onClick === "function") item.onClick();
            }}
          >{item.label}</a></li>}
        </For>
      </ul>
    </div>
  );
}