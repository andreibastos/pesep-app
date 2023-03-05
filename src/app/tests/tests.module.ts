import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestsComponent } from './tests.component';
import { UploadCsvComponent } from './upload-csv/upload-csv.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule, SharedModule
  ],
  declarations: [TestsComponent, UploadCsvComponent],
  exports: [UploadCsvComponent]
})
export class TestsModule { }
