import { SharedModule } from './shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthorsComponent } from './authors/authors.component';
import { DiagramModule } from './diagram/diagram.module';
import { ExamplesComponent } from './examples/examples.component';
import { TestsModule } from './tests/tests.module';

@NgModule({
  declarations: [
    AppComponent,
    AuthorsComponent,
    ExamplesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TestsModule,
    DiagramModule
  ],
  providers: [SharedModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
