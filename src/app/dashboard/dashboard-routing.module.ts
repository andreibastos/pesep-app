import { ProjectComponent } from './project/project.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';



const routes: Routes = [
  { path: 'dashboard', redirectTo: 'dashboard/project',  pathMatch: 'full' },
  { path: 'dashboard/project', component: ProjectComponent }
];


@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class DashboardRoutingModule { }
