import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

// import { PanelComponent } from './map/controls/panel/panel/panel.component'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: []
})

export class AppComponent {


  constructor(
    private titleService: Title
  ){
    this.setTitle("Landscape Data Commons")
  }
  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

 
  
}
