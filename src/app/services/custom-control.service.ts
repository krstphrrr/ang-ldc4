import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class CustomControlService {
  initialState = [{project:"none",length:'0'}]

   dataSource$:Observable<any[]>

  constructor(
 
  ) { }
  getdataSource$(){
    return this.dataSource$;
  }

  changeData(data){

    this.dataSource$ = data
    }
}
