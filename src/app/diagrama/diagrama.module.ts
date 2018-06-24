import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiagramaComponent } from './diagrama.component';
import { BarraFormComponent } from './barra-form/barra-form.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  declarations: [DiagramaComponent, BarraFormComponent]
})
export class DiagramaModule { }
