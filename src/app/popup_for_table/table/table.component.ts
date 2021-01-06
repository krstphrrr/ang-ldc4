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
  title = 'angdimatable';
  constructor(
    private tbldata: TabledataService,
    private apiserv: ApiService
  ) { 
    
    this.subscription = this.apiserv.apiParams$.subscribe(dat=>{
      this.refresh()
    })
  }

  refresh(){
    console.log()
    // this.tempSet=[]
    // this.filterArray = []
    this.tbldata.dataSource$.subscribe(newData=>{
      console.log(newData)
      this.tableDataSrc = new MatTableDataSource(newData['data'])
      this.tableDataSrc.sort = this.sort 
      this.tableDataSrc.paginator = this.paginator
    })
    

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

}
