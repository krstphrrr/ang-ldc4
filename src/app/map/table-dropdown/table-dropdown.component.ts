import { Component, OnInit } from '@angular/core';

interface Tables {
  value: string;
  pathName: string;
}

@Component({
  selector: 'app-table-dropdown',
  templateUrl: './table-dropdown.component.html',
  styleUrls: ['./table-dropdown.component.css']
})
export class TableDropdownComponent implements OnInit {

  tables: Tables[]
  empty_list = []
  selected;

  //dropdown logic here:
  // need to connect to new service (str) and api fetcher


  constructor() { }

  ngOnInit(): void {
  }

}
