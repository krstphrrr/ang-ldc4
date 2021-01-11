import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class StringService {
  private subject = new Subject();

  sendContent(content:string){
    
    this.subject.next({data:content})
  }

  retrieveContent():Observable<any>{

    return this.subject.asObservable()
  }

  sendTableData(content:{}[]){
    
    this.subject.next({data:content})
  }
}
