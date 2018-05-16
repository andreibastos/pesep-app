import { ColaboreComponent } from './colabore/colabore.component';
import { QuemSomosComponent } from './quem-somos/quem-somos.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent  },
  { path: 'quem-somos', component: QuemSomosComponent  },
  { path: 'colabore', component: ColaboreComponent  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
