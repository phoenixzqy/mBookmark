import React from 'react';
import style from './index.css';
// import Site from '../Site/index';
import Href from '../Href/index';

function Category({data}) {
  return (
    <div className={style.category}>
      <div className={style.title}>
        <span>{data.title}</span>
      </div>
      <div className={style.sitelist}>
        {data.apps.map((app, i) => <Href key={i} data={app} />)}
      </div>
    </div>
  )
}


export default Category;
