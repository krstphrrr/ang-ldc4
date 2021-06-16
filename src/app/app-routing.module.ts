import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import { Routes, RouterModule } from '@angular/router'
import { MapComponent } from './map/map.component';
import { LearnComponent } from './learn/learn.component';
import { AboutComponent } from './about/about.component';
import { FolderComponent } from './folder/folder.component';
import { PartnersComponent } from './about/partners/partners.component';
import { DevelopmentComponent } from './about/development/development.component';
// import { AuthGuard } from '../app/services/';
const routes: Routes = [
  {
    path: 'profile',
    component: ProfileComponent,
    // canActivate: [AuthGuard]
  },

  { 
    path: '', 
    component: MapComponent
  },

  {
    path: 'learn', 
    component: LearnComponent
  },

  {
    path: 'about', 
    component: AboutComponent,
    children:[
      {
        path:"partners",
        component: PartnersComponent
      },
      {
        path:"development",
        component: DevelopmentComponent
      }
    ]
  },

  {
    path: 'files', 
    component: FolderComponent
  },

  {
    path: 'profile', 
    component: ProfileComponent,
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes,{ relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
