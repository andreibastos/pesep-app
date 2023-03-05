import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'KVA';
  language = 'br';

  nav_items = [
    { routerLink: 'authors', name: 'Autores' },
    { routerLink: 'tests', name: 'Testes' },
    { routerLink: 'examples', name: 'Exemplos' },
  ];

}
