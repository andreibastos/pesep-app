import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Barra } from '../models/barra';
import { EnumTipoBarra } from '../../models/componente';

@Component({
  selector: 'app-barra-form',
  templateUrl: './barra-form.component.html',
  styleUrls: ['./barra-form.component.css']
})
export class BarraFormComponent implements OnInit {

  formulario: FormGroup;

  @Input() barrasRecebidas: Array<Barra>;
  @Output() barrasEnviadas: EventEmitter<Array<Barra>> = new EventEmitter();
  private barrasAtualizadas: Array<Barra> = new Array();


  constructor(private formBuild: FormBuilder) { }

  ngOnInit() {

    this.formulario = new FormGroup({
      nome: new FormControl('Barra')
    });

    const barra: Barra = this.barrasRecebidas[0];

    this.CriarFormulario(barra);
  }

  AtualizarBarras() {
    this.barrasRecebidas.forEach(barra => {
      this.barrasAtualizadas.push(barra);
    });
  }


  AtualizarBarraComFormulario(barra: Barra): Barra {
    Object.keys(this.formulario.controls).forEach(campo => {
      barra[campo] = this.formulario.value[campo];
    });
    return barra;
  }

  onSubmit() {
    console.log(this.formulario.value);
    console.log(this.barrasRecebidas);
    // if (this.formulario.valid)
    const barra = this.AtualizarBarraComFormulario(this.barrasRecebidas[0]);
    this.barrasAtualizadas.push(barra);
    // this.AtualizarBarras();

    this.barrasEnviadas.emit(this.barrasAtualizadas);
  }

  CriarFormulario(barra: Barra) {
    this.formulario = this.formBuild.group({
      id_barra: [barra.id_barra],
      nome: [barra.nome, Validators.maxLength(10)],
      tipoBarra: [barra.tipo, Validators.required],
      tensao: [barra.tensao_0, [
        Validators.max(1.1),
        Validators.min(0.9),
        Validators.pattern(new RegExp(/^-?[0-9]+(\.[0-9]*){0,1}$/g))]],
      angulo: [barra.angulo_0, [
        Validators.max(360),
        Validators.min(-360),
        Validators.pattern(new RegExp(/^-?[0-9]+(\.[0-9]*){0,1}$/g))]],
      pGerada: [barra.pGerada, [
        Validators.max(10),
        Validators.min(0),
        Validators.pattern(new RegExp(/^-?[0-9]+(\.[0-9]*){0,1}$/g))]
      ],
      qGerada: [barra.qGerada, [
        Validators.max(10),
        Validators.min(0),
        Validators.pattern(new RegExp(/^-?[0-9]+(\.[0-9]*){0,1}$/g))]],
      pCarga: [barra.pCarga, [
        Validators.max(10),
        Validators.min(0),
        Validators.pattern(new RegExp(/^-?[0-9]+(\.[0-9]*){0,1}$/g))]],
      qCarga: [barra.qCarga, [
        Validators.max(10),
        Validators.min(0),
        Validators.pattern(new RegExp(/^-?[0-9]+(\.[0-9]*){0,1}$/g))]],
      pGeradaMin: [barra.pGeradaMin, [
        Validators.max(10),
        Validators.min(0),
        Validators.pattern(new RegExp(/^-?[0-9]+(\.[0-9]*){0,1}$/g))]],
      pGeradaMax: [barra.pGeradaMax, [
        Validators.max(10),
        Validators.min(0),
        Validators.pattern(new RegExp(/^-?[0-9]+(\.[0-9]*){0,1}$/g))]],
      qGeradaMin: [barra.qGeradaMin, [
        Validators.max(10),
        Validators.min(0),
        Validators.pattern(new RegExp(/^-?[0-9]+(\.[0-9]*){0,1}$/g))]],
      qGeradaMax: [barra.qGeradaMax, [
        Validators.max(10),
        Validators.min(0),
        Validators.pattern(new RegExp(/^-?[0-9]+(\.[0-9]*){0,1}$/g))]],
      qShunt: [barra.qShunt, Validators.pattern(new RegExp(/^-?[0-9]+(\.[0-9]*){0,1}$/g))],
      X: [barra.X, Validators.pattern(new RegExp(/^-?[0-9]+(\.[0-9]*){0,1}$/g))]
    });
    this.formulario.controls['id_barra'].disable();
    this.formulario.controls['tipoBarra'].disable();
    switch (barra.tipo) {
      case EnumTipoBarra.Slack:
        this.formulario.controls['tensao'].disable();
        this.formulario.controls['angulo'].disable();
        this.formulario.controls['pGerada'].disable();
        this.formulario.controls['qGerada'].disable();
        break;
      case EnumTipoBarra.PQ:
        this.formulario.controls['tensao'].disable();
        this.formulario.controls['angulo'].disable();
        this.formulario.controls['pGerada'].disable();
        this.formulario.controls['qGerada'].disable();

        this.formulario.controls['pGerada'].disable();
        this.formulario.controls['qGerada'].disable();
        this.formulario.controls['pGeradaMin'].disable();
        this.formulario.controls['qGeradaMin'].disable();
        this.formulario.controls['pGeradaMax'].disable();
        this.formulario.controls['qGeradaMax'].disable();
        break;
      case EnumTipoBarra.PV:
        this.formulario.controls['angulo'].disable();
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
