import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import {HttpParams} from "@angular/common/http";
import { environment } from '../../environments/environment'
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  //environment variables
  private api = environment.API_URL
  tables = environment.TABLE_URL

  //param mangling
  params
  private apiParams = new Subject()
  private apiUpdate = new BehaviorSubject<any>([])
  apiParams$:Observable<any>= this.apiUpdate.asObservable()
  
  //response mangling
  resData = new Subject()
  resCols = new Subject()
  data$

  private extractData(res:Response){
    let body=res;
    return body || {};
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':'application/json'
    }),
  }

  constructor(
    private http: HttpClient,

    ) { 
    this.params = new HttpParams()
  }

  getData(choice){
    this.data$  = new BehaviorSubject({})
    let newString = `${this.api}/api/${choice}`.toLowerCase()
    this.newParams(this.apiUpdate)
    // console.log(this.params)
    this.httpOptions['params'] = this.params

    // console.log(this.httpOptions)
    // console.log(this.params)
    // console.log(newString)
    this.http.get(newString, this.httpOptions).toPromise().then( res =>{
        let complete = {}
        let cols = []
        let data = res
        // console.log(res)
        for(let[key,value] of Object.entries(res[0])){
          cols.push(key)
        }
        complete['choice'] = choice
        complete['cols'] =cols 
        complete['data'] = data 
        this.data$.next(complete)
      }
    )
    return this.data$
  }


  changeParams(terms){
    this.apiUpdate.next(terms)
    // console.log(terms, "desde el servicio")
  }
  newParams(list){
    // console.log(list.value, "lista pre iteration")

    for(let i of list.value){
      // console.log(i)
      this.params = this.params.set("PrimaryKey",i)
    }
  }
  getNewData(){
    return this.apiUpdate
  }

  getAPIdata(){
    return this.resData.asObservable()
  }

  getTables(){
    return this.http.get(this.tables, this.httpOptions).pipe(
      map(this.extractData)
    )
  }
}

