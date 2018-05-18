import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ColaboreComponent } from './colabore/colabore.component';
import { QuemSomosComponent } from './quem-somos/quem-somos.component';
import { HomeComponent } from './home/home.component';
import { TestesRapidosComponent } from './testes-rapidos/testes-rapidos.component';
import { DiagramaComponent } from './diagrama/diagrama.component';
import { ExemplosComponent } from './exemplos/exemplos.component';

const routes: Routes = [
  { path: '', redirectTo: 'diagrama', pathMatch: 'full' },
  // { path: 'home', component: HomeComponent },
  { path: 'quem-somos', component: QuemSomosComponent },
  { path: 'colabore', component: ColaboreComponent },
  { path: 'exemplos', component: ExemplosComponent },
  { path: 'testar', component: TestesRapidosComponent },
  { path: 'diagrama', component: DiagramaComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
