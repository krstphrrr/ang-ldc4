import { Injectable } from '@angular/core';
import * as io from 'socket.io-client'
import { Observable } from 'rxjs'

@Injectable({providedIn:'root'})

export class socketTest {
  socket: any
  readonly url:string = 'http://localhost:5000/'

  constructor(){
    this.socket = io(this.url)
  }

  // public sendMessage(message:string){
  //   console.log('socketService/msg')
  //   this.socket.emit('loquesea', message)
  // }
  listen(eventName:string){
    return new Observable((subscriber)=>{
      this.socket.on(eventName, (data)=>{
        subscriber.next(data)
      })
    })
  }


  emit(eventName:string, data:any){
    this.socket.emit(eventName, data)
  }
}