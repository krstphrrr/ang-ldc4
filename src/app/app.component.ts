import { Component, OnInit } from '@angular/core';
import { SpinnerService} from '../app/services/spinner.service'

// import { PanelComponent } from './map/controls/panel/panel/panel.component'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: []
})

export class AppComponent implements OnInit {


  constructor(
    private spinner:SpinnerService
  ){}
  ngOnInit(){

  }
 
  
}
