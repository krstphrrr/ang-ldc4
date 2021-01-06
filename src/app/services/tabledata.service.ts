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
    let pks = []
    let dat = data.features
    let obj ={}

    // need to passe the large json into material table datasource hmmm
    // now: create array of unique primarykeys, pass array into service
    dat.map(i=>{
      let key = i.id
      if(pks.includes(key)){
        // console.log(key,"yatebgi esta")
      } else {
        pks.push(key)
      }
    })
    // sends list of columns to observable this.apiUpdate
    this.apiCall.changeParams(pks)
    // uses list of columns in apiUpdate to 1) create params 2) set them 3) query api
    this.apiCall.getParams()
    this.apiCall.resCols.subscribe(cols =>{
      obj['cols'] = cols
    })
    
    // set results on "resData" subject

    // subscribe to resData and update "dataS" subject (sends this json everywhere: 
    // map component, popup component, table component )
    this.apiCall.resData.subscribe(d=>{
      obj['data'] = d
      console.log(obj)
      this.dataS.next(obj)
    })
  
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
