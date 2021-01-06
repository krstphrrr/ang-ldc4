import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import {HttpParams} from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  params
  private apiParams = new Subject()
  private apiUpdate = new BehaviorSubject<any>([])
  apiParams$:Observable<any>= this.apiUpdate.asObservable()
  resData = new Subject()
  
  resCols = new Subject()


  constructor(
    private http: HttpClient,

    ) { 
    this.params = new HttpParams()
  }

  getParams() {
    this.newParams(this.apiUpdate)
    console.log(this.params, "DENTRO DE LA FUNCION")
    this.http.get('http://api.landscapedatacommons.org/api/geoindicators',{
      params: this.params
    }).subscribe(res=>{
      let columnArray = Object.keys(res[0])
      this.resData.next(res)
      this.resCols.next(columnArray)
    })
  }
  changeParams(terms){
    this.apiUpdate.next(terms)
    console.log(terms, "desde el servicio")
  }
  newParams(list){
    // console.log(list.value, "lista pre iteration")
    let empty = []
    list.value.forEach(i=>{
      if(empty.includes(i)){
        // console.log("ALREADY HAVE", i )
      }else{
        empty.push(i)
        this.params = this.params.set("PrimaryKey",i)
      }
      
    })
  }
  getNewData(){
    return this.apiUpdate
  }

  getAPIdata(){
    return this.resData.asObservable()
  }
}

