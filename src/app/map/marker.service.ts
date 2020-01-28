import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { throwError as ObservableThrowError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
// import {}

@Injectable({
  providedIn: 'root'
})
export class MarkerService {
  //marker array to inject anywhere
  public markers: {lat: number, long: number}[];  


  constructor(
    private http: HttpClient
  )


  {
    // some map markers
    // ultimately will be pulled from http/api
    this.markers = [
      { lat: 32.117475, long: -106.982117   },
      { lat: 32.424022, long: -107.440796 },
      { lat: 33.568861 , long: -107.677002 },
      { lat: 32.405473, long: -106.369629 },
      { lat: 32.008076, long: -106.869507 },
      { lat: 32.308027, long: -106.688232 }
    ];
  
  }
  getPoints$():any{
    // needs proper model!!  ugh 153 fields
  }



}
