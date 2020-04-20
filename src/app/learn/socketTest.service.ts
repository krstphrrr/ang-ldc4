import { Injectable } from '@angular/core';
import * as io from 'socket.io-client'
import { Observable } from 'rxjs'


@Injectable({providedIn:'root'})

export class socketDataService {
  socket: any
  readonly url:string = 'https://new.landscapedatacommons.org/'
  // readonly url:string = 'http://localhost:5000' DEV
  constructor(){
    this.socket = io(this.url,{path:'/ws2'}).connect()
    // this.socket = io.connect(this.url) DEV
  }

// this.socket.listen(eventname) to
// trigger receiving a response
  listen(eventName:string){
    return new Observable((subscriber)=>{
      this.socket.on(eventName, (data)=>{
        subscriber.next(data)
      })
    })
  }

// send data
  emit(eventName:string, data:any){
    this.socket.emit(eventName, data)
  }
}