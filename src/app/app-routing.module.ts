import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthorsComponent } from './authors/authors.component';
import { DiagramComponent } from './diagram/diagram.component';
import { ExamplesComponent } from './examples/examples.component';
import { TestsComponent } from './tests/tests.component';

const routes: Routes = [
  { path: '', redirectTo: 'digram', pathMatch: 'full' },
  { path: 'authors', component: AuthorsComponent },
  { path: 'examples', component: ExamplesComponent },
  { path: 'tests', component: TestsComponent },
  { path: 'digram', component: DiagramComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
