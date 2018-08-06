import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Falta } from '../../models/falta';

@Component({
  selector: 'app-falta-form',
  templateUrl: './falta-form.component.html',
  styleUrls: ['./falta-form.component.css']
})

export class FaltaFormComponent implements OnInit {
  formulario: FormGroup;
  @Input() faltaRecebida: Falta;
  @Output() faltaEnviada: EventEmitter<any> = new EventEmitter();
  private _faltaAtualizada: Falta;

  constructor(private formBuild: FormBuilder) { }
  ngOnInit() {
    console.log(this.faltaRecebida);
    this.CriarFormulario(this.faltaRecebida);
  }

  AplicaCSSError(campo) {
    return {
      'has-error': this.VerificaValidTouched(campo),
      'has-feedback': this.VerificaValidTouched(campo)
    };
  }

  VerificaValidTouched(campo) {
    return !this.formulario.get(campo).valid && this.formulario.get(campo).touched;
  }

  AtualizarFaltaComFormulario(): Falta {
    const novaFalta: Falta = new Falta(this.faltaRecebida.barra);
    Object.keys(this.formulario.controls).forEach(campo => {
      // if ((campo !== 'de') && (campo !== 'para')) {
        novaFalta[campo] = this.formulario.get(campo).value;
      // }
    });
    return novaFalta;
  }

  CriarFormulario(falta: Falta) {
    this.formulario = this.formBuild.group({
      xg: [falta.xg, [
        Validators.min(0)
      ]],
      x0: [falta.x0, [
        Validators.min(0)
      ]],
      enumFaltaTipo: [falta.enumFaltaTipo],
      enumFaltaLocal: [falta.enumFaltaLocal],
    });
  }

  onSubmit(command) {
    if (this.formulario.valid) {
      this._faltaAtualizada = this.AtualizarFaltaComFormulario();
      const response = { 'command': command, 'data': this._faltaAtualizada };
      this.faltaEnviada.emit(response);
    }
  }

}
