import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import {Subscription} from 'rxjs'
import {TabledataService} from '../../services/tabledata.service'

@Component({
  selector: 'app-popup-for-table',
  templateUrl: './popup-for-table.component.html',
  styleUrls: ['./popup-for-table.component.css']
})
export class PopupForTableComponent implements OnInit, OnDestroy {

  dataSignal:Subscription


  constructor(
    private tabledata:TabledataService
  ) {
    this.testFunction()
  }

  testFunction(){
    // keeping track of changes in  tabledata
    this.dataSignal= this.tabledata.getdataSource$().subscribe(dat=>{
      console.log(dat)
    })
  }

  closePopup(){
    //clearing chosen overlays on popup close
    
    //
    this.tabledata.sendCloseSignal()
  }

  ngOnInit(): void {
  }

  ngOnDestroy():void{

  }

}
