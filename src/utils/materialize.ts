const materialize = (window as any).M
materialize.showLoader = () => {
  const ele = document.querySelector(".global-loader-container") as HTMLElement;
  if (ele) ele.style.display = "flex";
};
materialize.hideLoader = () => {
  const ele = document.querySelector(".global-loader-container") as HTMLElement;
  if (ele) ele.style.display = "none";
}
export default materialize;