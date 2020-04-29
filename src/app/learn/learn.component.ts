import { Component, OnInit } from '@angular/core';
import { socketDataService } from '../services/socketTest.service'
import * as d3 from 'd3'

@Component({
  selector: 'app-learn',
  templateUrl: './learn.component.html',
  styleUrls: ['./learn.component.css']
})
export class LearnComponent implements OnInit {
  message:string
  circle:any[] = [10,20,30,40,50]

  constructor(private socket:socketDataService) { }

  ngOnInit(){
    //connect to socket, listen to event
    this.socket.listen('test event').subscribe((data)=>{
      console.log(data)      
    })
  
  }


  sndMessage(){
    
    this.socket.emit('test3',this.message)
    this.message=''
  }


}
