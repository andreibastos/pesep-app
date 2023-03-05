import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table/table.component';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,

  ],
  declarations: [TableComponent],
  exports: [TableComponent]
})
export class SharedModule { }
