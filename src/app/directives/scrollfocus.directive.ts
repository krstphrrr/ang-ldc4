import { Directive, ElementRef, Input } from '@angular/core';
import {UtilitiesService} from '../services/utilities.service'

@Directive({
  selector: '[appScrollfocus]'
})
export class ScrollfocusDirective {
  @Input() scrollWidth = 8;

  constructor(
    private el:ElementRef,
    private util:UtilitiesService
  ) {
    
    const mouseMove = (evt) => {
      // function to send scroll-disabling-signal if mouse 
      // falls within the table div region
      if (this.inScrollRegion(evt)) {
        this.util.clickGuardSignal(true)
        
      } else {
        this.util.clickGuardSignal(false)
        
      }
    }
    // event listener to the table div element
    el.nativeElement.addEventListener('mousemove', mouseMove, true);
   }

   inScrollRegion(evt) {
    // tracks where the mouse scroll wheel should not function as a map zoom
    let boxPos = this.el.nativeElement.getBoundingClientRect().x
    let mousePos = evt.clientX
    let boxWid = this.el.nativeElement.clientWidth
    // returns true: mouse position - floating div position is less than the box width 
    // in other words: is the mouse inside the div that holds the table
    return mousePos-boxPos < boxWid;
   }
}
