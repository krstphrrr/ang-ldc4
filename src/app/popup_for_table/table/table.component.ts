import { DataSource } from '@angular/cdk/collections';
import { Component, OnInit, Input, ViewChild, OnDestroy, } from '@angular/core';
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

  headerText: string;
  limit:number = 10;
  skip:number = 0;
  totalLength:number = 0;
  pageIndex : number = 0;
  pageLimit:number[] = [5, 10, 20, 100] ;

  tableDataSrc:any

  output:any[]=[];
  subscription:Subscription;
  saveSubs = new Observable
  title = 'angdimatable';
  constructor(
    private tbldata: TabledataService,
    private api: ApiService,
    private str: StringService
  ) { 
    
    this.subscription = this.str.retrieveContent().subscribe(dat=>{
      this.refresh()
    })
  }

  refresh(){
    console.log()
    // this.tempSet=[]
    // this.filterArray = []
    if(this.api.data$){
      this.api.data$.subscribe(newData=>{
        this.tableDataSrc = new MatTableDataSource(newData['data'])
        this.tableDataSrc.sort = this.sort
        this.tableDataSrc.paginator = this.paginator
        this.saveSubs = newData
        this.subscription.unsubscribe()
      })
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
    this.subscription.unsubscribe()
  }

  dlCsv(){
    console.log(this.saveSubs)
    if(this.saveSubs){
      // this.subscription.subscribe(download=>{
        const replacer = (key, value) => value === null ? '' : value; 
        const header = this.saveSubs['cols'];
        let csv = this.saveSubs['data'].map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
        csv.unshift(header.join(','));
        let csvArray = csv.join('\r\n');
        var blob = new Blob([csvArray], {type: 'text/csv' })
        saveAs(blob, "selectedData.csv");
      }
    }

  }


