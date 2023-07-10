import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { ApiService } from '../services/api.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  ngOnInit(): void {}

  constructor(
    private api: ApiService,
    private router: Router,
    private http: HttpClient,
    private cd: ChangeDetectorRef
  ) {}

  public usernames: any = undefined;
  //for db
  public name: string = '';
  public username: string = '';
  public email: string = '';
  public number: string = '';
  public password: string = '';
  public confirm: string = '';

  //for error checking
  public visibleName: boolean = false;
  public visibleUsername: boolean = false;
  public visibleEmail: boolean = false;
  public visibleNumber: boolean = false;
  public visiblePassword: boolean = false;
  public visibleConfirmPass: boolean = false;

  //errors
  public errName: string = 'Field is required!';
  public errUsername: string = 'Field is required!';
  public errEmail: string = 'Not a valid email.';
  public errNumber: string = 'Not a valid phone number.';
  public errPassword: string = 'Length at least 8 and at least one digit';
  public errConfirm: string = 'Not the same.';

  //regex
  public expressionEmail: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  public expressionNumber: RegExp =
    /^(\+?\d{1,2}\s?)?(\d{3}|\(\d{3}\))[-.\s]?(\d{3})[-.\s]?(\d{4})$/i;
  //(123) 456-7890, 123-456-7890, 123.456.7890, 1234567890, +1 123-456-7890,
  public expressionPassword: RegExp =
    /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/i;

  itialize() {
    this.visibleName = false;
    this.visibleUsername = false;
    this.visibleEmail = false;
    this.visibleNumber = false;
    this.visiblePassword = false;
    this.visibleConfirmPass = false;
    this.errUsername = 'Error at username';
    this.errEmail = 'Not a valid email.';
    this.errNumber = 'Not a valid phone number.';
    this.errPassword = 'Minimum 8 with uppercase characters and 1 digit.';
    this.errConfirm = 'Not the same.';
  }

  //after pressing the register button
  onRegister() {
    this.itialize();
    let ok: boolean = true;

    if (this.name.length === 0) {
      this.errName = 'Field is required!';
      this.visibleName = true;
      ok = false;
    }

    if (this.username.length === 0) {
      this.errUsername = 'Field is required!';
      this.visibleUsername = true;
      ok = false;
    }

    if (this.email.length === 0) {
      this.errEmail = 'Field is required!';
      this.visibleEmail = true;
      ok = false;
    } else if (this.expressionEmail.test(this.email) == false) {
      this.visibleEmail = true;
      ok = false;
    }

    if (this.number.length === 0) {
      this.errNumber = 'Field is required!';
      this.visibleNumber = true;
      ok = false;
    } else if (this.expressionNumber.test(this.number) == false) {
      this.visibleNumber = true;
      ok = false;
    }

    if (this.password.length === 0) {
      this.errPassword = 'Field is required!';
      this.visiblePassword = true;
      ok = false;
    } else if (this.expressionPassword.test(this.password) == false) {
      this.visiblePassword = true;
      ok = false;
    }

    if (this.confirm.length === 0) {
      this.errConfirm = 'Field is required!';
      this.visibleConfirmPass = true;
      ok = false;
    } else if (this.password != this.confirm) {
      this.visibleConfirmPass = true;
      ok = false;
    }
    
    console.log(ok, "la inceput");
    this.http.get('http://localhost:5000/get_usernames').subscribe(
      (response) => {
        this.usernames = response;
        this.cd.detectChanges();
        let ok_username: boolean = true;
        for (let i = 0; i < this.usernames.length; i++) {
          if(this.usernames[i] == this.username){
            ok_username = false;
            this.cd.detectChanges();
          }
        }
        this.handleValidationResult(ok, ok_username);
      },
      (error) => {
        console.log(error);
      }
    );

    // if (ok == true) {
    //   console.log('all good');
    //   var newUser: User = {
    //     name: this.name,
    //     username: this.username,
    //     email: this.email,
    //     number: this.number,
    //     password: this.password,
    //   };

    //  // calling the endpoint
    //   this.api.createUser(newUser).subscribe(
    //     (response) => {
    //       console.log('Response from Flask:', response);
    //       this.router.navigate(['/login']);
    //     },
    //     (error) => {
    //       console.log(error);
    //     }
    //   );
    // }
  }

  handleValidationResult(ok: boolean, ok_username: boolean) {
    console.log(ok, "din functie");
    if (ok == true && ok_username == true) {
      console.log('all good');
      var newUser: User = {
        name: this.name,
        username: this.username,
        email: this.email,
        number: this.number,
        password: this.password,
      };

      //calling the endpoint
      this.api.createUser(newUser).subscribe(
        (response) => {
          console.log('Response from Flask:', response);
          this.router.navigate(['/login']);
        },
        (error) => {
          console.log(error);
        }
      );
    }
    else if(ok_username == false){
      this.errUsername = "Username is already in use!";
      this.visibleUsername = true;
      this.cd.detectChanges();
    }
  }

}
