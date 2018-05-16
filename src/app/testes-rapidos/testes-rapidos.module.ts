import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestesRapidosComponent } from './testes-rapidos.component';
import { FluxoPotenciaComponent } from './fluxo-potencia/fluxo-potencia.component';
import { CurtoCircuitoComponent } from './curto-circuito/curto-circuito.component';
import { LinhaTabelaComponent } from './linha-tabela/linha-tabela.component';
import { BarraTabelaComponent } from './barra-tabela/barra-tabela.component';
import { FluxoTabelaComponent } from './fluxo-tabela/fluxo-tabela.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [TestesRapidosComponent, FluxoPotenciaComponent, CurtoCircuitoComponent, LinhaTabelaComponent, BarraTabelaComponent, FluxoTabelaComponent]
})
export class TestesRapidosModule { }
