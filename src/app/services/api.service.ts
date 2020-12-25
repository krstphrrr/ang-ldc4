import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import {HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  params = new HttpParams()
  private apiParams = new Subject()
  private apiUpdate = new BehaviorSubject<any>([])
  apiParams$:Observable<any>= this.apiUpdate.asObservable()


  constructor(private http: HttpClient) { }

  getParams() {
    this.newParams(this.apiUpdate)
    this.http.get('http://api.landscapedatacommons.org/api/geoindicators',{
      params: this.params
    }).subscribe(res=>{
      console.log(res)
    })
  }
  changeParams(terms){
    this.apiUpdate.next(terms)
    console.log(terms, "desde el servicio")
  }
  newParams(list){
    list.forEach(i=>{
      this.params.append("PrimaryKey",i)
    })
  }
  
}

