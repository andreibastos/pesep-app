import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Barra } from '../../models/barra';
import { EnumBarraTipo } from '../../models/enumeradores';

@Component({
  selector: 'app-barra-form',
  templateUrl: './barra-form.component.html',
  styleUrls: ['./barra-form.component.css']
})
export class BarraFormComponent implements OnInit {

  formulario: FormGroup;

  @Input() barrasRecebidas: Array<Barra>;
  @Output() barrasEnviadas: EventEmitter<any> = new EventEmitter();
  barrasAtualizadas: Array<Barra> = new Array();

  private regex = /\d/g;
  constructor(private formBuild: FormBuilder) { }

  ngOnInit() {
    const barra: Barra = this.barrasRecebidas[0];
    this.CriarFormulario(barra);
  }

  AtualizarBarras() {
    this.barrasRecebidas.forEach(barra => {
      this.barrasAtualizadas.push(barra);
    });
  }


  AtualizarBarraComFormulario(barra: Barra): Barra {
    const novaBarra: Barra = new Barra(barra.tipo);
    Object.keys(this.formulario.controls).forEach(campo => {
      novaBarra[campo] = this.formulario.get(campo).value;
    });
    return novaBarra;
  }

  onSubmit(btn) {
    this.barrasAtualizadas = [];

    if (btn === 'cancel') {
      this.barrasEnviadas.emit();
    } else if (btn === 'delete') {
      this.barrasAtualizadas = this.barrasRecebidas;
      this.barrasEnviadas.emit({ 'delete': this.barrasAtualizadas });

    } else if (this.formulario.valid && btn === 'update') {
      const barra = this.AtualizarBarraComFormulario(this.barrasRecebidas[0]);
      this.barrasAtualizadas.push(barra);
      this.barrasEnviadas.emit({ 'update': this.barrasAtualizadas });
    }
    this.barrasAtualizadas = new Array();
  }

  CriarFormulario(barra: Barra) {
    this.formulario = this.formBuild.group({
      id_barra: barra.id_barra,
      nome: [barra.nome, Validators.maxLength(10)],
      tipoBarra: [barra.tipo, Validators.required],
      tensao_0: [barra.tensao_0, [
        Validators.max(1.1),
        Validators.min(0.9)
      ]],
      angulo_0: [barra.angulo_0, [
        Validators.max(360),
        Validators.min(-360)
      ]],
      pGerada: [barra.pGerada, [
        Validators.max(10),
        Validators.min(0)
      ]
      ],
      qGerada: [barra.qGerada, [
        Validators.max(10),
        Validators.min(0)
      ]],
      pCarga: [barra.pCarga, [
        Validators.max(10),
        Validators.min(0)
      ]],
      qCarga: [barra.qCarga, [
        Validators.max(10),
        Validators.min(0)
      ]],
      pGeradaMin: [barra.pGeradaMin, [
        Validators.max(10),
        Validators.min(0)
      ]],
      pGeradaMax: [barra.pGeradaMax, [
        Validators.max(10),
        Validators.min(0)
      ]],
      qGeradaMin: [barra.qGeradaMin, [
        Validators.max(10),
        Validators.min(0)
      ]],
      qGeradaMax: [barra.qGeradaMax, [
        Validators.max(10),
        Validators.min(0)
      ]],
      qShunt: [barra.qShunt, [
        Validators.min(0),
        Validators.max(10)
      ]
      ],
      X: [barra.X, [
        Validators.min(0.000001),
        Validators.max(10)
      ]]
    });
    this.formulario.controls['id_barra'].disable();
    this.formulario.controls['tipoBarra'].disable();
    switch (barra.tipo) {
      case EnumBarraTipo.Slack:
        this.formulario.controls['tensao_0'].disable();
        this.formulario.controls['angulo_0'].disable();
        this.formulario.controls['pGerada'].disable();
        this.formulario.controls['qGerada'].disable();
        break;
      case EnumBarraTipo.PQ:
        this.formulario.controls['tensao_0'].disable();
        this.formulario.controls['angulo_0'].disable();
        this.formulario.controls['pGerada'].disable();
        this.formulario.controls['qGerada'].disable();

        this.formulario.controls['pGerada'].disable();
        this.formulario.controls['qGerada'].disable();
        this.formulario.controls['pGeradaMin'].disable();
        this.formulario.controls['qGeradaMin'].disable();
        this.formulario.controls['pGeradaMax'].disable();
        this.formulario.controls['qGeradaMax'].disable();
        break;
      case EnumBarraTipo.PV:
        this.formulario.controls['angulo_0'].disable();
        this.formulario.controls['qGerada'].disable();
        this.formulario.controls['pGeradaMin'].disable();
        this.formulario.controls['pGeradaMax'].disable();
        break;
    }

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
