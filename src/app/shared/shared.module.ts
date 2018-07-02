import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabelaComponent } from './tabela/tabela.component';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,

  ],
  declarations: [TabelaComponent],
  exports: [TabelaComponent]
})
export class SharedModule { }
