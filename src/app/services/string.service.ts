import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class StringService {
  private subject = new Subject();
  private tableArray = new Subject()
  tableArray2 = new BehaviorSubject(null)

  publicSubject = this.subject.asObservable()
  publicTables = this.tableArray.asObservable()
  

  sendContent(content){
    
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
}
