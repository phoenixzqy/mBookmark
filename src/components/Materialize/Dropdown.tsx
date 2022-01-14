import { createMemo, onMount } from 'solid-js';

import { generateElementId } from '../../utils/helpers';

export function Dropdown(props) {
  let ref: HTMLElement;
  const { className = "", style = {}, useContextMenu = false } = props;
  const id = generateElementId();
  const menuItems = createMemo(() => props.menuItems || []);

  /**
   * remove dropdown menu element from body
   * @param e 
   */
  const hideMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById(id).remove();
  };
  /**
   * create dropdown menu element to body
   * @param e 
   */
  const showMenu = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    let root = document.createElement("div");
    root.id = id;
    root.classList.add("mbm-dropdown-container");
    let markup = `<ul class="dropdown-content">
      ${menuItems().map(item => `<li><a href="#!">${item.label}</a></li>`).join("")}
    </ul>`;
    root.innerHTML = markup;
    // add event listeners to menu items
    Array.from(root.querySelectorAll("li")).forEach((ele, i) => {
      if (typeof menuItems()[i].onClick === "function") {
        ele.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          // user defined function
          menuItems()[i].onClick(e);
          hideMenu(e);
        }
      }
    });
    // set menu position
    const menulistEle = root.querySelector("ul");
    menulistEle.style.left = e.clientX + "px";
    menulistEle.style.top = e.clientY + "px";
    // hide menu when user click on empty space
    root.onclick = e => hideMenu(e);
    root.oncontextmenu = e => hideMenu(e);

    document.body.appendChild(root);
  };
  onMount(() => {
    if (useContextMenu) {
      ref.oncontextmenu = (e) => showMenu(e);
    } else {
      ref.onclick = (e) => showMenu(e);
    }
  });

  return (
    <div ref={ref} data-target={id} style={style} class={className}>
      {props.children}
    </div>
  );
}