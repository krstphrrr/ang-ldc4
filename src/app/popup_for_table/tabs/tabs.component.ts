import { Component, OnInit } from '@angular/core';
import { StringService } from 'src/app/services/string.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent implements OnInit {

  constructor(
    private str: StringService
  ) { }

  ngOnInit(): void {
    this.str.retrieveContent().subscribe(res=>{
      console.log(res)
    })
  }

}
