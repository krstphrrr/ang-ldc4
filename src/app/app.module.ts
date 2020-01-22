import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MapComponent } from './map/map.component';
import { LearnComponent } from './learn/learn.component';
import { DataComponent } from './data/data.component';
import { ToolsComponent } from './tools/tools.component';
import { FolderComponent } from './folder/folder.component';
import { UsersComponent } from './users/users.component';
import { MatInputModule, MatPaginatorModule, MatProgressSpinnerModule, 
  MatSortModule, MatTableModule } from "@angular/material";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MapComponent,
    LearnComponent,
    DataComponent,
    ToolsComponent,
    FolderComponent,
    UsersComponent
    
  ],
  imports: [
    BrowserModule,
    NgbModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
