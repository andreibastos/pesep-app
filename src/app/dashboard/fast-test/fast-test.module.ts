import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FastTestComponent } from './fast-test.component';
import { BarComponent } from './bar/bar.component';
import { LineComponent } from './line/line.component';
import { ResultComponent } from './result/result.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [FastTestComponent, BarComponent, LineComponent, ResultComponent]
})
export class FastTestModule { }
