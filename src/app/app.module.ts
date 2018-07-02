import { SharedModule } from './shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QuemSomosComponent } from './quem-somos/quem-somos.component';
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
  providers: [SharedModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
