import { Injectable } from '@angular/core';
import { Subject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class AboutSelService {
  public option = new Subject<string>();

  option$ = this.option.asObservable()
  constructor() { }

  saveOption(str:string){
    this.option.next(str)
    
  }
}
