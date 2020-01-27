import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from './auth.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent {
  @Output() featureSelected = new EventEmitter<string>()
  public isMenuCollapsed = false

  constructor() { }

  onSelect(feature:string){

      this.featureSelected.emit(feature)
  }

}
