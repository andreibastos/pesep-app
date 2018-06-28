import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Linha } from './../models/linha';

@Component({
  selector: 'app-linha-form',
  templateUrl: './linha-form.component.html',
  styleUrls: ['./linha-form.component.css']
})
export class LinhaFormComponent implements OnInit {
  formulario: FormGroup;
  @Input() linhaRecebida: Linha;
  @Output() linhaEnviada: EventEmitter<Linha> = new EventEmitter();
  private linhaAtualizada: Linha;

  constructor(private formBuild: FormBuilder) { }


  ngOnInit() {
    this.CriarFormulario(this.linhaRecebida);
  }

  AtualizarLinhaComFormulario(linha: Linha): Linha {
    const novaLinha: Linha = new Linha();
    Object.keys(this.formulario.controls).forEach(campo => {
      if ((campo !== 'de') && (campo !== 'para')) {
        novaLinha[campo] = this.formulario.get(campo).value;
      }
    });
    return novaLinha;
  }

  onSubmit() {
    this.linhaAtualizada = this.AtualizarLinhaComFormulario(this.linhaRecebida);
    this.linhaEnviada.emit(this.linhaAtualizada);
  }

  CriarFormulario(linha: Linha) {
    this.formulario = this.formBuild.group({
      id_linha: linha.id_linha,
      nome: [linha.nome, Validators.maxLength(10)],
      R: [linha.R, [
        Validators.max(10),
        Validators.min(0)
      ]],
      X: [linha.X, [
        Validators.max(10),
        Validators.min(0)
      ]],
      TAP: [linha.TAP, [
        Validators.max(10),
        Validators.min(0)
      ]],
      A: [linha.A, [
        Validators.max(10),
        Validators.min(0)
      ]
      ],
      tipo_trafo: [
        linha.tipo_trafo
      ],
      resistencia_zero: [linha.resistencia_zero, [
        Validators.max(5),
        Validators.min(0)
      ]
      ],
      reatancia_trafo: [linha.reatancia_trafo, [
        Validators.max(5),
        Validators.min(0)
      ]
      ],

      de: [linha.de.id_barra],
      para: [linha.para.id_barra]

    });
    this.formulario.controls['id_linha'].disable();
    this.formulario.controls['de'].disable();
    this.formulario.controls['para'].disable();
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


}
