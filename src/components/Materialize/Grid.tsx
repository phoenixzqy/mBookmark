import { createMemo } from "solid-js";

const colClasses = {};
for (let i = 1; i <= 12; i++) {
  for (let s of ["s", "m", "l", "xl"]) {
    colClasses[`${s}${i}`] = `${s}${i}`;
    colClasses[`offset-${s}${i}`] = `offset-${s}${i}`;
  }
}

export function Row(props) {
  const { className = "", style = {}, onClick } = props;
  return <div class={`row ${className}`} style={style} onClick={onClick}>
    {props.children}
  </div>
}

export function Col(props) {
  const { style = {} } = props;
  const className = createMemo((): string => {
    let cn = "col";
    Object.keys(props).forEach(key => {
      if (colClasses[key]) cn += ` ${colClasses[key]}`;
    });
    if (props.className) {
      cn += ` ${props.className}`;
    }
    return cn;
  });
  return <div class={className()} style={style}>
    {props.children}
  </div>
}