import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuemSomosComponent } from './quem-somos/quem-somos.component';
import { TestesComponent } from './testes-rapidos/testes-rapidos.component';
import { DiagramaComponent } from './diagrama/diagrama.component';
import { ExemplosComponent } from './exemplos/exemplos.component';

const routes: Routes = [
  { path: '', redirectTo: 'diagrama', pathMatch: 'full' },
  { path: 'quem-somos', component: QuemSomosComponent },
  { path: 'exemplos', component: ExemplosComponent },
  { path: 'testar', component: TestesComponent },
  { path: 'diagrama', component: DiagramaComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
