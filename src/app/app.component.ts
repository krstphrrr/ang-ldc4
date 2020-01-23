import { Component } from '@angular/core';
// import { MaplogService } from './map/maplog.service'
// import { PanelComponent } from './map/controls/panel/panel/panel.component'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
  // providers: [MaplogService]
})
export class AppComponent {
  loadedFeature = 'map';

  // constructor(private loggingService: MaplogService){}
  


  onNavigate(feature:string){
    // this.loggingService.logStatusChange(feature)

    this.loadedFeature = feature
  }
}
