import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayerService {

  constructor() { }
  public layer;

  checkLayer(feature:string){
    if(feature==='map'){
      this.layer = true
    } else {
      this.layer = false
    }
  }



}

