import { DataSource } from '@angular/cdk/collections';
// import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';
import { CustomControlService } from '../../services/custom-control.service';

// TODO: Replace this with your own data model type
export interface SummaryTableItem {
  project: string;
  length: number;
}

// TODO: replace this with real data from your application
// const EXAMPLE_DATA: SummaryTableItem[] = [
//   {id: 1, name: 'Hydrogen'},
//   {id: 2, name: 'Helium'},
//   {id: 3, name: 'Lithium'},
//   {id: 4, name: 'Beryllium'},

// ];

/**
 * Data source for the SummaryTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class SummaryTableDataSource extends DataSource<SummaryTableItem> {
  // data: SummaryTableItem[] = EXAMPLE_DATA;
  projects
  // paginator: MatPaginator;
  sort: MatSort;

  constructor(
    private dataBus:CustomControlService
  ) {
    super();
   
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<SummaryTableItem[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    
    this.dataBus.currentData.subscribe(dat => this.projects = dat)
    const dataMutations = [
      observableOf(this.projects),
      // this.paginator.page,
      this.sort.sortChange
    ];

    return merge(...dataMutations).pipe(map(() => {
      // return this.getPagedData(this.getSortedData([...this.data]));
      return this.getSortedData([...this.projects]);

    }));
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  // private getPagedData(data: SummaryTableItem[]) {
  //   const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
  //   return data.splice(startIndex, this.paginator.pageSize);
  // }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: SummaryTableItem[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'project': return compare(a.project, b.project, isAsc);
        case 'id': return compare(+a.length, +b.length, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
