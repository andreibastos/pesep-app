import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Falta } from '../../models/fault';

@Component({
  selector: 'app-falta-form',
  templateUrl: './fault-form.component.html',
  styleUrls: ['./fault-form.component.css']
})

export class FaultFormComponent implements OnInit {
  formulario: FormGroup;
  @Input() faltaRecebida: Falta;
  @Output() faltaEnviada: EventEmitter<any> = new EventEmitter();
  private _faltaAtualizada: Falta;

  constructor(private formBuild: FormBuilder) { }
  ngOnInit() {
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
    const novaFalta: Falta = new Falta(this.faltaRecebida.barra || this.faltaRecebida.linha);
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
      porcentagem: [falta.porcentagem, [
        Validators.min(0),
        Validators.max(1)
      ]],
      enumFaltaTipo: [falta.enumFaltaTipo]
    });
  }

  onSubmit(command) {
    if (this.formulario.valid) {
      this._faltaAtualizada = this.AtualizarFaltaComFormulario();
      const response = { 'command': command, 'data': this._faltaAtualizada };
      this.faltaEnviada.emit(response);
      console.log(this.faltaEnviada);
    }
  }

}
