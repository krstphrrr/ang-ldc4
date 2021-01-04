import { DataSource } from '@angular/cdk/collections';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
// import { map } from 'rxjs/operators';
import { Subscription, BehaviorSubject, ObjectUnsubscribedError} from 'rxjs'
import { Observable, of as observableOf, merge, of } from 'rxjs';
import {TabledataService} from '../../services/tabledata.service'


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator:MatPaginator;
  @Input('tableColumns')tableCols:string[]=[]
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
  
  constructor(
    private tbldata: TabledataService
  ) { 
    this.subscription = this.tbldata.getdataSource$().subscribe(dat=>{
      console.log(dat)
    })
  }

  ngOnInit(): void {
  }
  changePage(event){

    if(this.totalLength > this.tableDataSrc.data.length){
       if(this.pageIndex < event.pageIndex){
        // next page
        this.skip = this.skip + this.limit;
      }
    }
  }

}
