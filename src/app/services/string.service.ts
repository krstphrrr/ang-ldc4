import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class StringService {
  private subject = new Subject();
  private tableArray = new Subject()

  publicSubject = this.subject.asObservable()
  publicTables = this.tableArray.asObservable()

  sendContent(content){
    
    this.subject.next({data:content.current})
    this.tableArray.next({tables:content.tableArray})
  }

  retrieveContent():Observable<any>{

    return this.subject.asObservable()
  }

  sendTableData(content:{}[]){
    
    this.subject.next({data:content})
  }

  sendTableArray(content){
    this.tableArray.next({tables:content})
  }
}
