import { ApplicationMapper } from '../Application/index';
import { BaseEntryConfig } from "./Entry";
import EntryTitle from './EntryTitle';
import { EntryTypes } from '../../utils/constants';
import { createMemo } from "solid-js";

// same as base config
interface ApplicationEntryConfig extends BaseEntryConfig { }

export default function ApplicationEntry(props) {
  const { id, style = {} } = props;
  const myProps = { id, style };
  const app = createMemo(() => {
    const config = props.config as ApplicationEntryConfig;
    if (!config.id) return undefined;
    return ApplicationMapper[config.id];
  });
  const IconComponent = app()?.icon;
  return (
    <div class="entry-wrapper" {...myProps} entry-type={EntryTypes.application}>
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