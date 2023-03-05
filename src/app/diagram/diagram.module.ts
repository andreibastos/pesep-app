import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiagramComponent } from './diagram.component';
import { BusFormComponent } from './bus-form/bus-form.component';
import { LineFormComponent } from './line-form/line-form.component';
import { ResultComponent } from './result/result.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { FaultFormComponent } from './fault-form/fault-form.component';

@NgModule({
  declarations: [
    DiagramComponent,
    BusFormComponent,
    LineFormComponent,
    ResultComponent,
    FaultFormComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule
  ],
})
export class DiagramModule { }
