import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import { Subscription } from 'rxjs';
import { StringService } from 'src/app/services/string.service';
interface Res{
  tables:[]
}

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent implements OnInit {
  // tabs: dynamic creation and destruction of tabs
  tabs
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
    private str: StringService
  ) {
    this.str.publicTables.subscribe((res:Res)=>{
      
      this.tabs = res.tables
    })
   }
   addTab(selectAfterAdding:boolean){
     this.tabs.push("new")
     if (selectAfterAdding){
       this.selected.setValue(this.tabs.length-1)
     }
   }
   removeTab(index){
     this.tabs.splice(index,1)
   }

  ngOnInit(): void {
    
  }

}
