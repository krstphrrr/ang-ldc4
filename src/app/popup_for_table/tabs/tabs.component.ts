import { Component, OnDestroy, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { StringService } from 'src/app/services/string.service';
import { TabledataService } from 'src/app/services/tabledata.service';
interface Res{
  tables:[]
}

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent implements OnInit, OnDestroy {
  // tabs: dynamic creation and destruction of tabs
  tabs = []
  selected = new FormControl(0)
  // table data for each table in tab
  public tabledataSubscription:Subscription
  public unsubscribeSubscription:Subscription
  public extract

  //table popu
  tableCols = []
  tableData:any= []
  subscription:Subscription;

  constructor(
    private tabledata:TabledataService,
    private str: StringService,
    private apiservice: ApiService,
  ) {
    //subscription to detect changes to tables
    this.str.publicTables.subscribe((res:Res)=>{
      this.tabs = res.tables
    })

    this.subscription = this.str.retrieveContent().subscribe(dropDownChoice=>{
    
    if(dropDownChoice){
      // console.log("you chose something")
      this.apiservice.getData(dropDownChoice.data).subscribe(res=>{
        // console.log(res)
        this.tableData = []
        this.tableCols = []
        if(Object.keys(res).length!==0){
          // console.log(res)
            this.tableCols = res['cols']
            this.tableData = res['data']
            this.subscription.unsubscribe()
            
          } else {
            this.tableCols = []
            this.tableData = []
          }
      })
    }
  })
   }
  ngOnDestroy(): void {
    this.subscription.unsubscribe()
    // throw new Error('Method not implemented.');
  }
   addTab(tabname){
     this.tabs.push(tabname)
    //  if (selectAfterAdding){
    //    this.selected.setValue(this.tabs.length-1)
    //  }
   }
   removeTab(index){
     this.tabs.splice(index,1)
   }

  ngOnInit(): void {
    
  }
  

}
