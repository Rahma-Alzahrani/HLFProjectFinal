import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { loginResponse } from './../models/login';
import { signupResponse } from './../models/signup';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = environment.baseUrl;

  constructor(
    private http: HttpClient
  ) { }

  uLogin(data: any) {
    const serviceName = '/api/v1/auth/login';
    const apiUrl = `${this.baseUrl}${serviceName}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post<loginResponse>(apiUrl, data, httpOptions);
  }

  uSignup(data: any) {
    const serviceName = '/api/v1/auth/signup';
    const apiUrl = `${this.baseUrl}${serviceName}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post<signupResponse>(apiUrl, data, httpOptions);
  }

}
