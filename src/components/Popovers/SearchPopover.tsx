import { AppContext, AppContextState } from '../App/AppContext';
import { BaseEntryConfig, BookmarkEntryConfig, MiniEntryGroupConfig } from '../Entry';
import { Col, Row, SearchBar } from '../Materialize';
import { For, createEffect, createMemo, createSignal, useContext } from 'solid-js';
import { MiniEntryGroupType, ScreenLayerTypes } from '../../utils/constants';
import { ScreenLayerContextState, ScreenLayerManagerContext } from '../ScreenLayerManager';

import { NormalHomepageConfig } from '../Homepage';
import { highlight } from '../../utils/helpers';

function findMatch(config: BookmarkEntryConfig, pattern: RegExp) {
  return (`${config.name.toLowerCase()}, ${config.description.toLowerCase()}, ${config.keywords.join(", ").toLowerCase()}`).match(pattern);
}

export default function SearchPopover(props) {
  let inputRef;
  const { getUserHomepageConfig } = useContext(AppContext) as AppContextState;
  const { currentScreenLayer, backToPrevLayer } = useContext(ScreenLayerManagerContext) as ScreenLayerContextState;
  const show = createMemo(() => currentScreenLayer().type === ScreenLayerTypes.searchPopover);
  const [value, setValue] = createSignal("");
  createEffect(() => {
    if (show()) {
      inputRef.focus();
    } else {
      inputRef.blur();
    }
  });
  const searchResult = createMemo(() => {
    let result: (BookmarkEntryConfig | BaseEntryConfig)[] = [];
    if (value() === "" || value().length < 2) return result;
    const items: (MiniEntryGroupConfig | BaseEntryConfig | BookmarkEntryConfig)[] = (getUserHomepageConfig()[1] as NormalHomepageConfig).items;
    let pattern = new RegExp(value());
    for (let item of items as (BookmarkEntryConfig | MiniEntryGroupConfig)[]) {
      if (item.type === MiniEntryGroupType) {
        for (let subItem of item.items as (BookmarkEntryConfig)[]) {
          if (findMatch(subItem, pattern)) result.push({ ...subItem });
        }
      } else {
        if (findMatch(item as BookmarkEntryConfig, pattern)) result.push({ ...(item as BookmarkEntryConfig) });
      }
    }
    return result;
  });


  return <>
    <div class="search-popover-back-btn" onClick={() => backToPrevLayer()}>
      <i class="material-icons">arrow_back</i>
    </div>
    <div class="search-popover-searchbar-container">
      <Row style={{ display: "flex", width: "100%", "align-items": "center", "justify-content": "center", margin: "0" }}>
        <Col s10 m9 l8 xl7 style={{ margin: 0 }}>
          <SearchBar ref={inputRef} value={value()} onInput={e => setValue(e.target.value)} />
        </Col>
      </Row>
    </div>
    <div class="search-popover-search-result-container">
      <Row>
        <Col s10 m9 l8 xl7>
          <For each={searchResult()} children={<></>}>
            {(item) => (
              <Row className="search-result-item"
                onClick={(e) => window.open(item.url)}
              >
                <div style={{ display: "flex", height: "55px", overflow: "hidden" }}>
                  <div
                    class="entry-container"
                    style={{
                      "background-image": item.icon ? `url("${item.icon}")` : undefined
                    }}
                  ></div>
                  <div style={{ display: "flex", "flex-direction": "column", width: "calc(100% - 55px)", padding: "0 15px" }}>
                    <span class="entry-title search-result-item-title">{highlight(item.name, value())}</span>
                    <span class="entry-title search-result-item-keywords">{highlight(item.keywords?.join(", "), value())}</span>
                  </div>
                </div>
                <div class="search-result-item-desc">{highlight(item.description, value())}</div>
              </Row>
            )}
          </For>
        </Col>
      </Row>
    </div>
  </>
}