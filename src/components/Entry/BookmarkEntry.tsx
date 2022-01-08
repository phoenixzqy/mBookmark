import { AppContext, AppContextState } from '../App';
import { createMemo, useContext } from 'solid-js';

import type { BaseEntryConfig } from './Entry';
import { Dropdown } from '../Materialize';
import EntryTitle from './EntryTitle';
import type { ScreenLayerContextState } from "../ScreenLayerManager";
import { ScreenLayerManagerContext } from '../ScreenLayerManager/ScreenLayerManager';
import { ScreenLayerTypes } from '../../utils/constants';

interface BookmarkEntryConfig extends BaseEntryConfig {
  url: string,
  icon: string,
  name: string,
  description: string,
  keywords: string[]
}

export default function BookmarkEntry(props) {
  const { showLayer, backToPrevLayer, currentScreenLayer } = useContext(ScreenLayerManagerContext) as ScreenLayerContextState;
  const { removeEntry } = useContext(AppContext) as AppContextState;
  const config = createMemo(() => props.config as BookmarkEntryConfig);
  function handleClick() {
    window.open(config().url);
  }
  return (
    <div class="entry-wrapper">
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