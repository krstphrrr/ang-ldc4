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
    
    // enabling + disabling mouse events
    function preventGlobalMouseEvents(){
      document.body.style['pointer-events']='none'
    }

    function restoreGlobalMouseEvents(){
      document.body.style['pointer-events'] = 'auto'
    }

    const newWidth = (wid)=>{
      // function to calculate the floating div's new width
      const newWidth = Math.max(this.resizableMinWidth, wid)
      el.nativeElement.style.width = (newWidth) + "px"
      
    }

    const mouseUpG = (evt) => {
      // function to handle releasing mouse drag
      if (!this.dragging) {
        return;
      }
      restoreGlobalMouseEvents();
      // sets drag to false and disables map dragging on main map
      this.dragging = false;
      this.util.mapDragSignal(false)
      evt.stopPropagation();
    };

    const mouseMoveG = (evt) => {

      // function that runs when mouse is moving ( and calculates new div size)

      // floating div position
      let boxPos = this.el.nativeElement.getBoundingClientRect().x
      // mouse position
      let mousePos = evt.clientX
      
      if (!this.dragging) {
        return;
      }
      newWidth(mousePos-boxPos )
      evt.stopPropagation();
    };

    const mouseMove = (evt) => {
      //function to 
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
