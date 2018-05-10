import { ProjectComponent } from './project/project.component';
import { ProjectModule } from './project/project.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { DashboardRoutingModule } from './dashboard-routing.module';


@NgModule({
  imports: [
    CommonModule, DashboardRoutingModule
  ],
  declarations: [DashboardComponent, ProjectComponent, ConfigurationComponent],
  exports: [],
  providers: []
})
export class DashboardModule { }
