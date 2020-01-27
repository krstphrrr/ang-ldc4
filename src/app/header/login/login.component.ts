import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Input() error: string | null;
  @Output() submitEM = new EventEmitter<void>()

  form: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  })
  submit(){
    if(this.form.valid){
      this.submitEM.emit(this.form.value)
    }
  }

  constructor(
    ) { }

  ngOnInit() {
  }



}
