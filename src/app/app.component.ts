import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'KVA';

  nav_items = [
    {routerLink : 'quem-somos', name: 'Autores'},
    {routerLink : 'testar', name: 'Testes'},
    {routerLink : 'exemplos', name: 'Exemplos'},
  ];

}
