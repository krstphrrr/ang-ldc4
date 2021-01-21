import { Component, OnInit } from '@angular/core';
import { StringService } from '../../services/string.service'
import { ApiService } from '../../services/api.service'

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


  constructor(
    private str: StringService,
    private api: ApiService
  ) { }

  ngOnInit(): void {
    this.selected = this.api.getTables()
  }

  getTables(){
    this.api.getTables().subscribe(result=>{
     
      this.selected = result
    })
  }

  sendContent(content){
    this.str.sendContent(content.value)
  }

}
