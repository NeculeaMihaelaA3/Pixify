import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import * as CryptoJS from 'crypto-js';
import { SHA256 } from 'crypto-js';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private cd: ChangeDetectorRef,
    private api: ApiService,
    private router: Router,
    private sanitizer:DomSanitizer
  ) {}

  public id_user: Number = -1;
  public file: File | undefined;
  public imgSrc: SafeUrl = 'assets/img/liberty.jpg';
  public selectedGender: string = '';
  public username: string = '';
  public password: string = '';
  public db_password: string = '';
  public old_password: string = '';
  public confirm: string = '';
  public email: string = '';
  public number: string = '';
  public address: string = '';
  public birthdate: string = ''; //2023-05-05
  public user: Object = {};

  //for error checking
  public visibleName: boolean = false;
  public visibleUsername: boolean = false;
  public visibleEmail: boolean = false;
  public visibleNumber: boolean = false;
  public visiblePassword: boolean = false;
  public visibleOldPassword: boolean = false;
  public visibleConfirmPass: boolean = false;
  public succesfully: boolean = false;

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
  public expressionPassword: RegExp =
    /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/i;

  ngOnInit(): void {
    const token = localStorage.getItem('secret');
    if (token) {
      var obj: Object = jwt_decode(token);
      var id = obj['user_id' as keyof typeof obj];
      this.id_user = Number(id);
      console.log(this.id_user);

      var data = { id: this.id_user };
      this.http.post('http://localhost:5000/getuser', data).subscribe(
        (response) => {
          var user: Object = response;
          this.user = response;
          if (user['username' as keyof typeof user] != null) {
            this.username = String(user['username' as keyof typeof user]);
          }

          if (user['email' as keyof typeof user] != null) {
            this.email = String(user['email' as keyof typeof user]);
          }

          if (user['number' as keyof typeof user] != null) {
            this.number = String(user['number' as keyof typeof user]);
          }

          if (user['address' as keyof typeof user] != null) {
            this.address = String(user['address' as keyof typeof user]);
          }

          if (user['password' as keyof typeof user] != null) {
            this.db_password = String(user['password' as keyof typeof user]);
          }

          if (user['gender' as keyof typeof user] != null) {
            this.selectedGender = String(user['gender' as keyof typeof user]);
          }

          if (user['birthdate' as keyof typeof user] != null) {
            this.birthdate = String(user['birthdate' as keyof typeof user]);
          }

          this.imgSrc = 'assets/img/liberty.jpg';

          console.log('finished constructing init');
          this.cd.detectChanges();
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      console.log('The token is null!!');
    }
  }


  // createImageFromBlob(image: Blob) {
  //   let reader = new FileReader();
  //   reader.addEventListener(
  //     'load',
  //     () => {
  //       // this.imageSrc = reader.result as string;
  //     },
  //     false
  //   );

  //   if (image) {
  //     reader.readAsDataURL(image);
  //   }
  // }

  hasPatientProfilePicture: boolean = false;
  selectedPicture: boolean = false;
  url: string = '';

  onFileSelected(event: any) {
    this.file = <File>event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = () => {
      this.imgSrc = reader.result as string;
      this.cd.detectChanges();
    };
  }

  function(): void {
    const myAbsolutelyNotNullElement =
      window.document.getElementById('my-file')!;
    myAbsolutelyNotNullElement.click();
  }

  hashPassword(password: string): string {
    const hashedPassword = SHA256(password).toString();
    return hashedPassword;
  }

  async saveData() {
    this.cd.detectChanges();

    this.itialize();
    let ok: boolean = true;

    if (this.username.length === 0) {
      this.errUsername = 'Field is required!';
      this.visibleUsername = true;
      ok = false;
    }

    if (this.expressionEmail.test(String(this.email)) == false) {
      this.visibleEmail = true;
      ok = false;
    }

    if (this.number.length === 0) {
      this.errNumber = 'Field is required!';
      this.visibleNumber = true;
      ok = false;
    } else if (this.expressionNumber.test(String(this.number)) == false) {
      this.visibleNumber = true;
      ok = false;
    }

    if (this.expressionPassword.test(String(this.password)) == false && this.password != '') {
      this.visiblePassword = true;
      ok = false;
    }

    if (this.password != this.confirm && this.confirm != '') {
      this.visibleConfirmPass = true;
      ok = false;
    }

    console.log(this.selectedGender);

    console.log(this.old_password == this.db_password);
    if (this.hashPassword(this.old_password) != this.db_password || this.old_password == '') {
      this.visibleOldPassword = true;
      ok = false;
    }

    if(this.hashPassword(this.old_password) == this.db_password && this.password != "" && this.confirm != "" && this.password == this.confirm){
      this.db_password = this.password;
    }
    

    if (ok == true) {
      var newUser: User = {
        username: this.username,
        email: this.email, 
        number: this.number,
        password: this.db_password,
        address: this.address,
        birthdate: this.birthdate,
        gender: this.selectedGender,
        profile: String(this.imgSrc),
      };

      // console.log(newUser.profile);
      // console.log(newUser);

      const token = localStorage.getItem('secret');
      var jwt: String = 'empty';

      if (token) {
        console.log('the token exists! ');
        jwt = token;
      } else {
        console.log('The token is null!!');
      }

      const headerDict = {
        jwt: `Bearer ${jwt}`,
      };

      console.log(typeof headerDict);

      //calling the endpoint
      this.api.saveUserData(newUser, headerDict).subscribe(
        (response) => {
          console.log('Response from Flask:', response);
          const button = document.getElementById('save');
          // Change the button's color
          if (button) {
            button.style.backgroundColor = 'green';
          }
          this.cd.detectChanges();
          // this.router.navigate(['/login']);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  bytesToImageSrc(byteString: string){
    const mimeType = "image/png"; 
    const binary = atob(byteString);
    const bytes: number[] = [];
    for (let i = 0; i < binary.length; i++) {
      bytes.push(binary.charCodeAt(i));
    }
    const blob = new Blob([new Uint8Array(bytes)], { type: mimeType });
    const src = URL.createObjectURL(blob);
    let url = window.URL.createObjectURL(blob);
    const value: SafeUrl = this.sanitizer.bypassSecurityTrustUrl(url);
    return value;
  }

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
}
