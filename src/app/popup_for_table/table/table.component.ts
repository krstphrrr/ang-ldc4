import { DataSource } from '@angular/cdk/collections';
import { Component, OnInit, Input, ViewChild, OnDestroy, Output, EventEmitter, } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
// import { map } from 'rxjs/operators';
import { Subscription, BehaviorSubject, ObjectUnsubscribedError} from 'rxjs'
import { Observable, of } from 'rxjs';
import {TabledataService} from '../../services/tabledata.service'
import {ApiService} from '../../services/api.service'
import { StringService } from 'src/app/services/string.service';
import {saveAs} from 'file-saver/dist/FileSaver'
interface Res{
  current:string,
  tableArray:[]
}


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator:MatPaginator;
  @Input()tableCols:string[]=[]
  @Input()tableData:{}[]=[];
  @Input()which
  @Output() dataChanged: EventEmitter<any> = new EventEmitter()

  csvTables = {}

  headerText: string;
  limit:number = 10;
  skip:number = 0;
  totalLength:number = 0;
  pageIndex : number = 0;
  pageLimit:number[] = [5, 10, 20, 100] ;

  tableDataSrc:any
  tableName
  tableList
  tick = 0

  output:any[]=[];
  //subscription
  subscription:Subscription;
  tableListSubs:Subscription
  apiResponseSubs:Subscription
  
  saveSubs = new Observable
  title = 'angdimatable';
  constructor(
    private tbldata: TabledataService,
    private api: ApiService,
    private str: StringService
  ) { 
    // console.log(this.tableCols)
    // of(this.tableCols).subscribe(arr=>{
    //   // console.log(arr, "TESTING")
    // })
    this.tableListSubs=this.str.tableArray2.subscribe(res=>{
      // console.log(res)
      this.tableList = res.tableArray
      
    })

    this.subscription = this.str.retrieveContent().subscribe(dat=>{
      // console.log(dat)
      // this.saveSubsCheck()
      // if(this.tick<1){
      //   this.refresh()
      //   this.tick+=1
      // }
      this.refresh()
      
    })
  }

  refresh(){
    // console.log(this.tableCols)
    // console.log(this.saveSubs)
    
    // this.tempSet=[]
    // this.filterArray = []
    if(this.api.data$){
      this.apiResponseSubs = this.api.data$.subscribe(newData=>{
        console.log(newData)
        if(Array.from(Object.keys(newData)).length>0 && Object.keys(newData).includes(this.which)){
          console.log(newData[this.which])
          console.log(this.which)

          this.tableCols = newData[this.which]['cols']
          this.tableDataSrc = new MatTableDataSource(newData[this.which]['data'])
          this.tableDataSrc.sort = this.sort
          this.tableDataSrc.paginator = this.paginator
          this.saveSubs = newData
          this.saveTableData(newData['choice'],newData) //for csv's
          this.includeData()
          this.subscription.unsubscribe()
          this.tableListSubs.unsubscribe()
          this.apiResponseSubs.unsubscribe()
          
        }
         //need to not reload each table as they appear
        
      })
    }
    
  }
  saveTableData(name, data){
    // let smallObject = {}
    if(name && data){
      if(!Object.keys(this.csvTables).includes(name)){
        this.csvTables[name] = data
      }
    }
  }
  saveSubsCheck(){
    console.log(this.saveSubs)
  }

  // filterObject(preObj,postObj){
  //   let preObjArray = Object.keys(preObj)
  //   let postObjArray = Object.keys(postObj)
  //   let retObj

  //   switch(true){
  //     case (preObjArray.length<postObjArray.length):
  //       postObjArray.forEach(i=>{
  //         if(!preObjArray.includes(i)){
  //           preObjArray['']
  //           // prearray.push(i) NO
  //         }
  //       })
  //       // console.log(prearray)
  //       return preObj
  //     case (preObjArray.length>postObjArray.length):
  //       preObjArray.forEach(i=>{
  //         if(!postObjArray.includes(i)){
  //           console.log(i)
  //           retAr = prearray.filter(val=>{return val!==i})
  //         }
  //       })
  //       console.log(retAr)
  //       return retAr
  //     }
  // }
  

  ngOnInit(): void {
    this.refresh()
  }
  changePage(event){

    if(this.totalLength > this.tableDataSrc.data.length){
       if(this.pageIndex < event.pageIndex){
        // next page
        this.skip = this.skip + this.limit;
      }
    }
  }
  ngOnDestroy(){
    console.log("TABLE DESTROYED")
    // this.apiResponseSubs.unsubscribe()
    this.subscription.unsubscribe()
    this.tableListSubs.unsubscribe()
  }

  includeData(){
    // sends data to tabs for csv creation
    if(this.csvTables){
      this.str.sendFullData(this.csvTables)
    }
  }

}


