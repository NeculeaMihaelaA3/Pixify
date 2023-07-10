import { Component, OnInit, Input, Output, ChangeDetectorRef } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';
import { EventEmitter } from '@angular/core';
import { RefreshService } from '../services/refresh.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  //*ngFor, *ngIf ... ngTemplate randare pe o anumita conditie, template driven forms:controlat de template html
  //reactiveforms-ascultam evenimente
  public isVisible:boolean = false;  
  public username = "";
  public password = "";
  public errormessage = "Invalid email or password";
  public correct: boolean = false;
  public myList:string[] = ["first", "second", "third", "forth"];

  constructor(private authService: ApiService, private router: Router, private cd: ChangeDetectorRef){
  }

  public setVisible(){
    console.log("uname");
  }
  
  onSubmit(): void{
    this.authService.login(this.username, this.password)
      .subscribe(
        response => { console.log("Logged in!", response); 
                      this.router.navigate(['/editing']);
                    },
        error => {console.error("error logging in: ", error);
                    this.isVisible = true;
                    console.log("nu sunt egale");
                    this.cd.detectChanges(); // Trigger change detection
                  }
    );
  }

  routingFunction(){
    this.router.navigate(['/editing']);
    console.log("intra aici");
  }

  public BDusername:String = "mihaela@gmail.com";
  public BDpassword:String = "parola";

}
