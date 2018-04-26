import { ProjectModule } from './project/project.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { ConfigurationComponent } from './configuration/configuration.component';

@NgModule({
  imports: [
    CommonModule, ProjectModule
  ],
  declarations: [DashboardComponent, ConfigurationComponent],
  exports: [DashboardComponent],
  providers: []
})
export class DashboardModule { }
