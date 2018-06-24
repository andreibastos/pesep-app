import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-barra-form',
  templateUrl: './barra-form.component.html',
  styleUrls: ['./barra-form.component.css']
})
export class BarraFormComponent implements OnInit {

  formulario: FormGroup;
  constructor() { }

  ngOnInit() {
  }

}
