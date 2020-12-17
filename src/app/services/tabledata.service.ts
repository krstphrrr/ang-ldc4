import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TabledataService {
  initialState = [{}]
  dataSource$:Observable<any[]>

  constructor() { }

  getdataSource$(){
    return this.dataSource$;
  }
  //getting data and storing it on data source
  changeData(data){
    console.log(data, 'data')
    this.dataSource$ = data
    }
}
