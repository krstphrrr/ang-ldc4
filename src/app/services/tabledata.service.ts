/* service to move data from map to 



*/

import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TabledataService {
  private dataTracker = new Subject()
  deleteSignal = new Subject()
  
  private dataS = new BehaviorSubject<any>({})
  dataSource$:Observable<any>= this.dataS.asObservable()

  constructor() { }

  getdataSource$(){
    // if(this.dataSource$)
    return this.dataSource$
  }
  sendCloseSignal(){
    this.dataS.complete()
    this.dataTracker.next({close:true})
  }

  getCloseSignal(){
    return this.dataTracker.asObservable()
  }
  //getting data and storing it on data source
  changeData(data){
    let complete={}
    let cols = []
    let dat = data.features

    // need to passe the large json into material table datasource hmmm
    console.log(data, "aqui")
    this.dataS.next(data)
    // this.dataSource$ = new Bej((observer)=>{
    //   observer.next(data)
    // })
    // this.dataSource$=data
    }
  clearData(){
    this.dataS.next([])
  }

  getUnsub(){
    return this.deleteSignal.asObservable()
  }
  unsubSignal(signal){
    this.deleteSignal.next(signal)
  }


}


// 21-1
// turf / / projections
