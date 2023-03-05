import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tabela',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {


  @Input() table;

  @Input()
  striped = true;
  constructor() { }

  ngOnInit() {
    // console.log(this.table);
  }

}
