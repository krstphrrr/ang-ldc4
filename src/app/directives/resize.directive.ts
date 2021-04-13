import { Directive, OnInit, ElementRef, Input } from '@angular/core';
import {UtilitiesService} from '../services/utilities.service'
@Directive({
  selector: '[appResize]'
})
export class ResizeDirective implements OnInit {
  @Input() resizableGrabWidth = 8;
  @Input() resizableMinWidth = 192;
  dragging=false

  constructor(
              private el:ElementRef,
              private util:UtilitiesService
              ) { 
    const self = this 
    const EventListenerMode = { capture:true}


    function preventGlobalMouseEvents(){
      document.body.style['pointer-events']='none'
    }

    function restoreGlobalMouseEvents(){
      document.body.style['pointer-events'] = 'auto'
    }

    const newWidth = (wid)=>{
      let boxPos = this.el.nativeElement.getBoundingClientRect().x
      let boxWid = this.el.nativeElement.clientWidth
      
      const newWidth = Math.max(this.resizableMinWidth, wid)
      // console.log(newWidth, wid)
      el.nativeElement.style.width = (newWidth) + "px"
      
    }

    const mouseUpG = (evt) => {
      if (!this.dragging) {
        return;
      }
      restoreGlobalMouseEvents();
      this.dragging = false;
      this.util.mapDragSignal(false)
      evt.stopPropagation();
    };

    const mouseMoveG = (evt) => {
      let boxPos = this.el.nativeElement.getBoundingClientRect().x
      let mousePos = evt.clientX
      let boxWid = this.el.nativeElement.clientWidth
      if (!this.dragging) {
        return;
      }
      newWidth(mousePos-boxPos )
      evt.stopPropagation();
    };

    const mouseMove = (evt) => {
      if (this.inDragRegion(evt)) {
        el.nativeElement.style.cursor = "col-resize";
      } else {
        el.nativeElement.style.cursor = "default";
      }
    }

    const mouseDown = (evt) => {

      // has to also send signal to main map to STOP MAP DRAGGING..
      if (this.inDragRegion(evt)) {
        this.dragging = true;
        this.util.mapDragSignal(true)
        preventGlobalMouseEvents();
        evt.stopPropagation();
      }
    };

    document.addEventListener('mousemove', mouseMoveG, true);
    document.addEventListener('mouseup', mouseUpG, true);
    el.nativeElement.addEventListener('mousemove', mouseMove, true);
    // native element (dragbox) reacts to click ONLY WHEN mouse in "drag region"
    el.nativeElement.addEventListener('mousedown', mouseDown, true);
  }

  

  


  ngOnInit() {
    this.el.nativeElement.style["border-right"] = this.resizableGrabWidth + "px solid darkgrey";
  }

  inDragRegion(evt) {
    let boxPos = this.el.nativeElement.getBoundingClientRect().x
    let mousePos = evt.clientX
    let boxWid = this.el.nativeElement.clientWidth

    return boxWid-(mousePos-boxPos) < this.resizableGrabWidth;
  }

}
