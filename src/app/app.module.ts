import { FluxoPotenciaComponent } from './testes-rapidos/fluxo-potencia/fluxo-potencia.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { QuemSomosComponent } from './quem-somos/quem-somos.component';
import { ColaboreComponent } from './colabore/colabore.component';
import { TestesRapidosModule } from './testes-rapidos/testes-rapidos.module';
import { DiagramaModule } from './diagrama/diagrama.module';
import { NaoEncontradaComponent } from './nao-encontrada/nao-encontrada.component';
import { ExemplosComponent } from './exemplos/exemplos.component';
import { ExemplosModalComponent } from './exemplos/exemplos-modal/exemplos-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    QuemSomosComponent,
    ColaboreComponent,
    NaoEncontradaComponent,
    ExemplosComponent,
    ExemplosModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TestesRapidosModule,
    DiagramaModule
  ],
  providers: [FluxoPotenciaComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
