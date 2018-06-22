import { CurtoCircuitoComponent } from './curto-circuito/curto-circuito.component';
import { FluxoPotenciaComponent } from './fluxo-potencia/fluxo-potencia.component';
import { FluxoArquivosComponent } from './fluxo-arquivos/fluxo-arquivos.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TestesRapidosComponent } from './testes-rapidos.component';
import { FluxoManualComponent } from './fluxo-manual/fluxo-manual.component';


const routes: Routes = [
    {
        path: 'testes/fluxo', component: FluxoPotenciaComponent, children: [

            { path: 'arquivo', component: FluxoArquivosComponent },
            { path: 'manual', component: FluxoManualComponent }

        ]
    },
    {
        path: 'testes/curto', component: CurtoCircuitoComponent, children: [

            { path: 'arquivo', component: FluxoArquivosComponent },
            { path: 'manual', component: FluxoManualComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TestesRapidosRoutingModule { }
