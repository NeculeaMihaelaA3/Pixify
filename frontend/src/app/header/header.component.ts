import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MatMenuModule} from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { ChangeDetectionStrategy } from '@angular/core';
import { RefreshService } from '../services/refresh.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit{

  public isVisible: boolean = true;
  public selected: string = "";

  constructor(private api: ApiService, private route: Router){
  }

  isUserLogged(){
    return this.api.isAuthenticated();
  }

  ngOnInit(): void {
  }

  onLogout(){
    this.api.logout();
    //sa vedem daca mai e ceva in localsotrage
    const token = localStorage.getItem('secret');
    //console.log(token);
    if (token) {
      console.log("inca e ceva acolo");
    } else {
      // handle the case where the token is null
      console.log("The token is null!!");
    }
  }

  onProfile(){
    const token = localStorage.getItem('secret');
    //console.log(token);
    if (token) {
      console.log("inca e ceva acolo");
      this.route.navigate(['/profile']);
    } else {
      // handle the case where the token is null
      console.log("The token is null!!");
    }
  }

  toHome(){
    this.route.navigate(['/']);
  }

  isUserOnProfile(){
    return (this.route.url === '/profile');
  }
}
