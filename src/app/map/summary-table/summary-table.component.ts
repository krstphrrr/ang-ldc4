import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { SummaryTableDataSource, SummaryTableItem } from './summary-table-datasource';
import { CustomControlService } from '../../services/custom-control.service'

@Component({
  selector: 'app-summary-table',
  templateUrl: './summary-table.component.html',
  styleUrls: ['./summary-table.component.css']
})
export class SummaryTableComponent implements AfterViewInit, OnInit {
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<SummaryTableItem>;
  dataSource: SummaryTableDataSource;
  constructor(dataBus:CustomControlService){}

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['project', 'length'];

  ngOnInit() {
    this.dataSource = new SummaryTableDataSource(this.dataSource.projects);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    // this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
}
