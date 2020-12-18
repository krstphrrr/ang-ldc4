import { Component, OnInit, Input, OnDestroy, OnChanges } from '@angular/core';
import {Subscription} from 'rxjs'
import {TabledataService} from '../../services/tabledata.service'

@Component({
  selector: 'app-popup-for-table',
  templateUrl: './popup-for-table.component.html',
  styleUrls: ['./popup-for-table.component.css']
})
export class PopupForTableComponent implements OnInit, OnDestroy, OnChanges {

  public tabledataSubscription:Subscription
  public unsubscribeSubscription:Subscription
  public extract


  constructor(
    private tabledata:TabledataService
  ) {
    console.log("dentro del constructor")
    this.tabledataSubscription = this.tabledata.getdataSource$().subscribe(dat=>{
      this.extract = dat
      console.log(this.extract)
    })

    this.unsubscribeSubscription = this.tabledata.getUnsub().subscribe(sig=>{
      if(sig==="delete"){
        console.log("lo borre")
        
      }
    })
    // this.testFunction()
    
    
  }

  testFunction(){
    console.log("dentro de la funcion en el constructor")
    // keeping track of changes in  tabledata
    
    
  }

  closePopup(){
    //clearing chosen overlays on popup close
    
    //
    this.tabledata.sendCloseSignal()
  }

  ngOnInit(): void {
    // if(this.tabledataSubscription!==undefined){
    //   // this.tabledataSubscription.unsubscribe()
    //   this.resubscribe()
    // } else {
    //   this.resubscribe()
    // }
  }

  resubscribe(){
    this.tabledataSubscription = this.tabledata.getdataSource$().subscribe(dat=>{
      this.extract = dat
      console.log(this.extract)
    })
  }
  ngOnChanges(){

  }

  unsubscribe_without_destroy(){
    
    this.tabledataSubscription.unsubscribe()
  }

  ngOnDestroy():void{
    console.log("component destroyed")
    this.tabledataSubscription.unsubscribe()
  }
  

}
