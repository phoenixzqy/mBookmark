import React from 'react';
import style from './index.css';

function Site({data}) {
  function getIcon() {
    
  }
  return (
    <div className={style.site}>
      <div 
        className={style.icon} 
        style={{
          backgroundImage: `url("${data.icon}")`
        }}
        onClick={() => {
          let event = new CustomEvent("show-iframe", {detail:{url: data.url}});
          document.dispatchEvent(event)
        }}
      />
      <div className={style.title}>{data.name}</div>
    </div>
  )
}


export default Site;

