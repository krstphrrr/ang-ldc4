import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject, Subscription } from 'rxjs';
import {HttpParams} from "@angular/common/http";
import { environment } from '../../environments/environment'
import { map, tap } from 'rxjs/operators';
import { MoveEndService } from './move-end.service';
import { AuthService } from '@auth0/auth0-angular';

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
  complete = {}
  isAuth
  dataCount$ = new Subject()

  // subscriptions
  httpSub:Subscription
  coordSub:Subscription
  authSubs:Subscription

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
    private auth:AuthService

    ) { 
      this.coordsUpdate()
      this.auth.isAuthenticated$.subscribe(e=>{
        this.isAuth = e
      })
    // this.params = new HttpParams()
  }


  getData(choice){
    
    this.data$  = new BehaviorSubject({})
    console.log(this.isAuth)
    let nonAuth = this.isAuth===true?'logged/':''
    let newString = `${this.api}/api/${choice}`.toLowerCase()

    // coord controller string 
    let newString2 = `${this.api}/api/${this.isAuth==true?'logged/':''}${choice}_coords`.toLowerCase()
    console.log(newString2)
    this.newParams(this.coords)

    // experimental params object


    this.httpOptions['params'] = this.params

 
    // console.log(this.params)

    this.httpSub = this.http.get(newString2, this.httpOptions).subscribe( res =>{
      console.log(res)
        this.loading.next(true)
        // let complete = {}
        let cols = []
        let data = res
        let preComplete = {}
        console.log(res)
        for(let[key,value] of Object.entries(res[0])){
          cols.push(key)
        }
        this.complete['choice'] = choice
        preComplete['cols'] =cols 
        preComplete['data'] = data 
        // counting items inside response
        // this.dataCount$.next(this.countFunction(data))
        preComplete['count'] = this.countFunction(data)
        
        this.complete[`${choice}`] = preComplete
        // console.log("ANHADIDO")
        
        
        // console.log(this.complete, "POST IF")

        this.loading.next(false)
        this.data$.next(this.complete)
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
  onDestroySignal(){

  }

  async countFunction(data){
    
    let rowsLength = await this.dataCount(data)
    
    let pkLength = await this.pkCount(data)

    return `Result set of ${rowsLength} rows, and ${pkLength} primary keys.`
  }

  async pkCount(data){
    const uniquePK = []
    let pkLength = uniquePK.length
    await data.forEach(dat=>{
      if(!uniquePK.includes(dat["PrimaryKey"]))
        uniquePK.push(dat["PrimaryKey"])
        
    })
  //   for await(let i of data){
  //     console.log(data[i])
  //     // if(!uniquePK.includes(i["PrimaryKey"])){
  //     //   console.log(i["PrimaryKey"])
  //     //   uniquePK.push(i["PrimaryKey"])
  //     // }
  // }
  
  return uniquePK.length
}

   async dataCount(data){
    let rowsLength = await data.length
    return rowsLength
    }
    

  trimData(newArray){
    // console.log(this.complete)
    let compArray = Object.keys(this.complete)
    switch(true){
      case(compArray.length>newArray.length):
        compArray.forEach(i=>{
          if(!newArray.includes(i)){
            delete this.complete[i]
          }
        })
        break

      case(compArray.length<newArray.length || compArray.length==newArray.length):
        console.log("es anhadir o son iguales")
        break
    }
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

