import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections'
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
  selection = new SelectionModel<SummaryTableItem>(true, []);

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['select','project', 'length'];
  constructor(private dataBus:CustomControlService){}

  ngOnInit() {
    this.dataSource = new SummaryTableDataSource(this.dataBus);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    // this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  /** Whether the number of selected elements matches the total number of rows. */
isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.dataSource.data.length;
  return numSelected == numRows;
}

/** Selects all rows if they are not all selected; otherwise clear selection. */
masterToggle() {
  this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
}
}
