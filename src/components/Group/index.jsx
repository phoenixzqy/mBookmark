import style from './index.css';
import Screen from '../Screen';

function Group({showPopoverGroup}) {
  return (
    <div class="group_wrapper">
      <div class="group_container" onClick={showPopoverGroup}>
        <div class="inner_app"></div>
        <div class="inner_app"></div>
        <div class="inner_app"></div>
        <div class="inner_app"></div>
        <div class="inner_app"></div>
        <div class="inner_app"></div>
        <div class="inner_app"></div>
        <div class="inner_app"></div>
        <div class="inner_app"></div>
        <div class="inner_app"></div>
        <div class="inner_app"></div>
        <div class="inner_app"></div>
        <div class="inner_app"></div>
        <div class="inner_app"></div>
        <div class="inner_app"></div>
      </div>
    </div>
  );
}

export default Group;
