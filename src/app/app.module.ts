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
  MatSortModule, MatTableModule, MatExpansionModule, MatCardModule, 
  MatGridListModule, MatButtonModule, MatSelectModule, MatTabsModule,
  MatListModule} from "@angular/material";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MapOlComponent } from './map-ol/map-ol.component';
import { PanelComponent } from './map/controls/panel/panel/panel.component';
import { LoginComponent } from './header/login/login.component';
import { Routes, RouterModule } from '@angular/router'
// import { AuthService } from './auth/auth.service'
// import { AuthGuard } from './auth/auth.guard';
import { CallbackComponent } from './callback/callback.component'

import { ReactiveFormsModule } from '@angular/forms';
import { PlotsComponent } from './map/plots/plots.component';
import { PlotListComponent } from './map/plots/plot-list/plot-list.component';
import { CdkTableModule } from '@angular/cdk/table'
import { HttpClientModule } from '@angular/common/http';

const appRoutes: Routes = [
  { path: '', 
    component: MapComponent },
  { path: 'map', 
    component: MapComponent },
  { path: 'learn', 
    component: LearnComponent },

  { path: 'data', 
    component: DataComponent },

  { path: 'tools', 
    component: ToolsComponent },

  { path: 'files', 
    component: FolderComponent },
  { path: 'user', 
    component: UsersComponent }
    

  // { path: , component: }
]


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MapComponent,
    LearnComponent,
    DataComponent,
    ToolsComponent,
    FolderComponent,
    UsersComponent,
    MapOlComponent,
    PanelComponent,
    LoginComponent,
    CallbackComponent,
    PlotsComponent,
    PlotListComponent
    
  ],
  imports: [
    BrowserModule,
    NgbModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatCardModule,
    MatGridListModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTabsModule,
    MatListModule,
    RouterModule.forRoot(appRoutes),
    CdkTableModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
