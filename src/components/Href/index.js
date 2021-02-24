import React from 'react';
import style from './index.css';

function Href({data}) {
  function getIcon() {
    
  }
  return (
    <a 
      className={style.href}
      href={data.url}
    >
      <div 
        className={style.icon} 
        style={{
          backgroundImage: `url("${data.icon}")`
        }}
      />
      <div className={style.title}>{data.name}</div>
    </a>
  )
}


export default Href;

