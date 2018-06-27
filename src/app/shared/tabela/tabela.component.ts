import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tabela',
  templateUrl: './tabela.component.html',
  styleUrls: ['./tabela.component.css']
})
export class TabelaComponent implements OnInit {


  @Input() table;

  @Input()
  striped = true;
  constructor() { }

  ngOnInit() {
    console.log(this.table);
  }

}
