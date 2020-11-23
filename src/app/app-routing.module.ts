import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import { Routes, RouterModule } from '@angular/router'
import { AuthGuard } from './services/auth.guard';
import { FolderComponent } from './folder/folder.component';
const routes: Routes = [
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  }
  // {
  //   path: 'folder',
  //   component: FolderComponent //,
  //   // canActivate: [AuthGuard]
  // }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class AppRoutingModule { }
