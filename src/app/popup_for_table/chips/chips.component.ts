import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, OnInit,  ElementRef, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable, scheduled} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import { StringService } from '../../services/string.service'
import { ApiService } from '../../services/api.service'
import { table } from 'console';

interface Tables {
  value: string;
  pathName: string;
}


@Component({
  selector: 'app-chips',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.css']
})
export class ChipsComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tableCtrl = new FormControl();
  filteredTables: Observable<string[]>;
  tables
  table = new Set()
  allTables
  wholePackage = {}

  @ViewChild('tableInput2') tableInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(
    private str: StringService,
    private api: ApiService
  ) { 
    this.filteredTables = this.tableCtrl.valueChanges.pipe(
      // need to look for schedule logic since startWith is deprecated
      // startWith(null),
      
      map((table: string | null) => table ? this._filter(table) : this.allTables.slice()))
      
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    
    // Add our fruit
    if ((value || '').trim()) {
      this.tables.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
    console.log(event)
    

    this.tableCtrl.setValue(null);
  }

  remove(table: string): void {
    const index = this.tables.indexOf(table);

    if (index >= 0) {
      this.tables.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    
    this.sendContent(event)
    this.tables.push(event.option.viewValue);
    this.tableInput.nativeElement.value = '';
    this.tableCtrl.setValue(null);
  }

  ngOnInit(): void {
    this.api.getTables().subscribe(res=>{
      this.tables = res
    })
    // console.log(this.allTables)
  }
  getTables(){
    this.api.getTables().subscribe(result=>{
      console.log(result)
      // this.allTables = result
    })
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allTables.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  }

  sendContent(content){
    // content is produced when a selection event triggers
    // it contains an array with the selection
    let currentTable 
    let tables = []
    let tableArray = content.value
    // let wholePackage = {}
    // tableArray.sort((a,b)=>{
    //   return tableArray.indexOf()
    // })
    
    // array refreshes with same order as elements are received from backend
    // so selecting current element by taking tha last one will not work
    // for(let i in tableArray){
    //   if(!tables.includes(i)){
    //     tables.push(i)
    //   }
    // }
    
    let justAdded
    if(tableArray.length>0){
      // if the 'selected table array' has anything...
      // console.log(tableArray)
      // console.log(content.value)
      // console.log(this.table)
      // console.log(this.dropdownFilter(Array.from(this.table),content.value))
      let seqOrder
      // 
      if(Array.from(this.table).length===0){
        // if the SET "table" has nothing in it, 
        seqOrder = tableArray
        currentTable = seqOrder[seqOrder.length-1]
      } else {
        console.log(this.table, content.value)
        seqOrder = this.dropdownFilter(Array.from(this.table),content.value)
        currentTable = seqOrder[tableArray.length-1]
      }
      // currentTable = tableArray[tableArray.length-1]
      // console.log(currentTable)
      tableArray.forEach(i=>{
        if(!Array.from(this.table).includes(i)){
          justAdded = i
          this.table.add(i)
          seqOrder = this.dropdownFilter(Array.from(this.table),content.value)
          } 
        })
        
      if(Array.from(this.table).length>1){
       this.table.forEach(j=>{
        //  console.log(j, justAdded)
          if(j!==justAdded){
            this.table.delete(j)
          }
        })
      }
      this.wholePackage['current'] = currentTable
      this.wholePackage['tableArray'] = tableArray
      // console.log(this.table)
      this.str.sendContent(this.wholePackage)
      // this.str.sendTableArray(tableArray)
    } else {
      currentTable
      this.wholePackage['current'] = currentTable
      this.wholePackage['tableArray'] = tableArray
      this.str.sendContent(this.wholePackage)
    }
    // this.str.sendContent(content.value)
  }
  sendTableArray(content){
    this.str.sendTableArray(content.value)
  }

  dropdownFilter(prearray,post){
    let retAr 
    // console.log(prearray.length, post.length)
    switch(true){
      case (prearray.length<post.length):
        post.forEach(i=>{
          if(!prearray.includes(i)){
            prearray.push(i)
          }
        })
        // console.log(prearray)
        return prearray
      case (prearray.length>post.length):
        prearray.forEach(i=>{
          if(!post.includes(i)){
            console.log(i)
            retAr = prearray.filter(val=>{return val!==i})
          }
        })
        
        console.log(retAr)
        return retAr
      case(prearray.length==post.length):
        if(prearray==post){
          console.log("son iguales")
          return post
        } else {
          console.log("son distintos")
          return post
        }
      }
    }
}
