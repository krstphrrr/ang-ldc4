import { Injectable } from '@angular/core';
import { OverlayRef, Overlay } from '@angular/cdk/overlay'
import {Subject} from 'rxjs'
import { scan, map, mapTo, distinctUntilChanged } from 'rxjs/operators'

import { ComponentPortal } from '@angular/cdk/portal';
import { MatSpinner } from '@angular/material/progress-spinner';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private spinnerTopRef: OverlayRef;

  private spin$: Subject<number> = new Subject()

  constructor(
    private overlay: Overlay
  ) {
    this.spinnerTopRef = this.overlay.create({
      hasBackdrop: true,
      positionStrategy: this.overlay.position()
        .global()
        .centerHorizontally()
        .centerVertically()
    });

    this.spin$
    .asObservable()
    .pipe(
      scan((acc, next) => {
        if(!next) return 0;
        return (acc + next) >= 0 ? acc + next : 0;
      }, 0),
      map(val => val > 0),
      distinctUntilChanged()
    )
    .subscribe(
      (res) => {
        if(res){
          this.spinnerTopRef.attach(new ComponentPortal(MatSpinner))
        } else if (this.spinnerTopRef.hasAttached()){
      this.spinnerTopRef.detach()
    }
      }
    )
   }
 
   show() {
    console.log("show");
    this.spin$.next(1);
  }
  hide() {
    console.log("hide");
    this.spin$.next(-1);
  }
  reset() {
    console.log("reset");
    this.spin$.next(0);
  }
}
