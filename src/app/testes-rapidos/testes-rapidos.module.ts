import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestesComponent } from './testes-rapidos.component';
import { FluxoPotenciaComponent } from './fluxo-potencia/fluxo-potencia.component';
import { CurtoCircuitoComponent } from './curto-circuito/curto-circuito.component';
import { LinhaTabelaComponent } from './linha-tabela/linha-tabela.component';
import { BarraTabelaComponent } from './barra-tabela/barra-tabela.component';
import { FluxoTabelaComponent } from './fluxo-tabela/fluxo-tabela.component';
import { FluxoArquivosComponent } from './fluxo-arquivos/fluxo-arquivos.component';
import { CurtoArquivosComponent } from './curto-arquivos/curto-arquivos.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    SharedModule
  ],
  declarations: [
    TestesComponent,
    FluxoPotenciaComponent,
    CurtoCircuitoComponent,
    LinhaTabelaComponent,
    BarraTabelaComponent,
    FluxoTabelaComponent,
    FluxoArquivosComponent,
    CurtoArquivosComponent,
  ]
})
export class TestesModule { }
