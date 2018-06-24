import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Barra } from '../models/barra';

@Component({
  selector: 'app-barra-form',
  templateUrl: './barra-form.component.html',
  styleUrls: ['./barra-form.component.css']
})
export class BarraFormComponent implements OnInit {


  @Input() barras: Array<Barra>;

  formulario: FormGroup;

  constructor() { }

  ngOnInit() {
  }

}
