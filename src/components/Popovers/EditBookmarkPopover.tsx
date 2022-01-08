import { Button, Col, Input } from '../Materialize';
import { createEffect, createMemo, createSignal, useContext } from 'solid-js';

import { AppContext } from '../App';
import type { AppContextState } from '../App';
import { BookmarkEntryConfig } from '../Entry';
import { Chips } from '../Materialize/Input';
import { EntryTypes } from '../../utils/constants';
import PopoverTitle from "./PopoverTitle";
import { Row } from '../Materialize/Grid';
import type { ScreenLayerContextState } from '../ScreenLayerManager';
import { ScreenLayerManagerContext } from '../ScreenLayerManager';

export default function EditBookmarkPopover() {
  const { keywords, updateEntry } = useContext(AppContext) as AppContextState;
  const { backToPrevLayer, currentScreenLayer } = useContext(ScreenLayerManagerContext) as ScreenLayerContextState;
  const [data, setData] = createSignal({
    id: currentScreenLayer().data?.id,
    type: EntryTypes.bookemark,
    url: currentScreenLayer().data?.url,
    icon: currentScreenLayer().data?.icon,
    name: currentScreenLayer().data?.name,
    description: currentScreenLayer().data?.description,
    keywords: currentScreenLayer().data?.keywords
  } as BookmarkEntryConfig);
  const chipsOptions = createMemo(() => {
    let kwo = {};
    keywords().forEach(kw => kwo[kw] = null);
    let chipsData = [];
    if (data()?.keywords && Array.isArray(data().keywords)) {
      chipsData = data().keywords.map((kw) => ({ tag: kw }));
    }
    return {
      data: chipsData,
      placeholder: 'Add keyword',
      secondaryPlaceholder: '+ keyword',
      autocompleteOptions: {
        data: kwo,
        limit: 5,
        minLength: 1
      }
    };
  });
  createEffect(() => {
    setData({
      id: currentScreenLayer().data?.id,
      type: EntryTypes.bookemark,
      url: currentScreenLayer().data?.url,
      icon: currentScreenLayer().data?.icon,
      name: currentScreenLayer().data?.name,
      description: currentScreenLayer().data?.description,
      keywords: currentScreenLayer().data?.keywords
    })
  })
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
    updateEntry(data());
    backToPrevLayer();
  }
  return (
    <div class="popover-container add-entry-popover-container">
      <PopoverTitle name="Edit Bookmark/App" />
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
