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
  @ViewChild(MatSort,{static:true}) sort: MatSort;
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
  loading$:boolean=true
  countContent
  errorMessage =false
  
  saveSubs = new Observable
  title = 'angdimatable';
  constructor(
    private tbldata: TabledataService,
    private api: ApiService,
    private str: StringService
  ) { 
    this.api.loading$.subscribe(isLoading=>{
      
      this.loading$=isLoading
    })
    
    this.tableListSubs=this.str.tableArray2.subscribe(res=>{
      // console.log(res)
      this.tableList = res.tableArray
      
    })

    this.subscription = this.str.retrieveContent().subscribe(dat=>{
      // once a signal is received that an option has been selected, 
      // this.refresh will check if a data packet has been assembled 
      // (newData). if the newdata object includes the selected table (should have been
      // assembled in tabs and sent to apiservice), the tablecols and tabledata will 
      // be pulled from the apidata behavior subject. 

      
      this.refresh()
      
    })
  }

  refresh(){
    
    if(this.api.data$){
      this.apiResponseSubs = this.api.data$.subscribe(newData=>{
        console.log(newData)
        if(Array.from(Object.keys(newData)).length>0 && Object.keys(newData).includes(this.which)){
          this.errorMessage= false

          // console.log(this.which)
          this.tableCols = newData[this.which]['cols']
          this.tableDataSrc = new MatTableDataSource(newData[this.which]['data'])
          this.tableDataSrc.paginator = this.paginator
          this.totalLength = this.tableDataSrc.data.length
          this.tableDataSrc.sort = this.sort
          // console.log(this.totalLength,, this.pageIndex)
          this.saveSubs = newData
          newData[this.which]['count'].then(e=>this.countContent=e)
          // csv data 
          this.saveTableData(newData['choice'],newData[this.which]) //for csv's
          this.includeData()
          // unsubscribe from all after setting the received data within html template
          // to make sure data is not reused in subsequent created tables
          this.subscription.unsubscribe()
          this.tableListSubs.unsubscribe()
          // this.apiResponseSubs.unsubscribe()
          
        } else {
          this.errorMessage = true
          this.subscription.unsubscribe()
          this.tableListSubs.unsubscribe()
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

  

  ngOnInit(): void {
    this.refresh()
  }
  changePage(event){
    console.log(this.totalLength,this.tableDataSrc.data.length, this.pageIndex,event.pageIndex)
    if(this.totalLength < this.tableDataSrc.data.length){
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
  trackTask(index: number, item: any): string {
    return `${item.id}`;
  }

  includeData(){
    // sends data to tabs for csv creation
    if(this.csvTables){
      this.str.sendFullData(this.csvTables)
    }
  }

}


