import { Directive, ElementRef } from '@angular/core';
import { UtilitiesService } from '../services/utilities.service';

@Directive({
  selector: '[appDoubleclick]'
})
export class DoubleclickDirective {

  constructor(
    private el:ElementRef,
    private util:UtilitiesService
  ) { 

    const mouseEnter = () => {
      // function to send scroll-disabling-signal if mouse 
      // falls within the table div region
        this.util.clickGuardSignal(true)
    }
    const mouseLeave = () =>{
    
      this.util.clickGuardSignal(false)
    }
  el.nativeElement.addEventListener('mouseenter', mouseEnter, true);
  el.nativeElement.addEventListener('mouseleave', mouseLeave, true)
}


}
