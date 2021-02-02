import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { environment as env } from '../environments/environment';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MapComponent } from './map/map.component';
import { LearnComponent } from './learn/learn.component';
import { DataComponent } from './data/data.component';
import { AboutComponent } from './about/about.component';
import { FolderComponent } from './folder/folder.component';
import { UsersComponent } from './users/users.component';
import { MatInputModule} from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule } from '@angular/material/checkbox'
import { PanelComponent } from './map/controls/panel/panel/panel.component';
import { LoginComponent } from './header/login/login.component';
import { Routes, RouterModule } from '@angular/router'
// import { AuthService } from './auth/auth.service'
// import { AuthGuard } from './auth/auth.guard';
import { CallbackComponent } from './callback/callback.component'
import { MatButtonToggleModule } from '@angular/material/button-toggle'
import { MatIconModule } from '@angular/material/icon'
import {MatSliderModule} from '@angular/material/slider';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { DragDropModule } from '@angular/cdk/drag-drop'
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PlotsComponent } from './map/plots/plots.component';
import { PlotListComponent } from './map/plots/plot-list/plot-list.component';
import { CdkTableModule } from '@angular/cdk/table'
import { HttpClientModule } from '@angular/common/http';
import { LayersComponent } from './map/controls/layers/layers.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ProfileComponent } from './profile/profile.component';
// import { AppRoutingModule } from './app-routing.module';
import { ScrollingModule } from '@angular/cdk/scrolling'
// import { AuthGuard } from './services/auth.guard';
import { AuthModule } from '@auth0/auth0-angular';
import { AuthHttpInterceptor } from '@auth0/auth0-angular'
import { SummaryTableComponent } from './map/summary-table/summary-table.component';
import { DragpopComponent } from './map/dragpop/dragpop.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
// import { InterceptorService } from './services/interceptor.service';

import { AltwoodyComponent } from './altwoody/altwoody.component';
import { BaselayersComponent } from './map/baselayers/baselayers.component';
import { OverlaysComponent } from './map/overlays/overlays.component';
import { PopupForTableComponent } from './popup_for_table/popup-for-table/popup-for-table.component';
import { TableComponent } from './popup_for_table/table/table.component';
import { LoginComponentComponent } from './auth/login-component/login-component.component';
import { LogoutComponentComponent } from './auth/logout-component/logout-component.component';
import { TableDropdownComponent } from './map/table-dropdown/table-dropdown.component';
import { ChipsComponent } from './popup_for_table/chips/chips.component';
import { TabsComponent } from './popup_for_table/tabs/tabs.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatChipsModule} from '@angular/material/chips';
import {MatFormFieldModule} from '@angular/material/form-field';


const appRoutes: Routes = [
  { path: '', 
    component: MapComponent },
  // { path: 'map', 
  //   component: MapComponent },
  { path: 'learn', 
    component: LearnComponent },

  { path: 'data', 
    component: DataComponent },

  { path: 'about', 
    component: AboutComponent },

  { path: 'files', 
    component: FolderComponent },

  { path: 'profile', 
    component: ProfileComponent, }
    

  // { path: , component: }
]


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MapComponent,
    LearnComponent,
    DataComponent,
    AboutComponent,
    FolderComponent,
    UsersComponent,
    PanelComponent,
    LoginComponent,
    CallbackComponent,
    PlotsComponent,
    PlotListComponent,
    LayersComponent,
    ProfileComponent,
    SummaryTableComponent,
    DragpopComponent,
    AltwoodyComponent,
    BaselayersComponent,
    OverlaysComponent,
    PopupForTableComponent,
    TableComponent,
    LoginComponentComponent,
    LogoutComponentComponent,
    TableDropdownComponent,
    ChipsComponent,
    TabsComponent
    
  ],
  imports: [
    BrowserModule,
    // NgbModule,
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
    MatIconModule,
    RouterModule.forRoot(appRoutes),
    CdkTableModule,
    HttpClientModule,
    FormsModule,
    MatButtonToggleModule,
    DragDropModule,
    OverlayModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatSliderModule,
    MatButtonToggleModule,
    MatSnackBarModule,
    ScrollingModule,
    AuthModule.forRoot({
      ...env.auth,
      httpInterceptor:{
        allowedList:[{
          uri:`/api/*`,
          tokenOptions:{
            audience:'http://localhost:5002'
          }
        }]
      }

    }),
    MatAutocompleteModule,
    MatChipsModule,
    MatFormFieldModule,
    ReactiveFormsModule

  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
