import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-exemplos',
  templateUrl: './exemplos.component.html',
  styleUrls: ['./exemplos.component.css']
})
export class ExemplosComponent implements OnInit {
  constructor() { }
  title = 'Exemplos';
  button = 'Baixar';



  examples = [
    {
      id: 1,
      title: 'Exemplo 1',
      text: 'Livro: Fundamentos de Sistemas Elétricos de Potência - Zanetta - 2006, Exemplo: 6',
      link: '../../assets/download/exemplo-6.zip',
      img: '../../assets/images/exemplos/6.png'
    }, {
      id: 2,
      title: 'Exemplo 2',
      text: 'Livro: Fluxo de carga em redes de energia elétrica - Monticelli - 1983, Exemplo: 7',
      link: '../../assets/download/exemplo-7.zip',
      img: '../../assets/images/exemplos/7.png'
    }, {
      id: 3,
      title: 'Exemplo 3',
      text: 'Livro: Elementos de Análise de Sistemas Elétricos de Potência - Steverson - 1982, Exemplo: 8.1',
      link: '../../assets/download/exemplo-8.zip',
      img: '../../assets/images/exemplos/8.png'
    }, {
      id: 4,
      title: 'Exemplo 4',
      text: 'Livro: Power System Analysis - Grainer e Steverson - 1994, Exemplo: 9.1',
      link: '../../assets/download/exemplo-9.zip',
      img: '../../assets/images/exemplos/9.png'
    }, {
      id: 5,
      title: 'Exemplo 5',
      text: 'Livro: Elementos de Análise de Sistemas Elétricos de Potência - Steverson - 1982, Exemplo 10.12.',
      link: '../../assets/download/exemplo-10.zip',
      img: '../../assets/images/exemplos/10.png'
    }, {
      id: 6,
      title: 'Exemplo 6',
      text: 'Livro: Elementos de Análise de Sistemas Elétricos de Potência - Steverson - 1982, Exemplo 10.14.',
      link: '../../assets/download/exemplo-11.zip',
      img: '../../assets/images/exemplos/11.png'
    }, {
      id: 7,
      title: 'Exemplo 7',
      text: 'Livro: Power System Analysis - Grainer e Steverson - 1994, Exemplo 12.1',
      link: '../../assets/download/exemplo-12.zip',
      img: '../../assets/images/exemplos/12.png'
    }, {
      id: 8,
      title: 'Exemplo 8',
      text: 'Livro: Power System Analysis - Grainer e Steverson - 1994, Exemplo 12.2',
      link: '../../assets/download/exemplo-13.zip',
      img: '../../assets/images/exemplos/13.png'
    }, {
      id: 9,
      title: 'Exemplo 9',
      text: 'Livro: Power System Analysis - Grainer e Steverson - 1994, Exemplo 12.3',
      link: '../../assets/download/exemplo-14.zip',
      img: '../../assets/images/exemplos/14.png'
    }, {
      id: 10,
      title: 'Exemplo 10',
      text: 'Livro: Power System Analysis - Grainer e Steverson - 1994, Exemplos 12.4 e 12.5 ',
      link: '../../assets/download/exemplo-15.zip',
      img: '../../assets/images/exemplos/15.png'
    }
  ];

  ngOnInit() {
  }

}
