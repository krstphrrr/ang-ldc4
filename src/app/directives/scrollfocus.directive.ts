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
    
    const mouseEnter = () => {
      // function to send scroll-disabling-signal if mouse 
      // falls within the table div region
        this.util.scrollGuardSignal(true)
    }
    const mouseLeave = () =>{
    
      this.util.scrollGuardSignal(false)
    }





    // event listener to the table div element
    el.nativeElement.addEventListener('mouseenter', mouseEnter, true)
    el.nativeElement.addEventListener('mouseleave', mouseLeave, true)
   }

}
