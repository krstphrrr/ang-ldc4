import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, OnInit,  ElementRef, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable, scheduled} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import { StringService } from '../../services/string.service'
import { ApiService } from '../../services/api.service'

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
  tables = []
  allTables

  @ViewChild('tableInput2') tableInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(
    private str: StringService,
    private api: ApiService
  ) { 
    this.filteredTables = this.tableCtrl.valueChanges.pipe(
      // need to look for schedule logic since startWith is deprecated
      // startWith(null),
      map((table: string | null) => table ? this._filter(table) : this.allTables.slice()));
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

    this.tableCtrl.setValue(null);
  }

  remove(table: string): void {
    const index = this.tables.indexOf(table);

    if (index >= 0) {
      this.tables.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.tables.push(event.option.viewValue);
    this.tableInput.nativeElement.value = '';
    this.tableCtrl.setValue(null);
  }

  ngOnInit(): void {
    this.api.getTables().subscribe(res=>{
      this.allTables = res
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

}
