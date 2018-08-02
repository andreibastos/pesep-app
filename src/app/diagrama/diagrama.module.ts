import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiagramaComponent } from './diagrama.component';
import { BarraFormComponent } from './barra-form/barra-form.component';
import { LinhaFormComponent } from './linha-form/linha-form.component';
import { ResultadosComponent } from './resultados/resultados.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { FaltaFormComponent } from './falta-form/falta-form.component';

@NgModule({
  declarations: [
    DiagramaComponent,
    BarraFormComponent,
    LinhaFormComponent,
    ResultadosComponent,
    FaltaFormComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule
  ],
})
export class DiagramaModule { }
