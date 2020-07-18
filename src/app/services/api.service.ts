import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  ping$(): Observable<any> {
    return this.http.get('http://localhost:5010/apiv1/altwoody')
  }
  ugh(){
    console.log(this.http.get('STRING'))
  }
}
