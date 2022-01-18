import { AppContext, AppContextState } from '../App/AppContext';
import { createMemo, useContext } from 'solid-js';

export default function GroupPopoverTitle(props) {
  const name = createMemo(() => props.name);
  const groupId = createMemo(() => props.groupId);
  const { updateMiniGroup } = useContext(AppContext) as AppContextState;
  function handleChange(e) {
    updateMiniGroup(groupId(), {
      name: e.target.value
    });
    e.target.blur();
  }
  return (
    <input class="popover-title" value={name()} onchange={handleChange} />
  );
}
