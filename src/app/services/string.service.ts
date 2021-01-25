import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class StringService {
  private subject = new Subject();
  private tableArray = new Subject()
  tableArray2 = new BehaviorSubject(null)

  fullData = new BehaviorSubject(null)

  publicSubject = this.subject.asObservable()
  publicTables = this.tableArray.asObservable()
  

  sendContent(content){
    console.log(content, "TABLAS") 

    // instead of sending a single table per Subject update (using next)
    // maybe updating with an object with keys and entries? 
    // then iterating through them to display them on table component
    this.subject.next({data:content.current})
    this.tableArray.next({tables:content.tableArray})
    this.tableArray2.next(content)
  }

  retrieveContent():Observable<any>{

    return this.subject.asObservable()
  }

  sendTableData(content:{}[]){
    
    this.subject.next({data:content})
  }

  sendTableArray(content){
    this.tableArray.next({tables:content})
    this.tableArray2.next(content)
  }


  sendFullData(content){
    // console.log("received full data")
    this.fullData.next(content)
  }

  retrieveFullData(){
    return this.fullData.asObservable()
  }
}
