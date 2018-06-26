import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiagramaComponent } from './diagrama.component';
import { BarraFormComponent } from './barra-form/barra-form.component';
import { LinhaFormComponent } from './linha-form/linha-form.component';
import { ResultadosComponent } from './resultados/resultados.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TabelaComponent } from '../shared/tabela/tabela.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    DiagramaComponent,
    BarraFormComponent,
    LinhaFormComponent,
    ResultadosComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule 
  ],
})

// ler https://angular-2-training-book.rangle.io/handout/modules/shared-di-tree.html
export class DiagramaModule { }
