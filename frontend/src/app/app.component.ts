import { Component } from '@angular/core';
import { ApiService } from './services/api.service';
import { OnInit  } from '@angular/core';
import { RefreshService } from './services/refresh.service';
import { Router } from '@angular/router';
import {Title} from "@angular/platform-browser";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(private router: Router, private titleService:Title) {
    this.titleService.setTitle("Pixify");
  }

  isHomePage(): boolean {
    return this.router.url === '/';
  }
  
  ngOnInit(){
  }
}
