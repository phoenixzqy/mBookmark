import { AppContext, AppContextState } from '../mBookmark/AppContext';
import { BaseEntryConfig, BookmarkEntryConfig, MiniEntryGroupConfig } from '../Entry';
import { Col, Row, SearchBar } from '../Materialize';
import { For, createEffect, createMemo, createSignal, useContext } from 'solid-js';
import { MiniEntryGroupType, ScreenLayerTypes } from '../../utils/constants';
import { ScreenLayerContextState, ScreenLayerManagerContext } from '../ScreenLayerManager';

import { NormalHomepageConfig } from '../Homepage';

interface searchResult extends BookmarkEntryConfig {
  nameEle?: HTMLElement | string;
  keywordsEle?: HTMLElement | string;
  descriptionEle?: HTMLElement | string;
}

function findMatch(config: BookmarkEntryConfig, pattern: RegExp): boolean {
  const name = config.name?.toLowerCase() || "";
  const desc = config.description?.toLowerCase() || "";
  const keywords = config.keywords?.join(", ")?.toLowerCase() || ""
  return (`${name}, ${desc}, ${keywords}`).match(pattern) !== null;
}

const highlightBgColors = [
  "#fcfc36",
  "#acfc36",
  "#36fcf7",
  "#3693fc",
  "#d836fc",
  "#f2858d",
  "#bcf2d8"
];
let colorDict = {};
function highlight(str: string, phrase: string): string {
  if (!str || !phrase) return "";
  let reg = new RegExp(phrase.split(",").filter(str => str !== "").join("|"), 'gi');
  let matches = [];
  let result;
  while ((result = reg.exec(str))) {
    matches.push(result);
  }
  let strArr = str.split("");

  matches.forEach((m) => {
    if (!colorDict[m[0]]) {
      colorDict[m[0]] = highlightBgColors[Object.keys(colorDict).length % highlightBgColors.length];
    }
    strArr[m.index] = `<span class="highlight" style="background-color: ${colorDict[m[0]]};">${m[0]}</span>`
    for (let i = 1; i < m[0].length; i++) {
      strArr[i + m.index] = undefined;
    }
  });
  return strArr.filter(substr => substr !== undefined).join("");
}
export default function SearchPopover(props) {
  let inputRef;
  const { getUserHomepageConfig } = useContext(AppContext) as AppContextState;
  const { currentScreenLayer, backToPrevLayer } = useContext(ScreenLayerManagerContext) as ScreenLayerContextState;
  const show = createMemo(() => currentScreenLayer().type === ScreenLayerTypes.searchPopover);
  const [searchItem, setSearchItem] = createSignal("");
  createEffect(() => {
    if (show()) {
      inputRef.focus();
    } else {
      inputRef.blur();
    }
  });
  const searchResult = createMemo(() => {
    colorDict = {};
    let result: searchResult[] = [];
    if (searchItem() === "" || searchItem().length < 2) return result;
    const items: (MiniEntryGroupConfig | BaseEntryConfig | BookmarkEntryConfig)[] = (getUserHomepageConfig()[1] as NormalHomepageConfig).items;
    let pattern = new RegExp(searchItem().split(",").filter(str => str !== "").join("|"));
    for (let item of items as (BookmarkEntryConfig | MiniEntryGroupConfig)[]) {
      if (item.type === MiniEntryGroupType) {
        for (let subItem of item.items as (BookmarkEntryConfig)[]) {
          if (findMatch(subItem, pattern)) result.push({ ...subItem });
        }
      } else {
        if (findMatch(item as BookmarkEntryConfig, pattern)) result.push({ ...(item as BookmarkEntryConfig) });
      }
    }
    // add highlights
    result.forEach(item => {
      const name = highlight(item.name?.toLowerCase() || "", searchItem());
      const desc = highlight(item.description?.toLowerCase() || "", searchItem());
      const keywords = highlight(item.keywords?.join(", ")?.toLowerCase() || "", searchItem());
      item.nameEle = document.createElement("div");
      item.nameEle.innerHTML = name;
      if (desc) {
        item.descriptionEle = document.createElement("div");
        item.descriptionEle.innerHTML = desc;
      }
      if (keywords) {
        item.keywordsEle = document.createElement("div");
        item.keywordsEle.innerHTML = keywords;
      }
    });
    return result;
  });


  return <>
    <div class="search-popover-back-btn" onClick={() => backToPrevLayer()}>
      <i class="material-icons">arrow_back</i>
    </div>
    <div class="search-popover-searchbar-container">
      <Row style={{ display: "flex", width: "100%", "align-items": "center", "justify-content": "center", margin: "0" }}>
        <Col s10 m9 l8 xl7 style={{ margin: 0 }}>
          <SearchBar ref={inputRef} value={searchItem()} onInput={e => {
            setSearchItem(e.target.value.replaceAll(" ", ""))
          }} />
        </Col>
      </Row>
    </div>
    <div class="search-popover-search-result-container" onClick={e => backToPrevLayer()}>
      <Row>
        <Col s10 m9 l8 xl7>
          <For each={searchResult()} children={<></>}>
            {(item: searchResult) => (
              <Row className="search-result-item"
                onClick={(e: Event) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(item.url)
                }}
              >
                <div style={{ display: "flex", height: "55px", overflow: "hidden" }}>
                  <div
                    class="entry-container"
                    style={{
                      "background-image": item.icon ? `url("${item.icon}")` : undefined
                    }}
                  ></div>
                  <div style={{ display: "flex", "flex-direction": "column", width: "calc(100% - 55px)", padding: "0 15px" }}>
                    <span class="entry-title search-result-item-title">{item.nameEle}</span>
                    <span class="entry-title search-result-item-keywords">{item.keywordsEle}</span>
                  </div>
                </div>
                <div class="search-result-item-desc">{item.descriptionEle}</div>
              </Row>
            )}
          </For>
        </Col>
      </Row>
    </div>
  </>
}