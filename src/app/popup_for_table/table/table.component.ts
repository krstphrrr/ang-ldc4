import { DataSource } from '@angular/cdk/collections';
import { Component, OnInit, Input, ViewChild, OnDestroy, Output, EventEmitter, } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
// import { map } from 'rxjs/operators';
import { Subscription, BehaviorSubject, ObjectUnsubscribedError} from 'rxjs'
import { Observable, of as observableOf, merge, of } from 'rxjs';
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
    this.tableListSubs=this.str.tableArray2.subscribe(res=>{
      // console.log(res)
      this.tableList = res.tableArray
      
    })

    this.subscription = this.str.retrieveContent().subscribe(dat=>{

      this.refresh()
    })
  }

  refresh(){
    
    
    // this.tempSet=[]
    // this.filterArray = []
    if(this.api.data$){
      this.api.data$.subscribe(newData=>{
        this.tableDataSrc = new MatTableDataSource(newData['data'])
        this.tableDataSrc.sort = this.sort
        this.tableDataSrc.paginator = this.paginator
        this.saveSubs = newData
        this.saveTableData(newData['choice'],newData) //for csv's
        this.includeData()

        this.subscription.unsubscribe() //need to not reload each table as they appear
        
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


