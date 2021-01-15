import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject, Subscription } from 'rxjs';
import {HttpParams} from "@angular/common/http";
import { environment } from '../../environments/environment'
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService implements OnDestroy {
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
  // subscriptions
  httpSub:Subscription
  private readonly loading = new Subject<boolean>()
  get loading$():Observable<boolean>{
    return this.loading
  }

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
    // this.params = new HttpParams()
  }
  ngOnDestroy(): void {
    this.httpSub.unsubscribe()
  }

  getData(choice){
    
    this.data$  = new BehaviorSubject({})
    let newString = `${this.api}/api/${choice}`.toLowerCase()
    this.newParams(this.apiUpdate)

    this.httpOptions['params'] = this.params

 
    // console.log(this.params)

    this.httpSub = this.http.get(newString, this.httpOptions).subscribe( res =>{
      tap(()=>this.loading.next(true))
        let complete = {}
        let cols = []
        let data = res
        console.log(res)
        for(let[key,value] of Object.entries(res[0])){
          cols.push(key)
        }
        complete['choice'] = choice
        complete['cols'] =cols 
        complete['data'] = data 
        this.loading.next(false)
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
    this.params = new HttpParams()
    let noRepeats = new Set(list.value)

    // noRepeats.forEach(i =>{
    //   this.params = this.params.append("PrimaryKey",i)
    // })
    this.params = this.params.append("PrimaryKey",Array.from(noRepeats).join(','))
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

