import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestesComponent } from './testes.component';
import { UploadCsvComponent } from './upload-csv/upload-csv.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule, SharedModule
  ],
  declarations: [TestesComponent, UploadCsvComponent],
  exports: [UploadCsvComponent]
})
export class TestesModule { }
