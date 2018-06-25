import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiagramaComponent } from './diagrama.component';
import { BarraFormComponent } from './barra-form/barra-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LinhaFormComponent } from './linha-form/linha-form.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  declarations: [DiagramaComponent, BarraFormComponent, LinhaFormComponent]
})
export class DiagramaModule { }
