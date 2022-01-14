import { AppContext, AppContextState } from '../App';
import { EntryTypes, ScreenLayerTypes } from '../../utils/constants';
import { createMemo, onCleanup, onMount, useContext } from 'solid-js';

import type { BaseEntryConfig } from './Entry';
import { Draggable } from '../../utils/draggable';
import { Dropdown } from '../Materialize';
import EntryTitle from './EntryTitle';
import type { ScreenLayerContextState } from "../ScreenLayerManager";
import { ScreenLayerManagerContext } from '../ScreenLayerManager/ScreenLayerManager';
import { offset } from '../../utils/helpers';

interface BookmarkEntryConfig extends BaseEntryConfig {
  url: string,
  icon: string,
  name: string,
  description: string,
  keywords: string[]
}

export default function BookmarkEntry(props) {
  let ref;
  const { showLayer, backToPrevLayer, currentScreenLayer } = useContext(ScreenLayerManagerContext) as ScreenLayerContextState;
  const { removeEntry } = useContext(AppContext) as AppContextState;
  const config = createMemo(() => props.config as BookmarkEntryConfig);
  const { id, style = {} } = props;
  const myProps = { id, style };
  function handleClick(e) {
    window.open(config().url);
  }

  onMount(() => {
    Draggable.onDragStart(ref, (e, ele) => {
      ele.style.transform = "scale(1.2)";
      Draggable.setData({
        dragging: config(),
        dropOn: undefined,
        dropBefore: undefined,
        dropAfter: undefined
      });
    });
    Draggable.onDragOver(ref, (e, hoverEle, draggingEle) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains("entry-container")) {
        hoverEle.style.transform = "scale(1.1)";
        Draggable.setData({
          ...Draggable.getData(),
          dropOn: config(),
          dropBefore: undefined,
          dropAfter: undefined
        });
      } else {
        hoverEle.style.transform = "scale(1)";
        let data = {
          ...Draggable.getData(),
          dropOn: undefined,
          dropBefore: undefined,
          dropAfter: undefined
        };
        const draggingElePos = offset(draggingEle);
        const hoverElePos = offset(hoverEle);
        if (draggingElePos.left < hoverElePos.left) {
          data.dropBefore = config();
        } else {
          data.dropAfter = config();
        }
        Draggable.setData(data);
      }
    });
    Draggable.onDragLeave(ref, (e, hoverEle, draggingEle) => {
      if (hoverEle === draggingEle) return;
      hoverEle.style.transform = "scale(1)";
      Draggable.setData({
        ...Draggable.getData(),
        dropOn: undefined,
        dropBefore: undefined,
        dropAfter: undefined
      });
    });
  });
  onCleanup(() => {
    Draggable.clearDragStart(ref);
    Draggable.clearDragEnter(ref);
    Draggable.clearDragLeave(ref);
  });

  return (
    <div ref={ref} class="entry-wrapper" {...myProps} is-draggable is-hoverable is-droppable entry-type={EntryTypes.bookemark}>
      <Dropdown
        useContextMenu={true}
        options={{
          autoTrigger: false,
          alignment: "left"
        }}
        menuItems={[
          {
            label: "Edit",
            onClick: () => {
              showLayer({
                type: ScreenLayerTypes.editBookmarkPopover,
                data: config()
              });
            }
          },
          {
            label: "Remove",
            onClick: () => {
              if (removeEntry(config().id) && currentScreenLayer().type === ScreenLayerTypes.groupPopover) {
                backToPrevLayer();
              }
            }
          },
        ]}
        style={{
          height: "55px",
          width: "55px",
          position: "relative"
        }}
      >
        <div class="entry-container"
          title={`${config().name}: ${config().description}`}
          style={{
            "background-image": config().icon ? `url("${config().icon}")` : undefined
          }}
          onClick={handleClick}
        ></div>
      </Dropdown>
      <EntryTitle name={config().name} />
    </div >
  );
}

export type { BookmarkEntryConfig };