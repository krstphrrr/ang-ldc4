import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, OnInit,  ElementRef, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable, scheduled} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import { StringService } from '../../services/string.service'
import { ApiService } from '../../services/api.service'

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
      startWith(null),
      map((fruit: string | null) => fruit ? this._filter(fruit) : this.allTables.slice()));
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

  remove(fruit: string): void {
    const index = this.tables.indexOf(fruit);

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
  }
  getTables(){
    this.api.getTables().subscribe(result=>{
      this.allTables = result
    })
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allTables.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  }

}
