interface DraggableOptions {
  enableOnHold: boolean;
  /** in milisecond */
  onHoldTime: number;
}

const defaultOptions: DraggableOptions = {
  enableOnHold: true,
  onHoldTime: 200
}

const initPos = [-1, -1];
class Draggable {
  private initKeyDownPos: number[];
  private currentKeyPos: number[];
  private draggingElement: HTMLElement = undefined;
  private isDragging: boolean = false;
  private options: DraggableOptions;
  private data: any;

  constructor(options?: DraggableOptions) {
    this.initKeyDownPos = [...initPos];
    this.currentKeyPos = [...initPos];
    this.options = { ...defaultOptions, ...options };
  }

  private findParentDraggableElement(ele: HTMLElement): HTMLElement {
    if (ele.attributes.getNamedItem("is-draggable")) return ele;
    if (!ele.parentElement) return undefined;
    return this.findParentDraggableElement(ele.parentElement);
  }
  private findParentHoverableElement(ele: HTMLElement): HTMLElement {
    if (ele.attributes.getNamedItem("is-hoverable")) return ele;
    if (!ele.parentElement) return undefined;
    return this.findParentDraggableElement(ele.parentElement);
  }

  private initDragging(e: MouseEvent, callback?: (e: MouseEvent, target: HTMLElement) => void) {
    // if mouse moved in .5s, treat it as false drag
    if (this.initKeyDownPos.toString() !== this.currentKeyPos.toString()) return;
    // if user release mouse in .5s, treat it as a click
    if (this.currentKeyPos.toString() === initPos.toString()) return;
    // if user holded for .5s, then start dragging event;
    // please note that the order of style changes matters
    this.draggingElement.style.width = this.draggingElement.offsetWidth + "px";
    this.draggingElement.style.height = this.draggingElement.offsetHeight + "px";
    this.draggingElement.style.left = (this.currentKeyPos[0] - this.draggingElement.offsetWidth / 2).toString() + "px";
    this.draggingElement.style.top = (this.currentKeyPos[1] - this.draggingElement.offsetHeight / 2).toString() + "px";
    this.draggingElement.style.transitionDuration = "unset";
    this.draggingElement.style.pointerEvents = "none"; // this help to prevent default click events.
    this.draggingElement.style.zIndex = "1";
    this.draggingElement.style.position = "fixed";
    this.isDragging = true;
    if (callback && this.isDragging) callback(e, this.draggingElement);
  }
  private mouseDownHandler(e: MouseEvent, callback?: (e: MouseEvent, target: HTMLElement) => void) {
    // find dragging element
    this.draggingElement = this.findParentDraggableElement(e.target as HTMLElement);
    if (!this.draggingElement) return;
    this.initKeyDownPos = [e.clientX, e.clientY];
    this.currentKeyPos = [e.clientX, e.clientY];

    if (this.options.enableOnHold) {
      setTimeout(() => {
        this.initDragging(e, callback);
      }, 300);
    } else {
      this.initDragging(e, callback);
    }
  }
  private mouseMoveHandler(e: MouseEvent, callback?: (e: MouseEvent, target: HTMLElement) => void) {
    if (!this.draggingElement) return;
    this.currentKeyPos = [e.clientX, e.clientY];
    if (this.isDragging) {
      this.draggingElement.style.left = (this.currentKeyPos[0] - this.draggingElement.offsetWidth / 2).toString() + "px";
      this.draggingElement.style.top = (this.currentKeyPos[1] - this.draggingElement.offsetHeight / 2).toString() + "px";
    }
    if (callback) callback(e, this.draggingElement);
  }
  private mouseUpHandler(e: MouseEvent, callback?: (e: MouseEvent, target: HTMLElement) => void) {
    if (!this.draggingElement) return;
    e.preventDefault();
    e.stopPropagation();
    this.isDragging = false;
    this.initKeyDownPos = [...initPos];
    this.currentKeyPos = [...initPos];
    this.draggingElement.style.transform = "scale(1)";
    this.draggingElement.style.left = undefined;
    this.draggingElement.style.top = undefined;
    this.draggingElement.style.pointerEvents = "all";
    if (callback) callback(e, this.draggingElement);
    this.draggingElement = undefined;
  }
  private mouseEnterHandler(e: MouseEvent, callback?: (e: MouseEvent, target: HTMLElement, draggingEle: HTMLElement) => void) {
    if (!this.draggingElement || !this.isDragging) return;
    const target = this.findParentHoverableElement(e.target as HTMLElement);
    if (callback) callback(e, target, this.draggingElement);
  }
  private mouseOverHandler(e: MouseEvent, callback?: (e: MouseEvent, target: HTMLElement, draggingEle: HTMLElement) => void) {
    if (!this.draggingElement || !this.isDragging) return;
    const target = this.findParentHoverableElement(e.target as HTMLElement);
    if (callback) callback(e, target, this.draggingElement);
  }
  private mouseLeaveHandler(e: MouseEvent, callback?: (e: MouseEvent, target: HTMLElement, draggingEle: HTMLElement) => void) {
    if (!this.draggingElement || !this.isDragging) return;
    const target = this.findParentHoverableElement(e.target as HTMLElement);
    if (callback) callback(e, target, this.draggingElement);
  }
  // helper functions to share some data during dragging.
  public getData() {
    return this.data;
  }
  public setData(data: any) {
    this.data = data;
  }
  public clearData() {
    this.data = undefined;
  }
  public onDragStart(ele: HTMLElement, callback?: (e: MouseEvent, target: HTMLElement) => void) {
    ele.onmousedown = e => {
      this.mouseDownHandler(e, callback);
    };
  }
  public onDragMove(ele: HTMLElement, callback?: (e: MouseEvent, target: HTMLElement) => void) {
    ele.onmousemove = e => {
      this.mouseMoveHandler(e, callback);
    };
  }
  public onDragEnd(ele: HTMLElement, callback?: (e: MouseEvent, target: HTMLElement) => void) {
    ele.onmouseup = e => {
      this.mouseUpHandler(e, callback);
      this.clearData();
    };
  }
  public onDragEnter(ele: HTMLElement, callback?: (e: MouseEvent, target: HTMLElement, dragingEle: HTMLElement) => void) {
    ele.onmouseenter = e => {
      this.mouseEnterHandler(e, callback);
    }
  }
  public onDragOver(ele: HTMLElement, callback?: (e: MouseEvent, target: HTMLElement, dragingEle: HTMLElement) => void) {
    ele.onmouseover = e => {
      this.mouseOverHandler(e, callback);
    }
  }
  public onDragLeave(ele: HTMLElement, callback?: (e: MouseEvent, target: HTMLElement, dragingEle: HTMLElement) => void) {
    ele.onmouseleave = e => {
      this.mouseLeaveHandler(e, callback);
    }
  }
  public clearDragStart(ele: HTMLElement) {
    ele.onmousedown = null;
  }
  public clearDragMove(ele: HTMLElement) {
    ele.onmousemove = null;
  }
  public clearDragEnd(ele: HTMLElement) {
    ele.onmouseup = null;
  }
  public clearDragEnter(ele: HTMLElement) {
    ele.onmouseenter = null;
  }
  public clearDragOver(ele: HTMLElement) {
    ele.onmouseover = null;
  }
  public clearDragLeave(ele: HTMLElement) {
    ele.onmouseleave = null;
  }
}

const draggable = new Draggable();

export { draggable as Draggable };