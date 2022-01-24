import { createMemo, onMount } from "solid-js";

import { ApplicationMapper } from '../Application/index';
import { BaseEntryConfig } from "./Entry";
import { Draggable } from '../../utils/draggable';
import EntryTitle from './EntryTitle';
import { EntryTypes } from '../../utils/constants';
import { offset } from '../../utils/helpers';

// same as base config
interface ApplicationEntryConfig extends BaseEntryConfig { }

export default function ApplicationEntry(props) {
  let ref;
  const { id, style = {}, isDraggable = false } = props;
  const myProps = { id, style };
  const config = createMemo(() => props.config as ApplicationEntryConfig);
  const app = createMemo(() => {
    ;
    if (!config().id) return undefined;
    return ApplicationMapper[config().id];
  });
  const IconComponent = app()?.icon;
  const draggableProps = {
    "is-draggable": isDraggable,
    "is-hoverable": isDraggable,
    "is-droppable": isDraggable
  }

  onMount(() => {
    if (isDraggable) {
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
    }
  });
  return (
    <div ref={ref} class="entry-wrapper" {...myProps} entry-type={EntryTypes.application} {...draggableProps}>
      <div class="entry-container"
        style={{ "background-image": "none" }}
        title={`${app()?.name}: ${app()?.description || ""}`}
      >
        <IconComponent></IconComponent>
      </div>
      <EntryTitle name={app()?.name} />
    </div>
  );
}

export type { ApplicationEntryConfig };