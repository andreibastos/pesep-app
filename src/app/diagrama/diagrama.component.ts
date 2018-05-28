import { Component, OnInit } from '@angular/core';
import * as Raphael from 'raphael';
import * as $ from 'jquery';
@Component({
  selector: 'app-diagrama',
  templateUrl: './diagrama.component.html',
  styleUrls: ['./diagrama.component.css']
})
export class DiagramaComponent implements OnInit {

  paper: any;

  constructor() { }

  ngOnInit() {
    const y = $('#draw_inside').height();
    const x = $('#draw_inside').width();
    console.log(x, y);

    this.paper = Raphael(document.getElementById('canvas_container'), x, y);
    const circle = this.paper.circle(100, 100, 80);
    for (let i = 0; i < 10; i++) {
      const multiplier = i * 5;
      this.paper.circle(250 + (2 * multiplier), 100 + multiplier, 50 - multiplier);
    }

  }



}
