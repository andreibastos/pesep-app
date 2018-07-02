import { SharedModule } from './shared/shared.module';
import { FluxoPotenciaComponent } from './testes-rapidos/fluxo-potencia/fluxo-potencia.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QuemSomosComponent } from './quem-somos/quem-somos.component';
// import { TestesModule } from './testes-rapidos/testes-rapidos.module';

import { DiagramaModule } from './diagrama/diagrama.module';
import { ExemplosComponent } from './exemplos/exemplos.component';
import { TestesModule } from './testes/testes.module';

@NgModule({
  declarations: [
    AppComponent,
    QuemSomosComponent,
    ExemplosComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TestesModule,
    DiagramaModule
  ],
  providers: [FluxoPotenciaComponent, SharedModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
