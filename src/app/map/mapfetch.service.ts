import { Injectable } from '@angular/core';
import {Observable , Subject} from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class MapfetchService {
  userData;
  myMethod$: Observable<any>;
  private myMethodSubject = new Subject<any>();

  constructor() { 
    this.userData= {};
    this.myMethod$ = this.myMethodSubject.asObservable();
    
  }
  myMethod(data) {
    console.log(data); // I have data! Let's return to be used by the subscribers!
    this.myMethodSubject.next(data);
}

  setUserData(val: object){
    this.userData = val;
  }
  getUserData(){
    return this.userData;
  }


}
