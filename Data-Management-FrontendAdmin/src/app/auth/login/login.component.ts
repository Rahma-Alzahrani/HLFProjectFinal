import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PopupService } from 'src/app/services/popup.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginform: FormGroup;
  constructor(
    private authSrv: AuthService,
    private fBuilder: FormBuilder,
    private router: Router,
    private popSrv: PopupService
  ) {
    this.loginform = this.fBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

  ngOnInit(): void {
  }



  login() {
    const data = {
      email: this.loginform.controls.email.value,
      password: this.loginform.controls.password.value,
      orgname: "Org3"
    }
    this.authSrv.uLogin(data).subscribe(res => {
      if (res.token === null) {
        this.popSrv.showError('Invalid Credentials');
        this.router.navigateByUrl('');
      }
      sessionStorage.setItem('uToken', res.token);
      sessionStorage.setItem('uEmail', res.user.email);

      if (res.token !== '' || res.token !== null || res.token !== undefined) {
        this.popSrv.showSuccess('Login Success');
        this.router.navigateByUrl('/admin/user-management/provider');         
      } 
      else {
        this.popSrv.showError('Something Error happens');
        this.router.navigateByUrl('');
      }
    }, (error: HttpErrorResponse) => {
      this.popSrv.showError(error.error.errors.message);
    });
  }

}
