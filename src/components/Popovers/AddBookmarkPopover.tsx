import { Button, Col, Input } from '../Materialize';
import { EntryTypes, ScreenLayerTypes } from '../../utils/constants';
import { createEffect, createMemo, createSignal, useContext } from 'solid-js';

import { AppContext } from '../App';
import type { AppContextState } from '../App';
import { BookmarkEntryConfig } from '../Entry';
import { Chips } from '../Materialize/Input';
import PopoverTitle from "./PopoverTitle";
import { Row } from '../Materialize/Grid';
import type { ScreenLayerContextState } from '../ScreenLayerManager';
import { ScreenLayerManagerContext } from '../ScreenLayerManager';
import { generateUUID } from '../../utils/helpers';

export default function AddBookmarkPopover() {
  const { keywords, addEntry } = useContext(AppContext) as AppContextState;
  const { backToPrevLayer, currentScreenLayer } = useContext(ScreenLayerManagerContext) as ScreenLayerContextState;
  const chipsOptions = createMemo(() => {
    let kwo = {};
    keywords().forEach(kw => kwo[kw] = null);
    return {
      data: [],
      placeholder: 'Add keyword',
      secondaryPlaceholder: '+ keyword',
      autocompleteOptions: {
        data: kwo,
        limit: 5,
        minLength: 1
      }
    };
  });
  const [data, setData] = createSignal({
    id: "",
    type: EntryTypes.bookemark,
    url: "https://www.solidjs.com/",
    icon: "https://www.solidjs.com/assets/logo.123b04bc.svg",
    name: "SolidJS",
    description: "A declarative, efficient and flexible JavaScript library for building user interfaces.",
    keywords: []
  } as BookmarkEntryConfig);
  const updateData = (name: string) => (e: any) => {
    if (name === "keywords") {
      setData(prev => ({
        ...prev,
        keywords: [...new Set(e)].map(item => (item as any).tag) as string[]
      }));
    } else {
      setData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).value
      }));
    }
  }
  const saveChanges = () => {
    const newBookmark: BookmarkEntryConfig = {
      ...data(),
      id: generateUUID()
    };
    addEntry(newBookmark, currentScreenLayer().data?.parentId?.());
    backToPrevLayer();
  }
  return (
    <div class="popover-container add-entry-popover-container">
      <PopoverTitle name="Add Bookmark/App" />
      <Row>
        <Col s12>
          <Row>
            <Col s12>
              <Input onChange={updateData("url")} label="URL" value={data().url}></Input>
            </Col>
            <Col s12>
              <Input onChange={updateData("icon")} label="Icon URL" value={data().icon}></Input>
            </Col>
            <Col s12>
              <Input onChange={updateData("name")} label="Site Name" value={data().name}></Input>
            </Col>
            <Col s12>
              <Input onChange={updateData("description")} label="Site Description" value={data().description}></Input>
            </Col>
            <Col s12>
              <Chips
                options={chipsOptions()}
                onChange={updateData("keywords")}
                label="Keywords"
              ></Chips>
            </Col>
          </Row>
          <Row className="submit-button">
            <Button onClick={saveChanges} icon="save">Save Changes</Button>
          </Row>
        </Col>
      </Row>
    </div >

  )
}
