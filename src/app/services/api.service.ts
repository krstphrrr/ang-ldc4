import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject, Subscription } from 'rxjs';
import {HttpParams} from "@angular/common/http";
import { environment } from '../../environments/environment'
import { map, tap } from 'rxjs/operators';
import { MoveEndService } from './move-end.service';

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
  coords

  // subscriptions
  httpSub:Subscription
  coordSub:Subscription

  // test for loading dependent elements like spinners
  private readonly loading = new Subject<boolean>()
  get loading$():Observable<boolean>{
    return this.loading
  }

  private extractData(res:Response){
    let body=res;
    return body || {};
  }

  httpOptions = {}

  constructor(
    private http: HttpClient,
    private coordsService:MoveEndService,

    ) { 
      this.coordsUpdate()
    // this.params = new HttpParams()
  }


  getData(choice){
    
    this.data$  = new BehaviorSubject({})
    let newString = `${this.api}/api/${choice}`.toLowerCase()

    // coord controller string 
    let newString2 = `${this.api}/api/${choice}_coords`.toLowerCase()
    this.newParams(this.coords)

    // experimental params object


    this.httpOptions['params'] = this.params

 
    // console.log(this.params)

    this.httpSub = this.http.get(newString2, this.httpOptions).subscribe( res =>{
      // tap(()=>this.loading.next(true))
        let complete = {}
        let cols = []
        let data = res
        let preComplete = {}
        console.log(res)
        for(let[key,value] of Object.entries(res[0])){
          cols.push(key)
        }
        complete['choice'] = choice
        preComplete['cols'] =cols 
        preComplete['data'] = data 
        complete[`${choice}`] = preComplete
        console.log(complete)
        this.loading.next(false)

        this.data$.next(complete)
        }
      )
    return this.data$
    }

  coordsUpdate(){
    
    this.coordSub = this.coordsService.publicCoords$.subscribe(dat=>{
      // console.log(dat)
      this.coords = dat
    })
  }


  changeParams(terms){
    this.apiUpdate.next(terms)
    // console.log(terms, "desde el servicio")
  }
  newParams(list){
    this.params = new HttpParams()
    // let noRepeats = new Set(list.value)
    let encodedCoords = btoa(list)

    // noRepeats.forEach(i =>{
    //   this.params = this.params.append("PrimaryKey",i)
    // })

    // this.params = this.params.append("PrimaryKey",Array.from(noRepeats).join(','))
    this.params = this.params.append("coords",encodedCoords)
  }
  getNewData(){
    return this.apiUpdate
  }

  getAPIdata(){
    return this.resData.asObservable()
  }

  getTables(){

    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':'application/json'
      }),
    }
    return this.http.get(this.tables, this.httpOptions).pipe(
      map(this.extractData)
    )
  }
  ngOnDestroy(): void {
    this.httpSub.unsubscribe()
    this.coordSub.unsubscribe()
  }
}

