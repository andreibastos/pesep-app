import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { QuemSomosComponent } from './quem-somos/quem-somos.component';
import { ColaboreComponent } from './colabore/colabore.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    QuemSomosComponent,
    ColaboreComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
