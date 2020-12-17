/* service to move data from map to 



*/

import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TabledataService {
  private dataTracker = new Subject()
  private dataSource$ = new Subject()
  // dataSource$:Observable<any[]>

  constructor() { }

  getdataSource$(){
    return this.dataSource$.asObservable()
  }
  sendCloseSignal(){
    this.dataTracker.next({close:true})
  }

  getCloseSignal(){
    return this.dataTracker.asObservable()
  }
  //getting data and storing it on data source
  changeData(data){
    console.log(data, 'data')
    this.dataSource$.next(data)
    }
}
