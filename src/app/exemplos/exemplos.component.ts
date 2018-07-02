import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-exemplos',
  templateUrl: './exemplos.component.html',
  styleUrls: ['./exemplos.component.css']
})
export class ExemplosComponent implements OnInit {
  constructor() { }
  title = 'Exemplos para Testes';
  button = 'Baixar';

  examples = [
    {
      id: 1,
      title: 'Exemplo 1',
      text: 'Fundamentos de Sistemas Elétricos de Potência - Zanetta - 2006',
      link: '../../assets/download/exemplo-5.zip',
      img: '../../assets/images/exemplos/5.png'
    },
    {
      id: 2,
      title: 'Exemplo 2',
      text: 'Fundamentos de Sistemas Elétricos de Potência - Zanetta - 2006',
      link: '../../assets/download/exemplo-6.zip',
      img: '../../assets/images/exemplos/6.png'
    }, {
      id: 3,
      title: 'Exemplo 3',
      text: 'Fundamentos de Sistemas Elétricos de Potência - Zanetta - 2006',
      link: '../../assets/download/exemplo-7.zip',
      img: '../../assets/images/exemplos/7.png'
    }, {
      id: 4,
      title: 'Exemplo 4',
      text: 'Fundamentos de Sistemas Elétricos de Potência - Zanetta - 2006',
      link: '../../assets/download/exemplo-8.zip',
      img: '../../assets/images/exemplos/8.png'
    }, {
      id: 5,
      title: 'Exemplo 5',
      text: 'Fundamentos de Sistemas Elétricos de Potência - Zanetta - 2006',
      link: '../../assets/download/exemplo-9.zip',
      img: '../../assets/images/exemplos/9.png'
    }
  ];

  ngOnInit() {
  }


}
