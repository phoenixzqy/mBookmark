import { Button, Col, Input } from '../Materialize';
import { Chips, TextArea } from '../Materialize/Input';
import { createMemo, createSignal, useContext } from 'solid-js';

import { AppContext } from '../mBookmark';
import type { AppContextState } from '../mBookmark';
import { BookmarkEntryConfig } from '../Entry';
import { EntryTypes } from '../../utils/constants';
import PopoverTitle from "./PopoverTitle";
import { Row } from '../Materialize/Grid';
import type { ScreenLayerContextState } from '../ScreenLayerManager';
import { ScreenLayerManagerContext } from '../ScreenLayerManager';
import { generateUUID } from '../../utils/helpers';
import materialize from '../../utils/materialize';

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
      limit: 10,
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
    url: "",
    icon: "",
    name: "",
    description: "",
    keywords: []
  } as BookmarkEntryConfig);
  const updateData = (name: string) => (e: any) => {
    if (name === "keywords") {
      setData(prev => ({
        ...prev,
        keywords: [...new Set(e)].map(item => (item as any).tag) as string[]
      }));
    } else {
      const value = (e.target as HTMLInputElement).value;
      setData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  }
  const saveChanges = () => {
    if (!data().name || !data().url) {
      materialize.toast({ html: "Invalid: name and url are required!", classes: "red" });
      return;
    }
    const newBookmark: BookmarkEntryConfig = {
      ...data(),
      id: generateUUID()
    };
    addEntry(newBookmark, currentScreenLayer().data?.parentId?.());
    backToPrevLayer();
  }
  const copyScript = () => {
    const script = `JSON.stringify({
      name: document.title?.substring(0, 30) || "",
      description: document.querySelector("meta[name=description]")?.getAttribute("content") || "",
      url: document.location.href
    })`;
    navigator.clipboard.writeText(script);
    materialize.toast({ html: "Script has been copied to clipboard!", classes: "green" });
  }
  const readClipboardData = () => {
    navigator.clipboard.readText().then(text => {
      const iData = JSON.parse(text);
      if (iData.name === undefined || iData.description === undefined || iData.url === undefined) {
        throw new Error("invalid data");
      }
      setData(prev => {
        if (iData.name) prev.name = iData.name;
        if (iData.description) prev.description = iData.description;
        if (iData.url) prev.url = iData.url;
        return { ...prev }
      });
      materialize.toast({ html: "Stie Data is successfully imported!", classes: "green" });
    }).catch(e => {
      console.error(e)
      materialize.toast({ html: "Invalid data format", classes: "red" });
    });
  }
  return (
    <div class="popover-container add-entry-popover-container">
      <PopoverTitle name="Add Bookmark" disabled={true} />
      <Row>
        <Col s12>
          <Row>
            <Col s12>
              <Button className="icon-button" icon="code" onClick={copyScript} title="copy the helper script onto clipboard"></Button>
              <Button className="icon-button" icon="input" onClick={readClipboardData} title="import json data into the form"></Button>
            </Col>
            <Col s12>
              <Input onInput={updateData("name")} label="* Site Name" value={data().name} maxlength="30" helperText="Max length: 30; Required"></Input>
            </Col>
            <Col s12>
              <Input onInput={updateData("url")} label="* URL" value={data().url} maxlength="2000" helperText="Max length: 2000; Required"></Input>
            </Col>
            <Col s12>
              <Input onInput={updateData("icon")} label="Icon URL" value={data().icon} maxlength="200" helperText="Max length: 200"></Input>
            </Col>
            <Col s12>
              <TextArea onInput={updateData("description")} label="Site Description" value={data().description} maxlength="300" helperText="Max length: 300"></TextArea>
            </Col>
            <Col s12>
              <Chips
                options={chipsOptions()}
                onChange={updateData("keywords")}
                label="Keywords"
                helperText="Limit: 10 keywords"
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
