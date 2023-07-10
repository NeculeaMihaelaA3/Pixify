import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Movie } from '../models/movies';
import { tap } from 'rxjs/operators';
import { User } from '../models/user';

interface LoginResponse {
  access_token: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly rootURL = "http://127.0.0.1:5000";
  private readonly tokenKey = "secret";
  constructor(private http: HttpClient) { }
   
  GetIssues(): Observable<Movie[]> {
    return this.http
      .get<Movie[]>(this.rootURL + '/incomes');
  }

  //login 
  login(username:string, password:string): Observable<LoginResponse>{
     const body = { username, password };
     return this.http.post<LoginResponse>(`${this.rootURL}/login`, body)
      .pipe(
        tap(response => localStorage.setItem(this.tokenKey, response.access_token))
      );
  }

  logout(): void{
    localStorage.removeItem(this.tokenKey);
  }

  getToken(): any | string{
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean{
    const token = this.getToken();
    return token != null;
  }

  //creating an user
  createUser(user: User): Observable<any>{
    return this.http.post(`${this.rootURL}/user`, user);
  }

  saveUserData(user: User, header: any): Observable<any>{
    return this.http.post(`${this.rootURL}/save_user_data`, user, {headers: new HttpHeaders(header)});
  }

}
