import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MarkerService {
  logStatusChange(status:string){
    console.log('test service: '+ status)
  }

  constructor() { }
}
