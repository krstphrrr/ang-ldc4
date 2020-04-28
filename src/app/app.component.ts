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
    setTimeout(
      () => this.spinner.show(), 2000
    )
    setTimeout(
      () => this.spinner.show(), 2500
    )

    setTimeout(
      () => this.spinner.hide(), 3000
    )
    setTimeout(
      () => this.spinner.hide(), 3500
    )

    setTimeout(
      () => {
        this.spinner.show();
        this.spinner.show();
        this.spinner.show();
        this.spinner.show();
      }, 4000
    )
    setTimeout(
      () => this.spinner.reset(), 5000
    )
  }
 
  
}
