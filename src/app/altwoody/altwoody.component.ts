import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service'

@Component({
  selector: 'app-altwoody',
  templateUrl: './altwoody.component.html',
  styleUrls: ['./altwoody.component.css']
})
export class AltwoodyComponent implements OnInit {
  responseJson: string;

  constructor(private api:ApiService) { }

  ngOnInit(): void {
  }
  pingApi(){
    // this.api.ping$().subscribe(
    //   res => this.responseJson = res
    // )
  }
  ugh2(){
    // this.api.ugh()
  }

}
