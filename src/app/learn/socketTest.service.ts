import { Injectable } from '@angular/core';
import * as io from 'socket.io-client'
import { Observable } from 'rxjs'

@Injectable({providedIn:'root'})

export class socketDataService {
  socket: any
  readonly url:string = 'http://new.landscapedatacommons.org/socket'

  constructor(){
    this.socket = io.connect(this.url)
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