import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MAT_TABS_CONFIG } from '@angular/material/tabs';
import { environment as env } from '../environments/environment';
// modules 
import { MaterialModule } from './material.module'
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Routes, RouterModule } from '@angular/router'
import { DragDropModule } from '@angular/cdk/drag-drop'
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CdkTableModule } from '@angular/cdk/table'
import { HttpClientModule } from '@angular/common/http';
import { OverlayModule } from '@angular/cdk/overlay';
import { ScrollingModule } from '@angular/cdk/scrolling'

// custom components
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MapComponent } from './map/map.component';
import { LearnComponent } from './learn/learn.component';
import { AboutComponent } from './about/about.component';
import { FolderComponent } from './folder/folder.component';
import { UsersComponent } from './users/users.component';
import { PanelComponent } from './map/controls/panel/panel/panel.component';
import { PlotsComponent } from './map/plots/plots.component';
import { PlotListComponent } from './map/plots/plot-list/plot-list.component';
import { LayersComponent } from './map/controls/layers/layers.component';
import { ProfileComponent } from './profile/profile.component';
import { SummaryTableComponent } from './map/summary-table/summary-table.component';
import { DragpopComponent } from './map/dragpop/dragpop.component';
import { AuthModule } from '@auth0/auth0-angular';
import { AuthHttpInterceptor } from '@auth0/auth0-angular'
import { BaselayersComponent } from './map/baselayers/baselayers.component';
import { OverlaysComponent } from './map/overlays/overlays.component';
import { PopupForTableComponent } from './popup_for_table/popup-for-table/popup-for-table.component';
import { TableComponent } from './popup_for_table/table/table.component';
import { LoginComponentComponent } from './auth/login-component/login-component.component';
import { LogoutComponentComponent } from './auth/logout-component/logout-component.component';
import { TableDropdownComponent } from './map/table-dropdown/table-dropdown.component';
import { ChipsComponent } from './popup_for_table/chips/chips.component';
import { TabsComponent } from './popup_for_table/tabs/tabs.component';
import { SpinnerComponent } from './utils/spinner/spinner.component';
import { ResizeDirective } from './directives/resize.directive';
import { ScrollfocusDirective } from './directives/scrollfocus.directive';
import { DoubleclickDirective } from './directives/doubleclick.directive';
import { SidenavComponent } from './sidenav/sidenav.component';
import { AppRoutingModule } from './app-routing.module';






// token test
export function tokenGetter() {
  return localStorage.getItem("access_token");
}



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MapComponent,
    LearnComponent,
    AboutComponent,
    FolderComponent,
    UsersComponent,
    PanelComponent,
    PlotsComponent,
    PlotListComponent,
    LayersComponent,
    ProfileComponent,
    SummaryTableComponent,
    DragpopComponent,
    BaselayersComponent,
    OverlaysComponent,
    PopupForTableComponent,
    TableComponent,
    LoginComponentComponent,
    LogoutComponentComponent,
    TableDropdownComponent,
    ChipsComponent,
    TabsComponent,
    SpinnerComponent,
    ResizeDirective,
    ScrollfocusDirective,
    DoubleclickDirective,
    SidenavComponent,
  ],
  
  imports: [
    MaterialModule,
    BrowserModule,
    BrowserAnimationsModule,
    // RouterModule.forRoot(appRoutes, { relativeLinkResolution: 'legacy' }),
    CdkTableModule,
    HttpClientModule,
    FormsModule,
    DragDropModule,
    OverlayModule,
    ScrollingModule,
    ReactiveFormsModule,
    AuthModule.forRoot({
      ...env.auth,
      httpInterceptor:{
        allowedList:[{
          uri:`${env.dev.serverUrl}/api/logged/*`,
          tokenOptions:{
            audience:'http://localhost:5002'
          }
        }]
      }
    }),
    AppRoutingModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true
    },
    { provide: MAT_TABS_CONFIG, useValue: { animationDuration: 100 }}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
