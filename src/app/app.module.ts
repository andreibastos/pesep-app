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

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    QuemSomosComponent,
    ColaboreComponent,
    NaoEncontradaComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TestesRapidosModule,
    DiagramaModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
