/* service to move data from map to 



*/

import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { ApiService} from './api.service'

@Injectable({
  providedIn: 'root'
})
export class TabledataService {
  private dataTracker = new Subject()
  deleteSignal = new Subject()
  
  private dataS = new BehaviorSubject<any>({})
  dataSource$:Observable<any>= this.dataS.asObservable()

  constructor(
    private apiCall:ApiService
  ) { }

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
    // now: create array of unique primarykeys, pass array into service
    dat.map(i=>{
      let key = i.id
      if(cols.includes(key)){
        // console.log(key,"yatebgi esta")
      } else {
        cols.push(key)
        console.log(key,"lometi")
      }
      console.log(key, "cosa")
    })
    this.apiCall.changeParams(cols)
    this.apiCall.getParams()
    console.log(dat, "aqui")
    // this.dataS.next(dat)
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
