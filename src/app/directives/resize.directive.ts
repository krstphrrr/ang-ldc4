import { Directive, OnInit, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appResize]'
})
export class ResizeDirective implements OnInit {
  @Input() resizableGrabWidth = 8;
  @Input() resizableMinWidth = 10;
  dragging=false

  constructor(private el:ElementRef) { 
    const self = this 
    const EventListenerMode = { capture:true}
    function preventGlobalMouseEvents(){
      document.body.style['pointer-events']='none'
    }

    function restoreGlobalMouseEvents(){
      document.body.style['pointer-events'] = 'auto'
    }

    const newWidth = (wid)=>{
      const newWidth = Math.max(this.resizableMinWidth, wid)
      el.nativeElement.style.width = (newWidth) + "px"
    }

    const mouseMoveG = (evt) => {
      
      if (!this.dragging) {
        return;
      }
      newWidth(evt.clientX - el.nativeElement.offsetLeft)
      evt.stopPropagation();
    };

    const mouseMove = (evt) => {
      if (this.inDragRegion(evt) || this.dragging) {
        el.nativeElement.style.cursor = "col-resize";
      } else {
        el.nativeElement.style.cursor = "default";
      }
    }

    document.addEventListener('mousemove', mouseMoveG, true);

    el.nativeElement.addEventListener('mousemove', mouseMove, true);
  }

  

  


  ngOnInit() {
    this.el.nativeElement.style["border-right"] = this.resizableGrabWidth + "px solid darkgrey";
  }

  inDragRegion(evt) {
    console.log(this.el.nativeElement.clientWidth-evt.clientX + this.el.nativeElement.offsetLeft)
    return this.el.nativeElement.clientWidth - evt.clientX + this.el.nativeElement.offsetLeft < this.resizableGrabWidth;
  }

}
