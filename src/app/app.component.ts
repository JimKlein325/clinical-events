import { Component, OnInit } from '@angular/core';
import { TimelineService } from "./timeline.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private service: TimelineService){}

  ngOnInit(): void {
    //this.service.loadEvents();
  }
  title = 'Clinical Events';

  
}
