import { TestesRapidosService } from './../testes-rapidos.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-curto-circuito',
  templateUrl: './curto-circuito.component.html',
  styleUrls: ['./curto-circuito.component.css']
})
export class CurtoCircuitoComponent implements OnInit {


  canCalcule = false;
  arquivos = [];

  constructor(private testesRapidosService: TestesRapidosService) { }

  ngOnInit() {
  }

  loadFiles(event) {
    console.log(event);
    this.arquivos = event;
    this.canCalcule = true;
  }

  CalculeShort() {
    this.testesRapidosService.calcular(this.arquivos, 'short').then(
      result => {
        console.log(result);
      }
    );
  }
}
