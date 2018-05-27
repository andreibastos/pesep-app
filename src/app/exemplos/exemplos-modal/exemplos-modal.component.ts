import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-exemplos-modal',
  templateUrl: './exemplos-modal.component.html',
  styleUrls: ['./exemplos-modal.component.css']
})
export class ExemplosModalComponent implements OnInit {

  id = 5;
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    
  }

}
