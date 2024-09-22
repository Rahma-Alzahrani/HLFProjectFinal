import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { PopupService } from 'src/app/services/popup.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  cus = false;
  userType: string = 'Provider';
  public signupform: FormGroup;

  constructor(
    private authSrv: AuthService,
    private fBuilder: FormBuilder,
    private router: Router,
    private popSrv: PopupService
  ) {
    this.signupform = this.fBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: [''],
      orgname: ['', Validators.required],
      bankname: ['', Validators.required],
      bankaccountnumber: ['', Validators.required],
      bankaccountholdername: ['', Validators.required],
      bankaccountifsc: ['', Validators.required],
    });
  }

  // ConfirmedValidator(controlName: string, matchingControlName: string) {
  //   return (formGroup: FormGroup) => {
  //     const control = formGroup.controls[controlName];
  //     const matchingControl = formGroup.controls[matchingControlName];
  //     if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
  //       return;
  //     }
  //     if (control.value !== matchingControl.value) {
  //       matchingControl.setErrors({ confirmedValidator: true });
  //     } else {
  //       matchingControl.setErrors(null);
  //     }
  //   }
  // }

  ngOnInit(): void {}

  toggleCus(login_type: string) {
    this.userType = login_type;
    if (login_type === 'Provider') {
      this.cus = false;
    } else {
      this.cus = true;
    }
  }

  signUp() {
    // const data = {
    //   email: this.signupform.controls.email.value,
    //   password: this.signupform.controls.password.value,
    //   confirmPassword: this.signupform.controls.password.value,
    //   type: this.userType,
    //   orgname: this.signupform.controls.orgname.value
    // }

    const data = {
      bankname: this.signupform.controls.bankname.value,
      bankaccountnumber: this.signupform.controls.bankaccountnumber.value,
      bankaccountholdername:
        this.signupform.controls.bankaccountholdername.value,
      bankaccountifsc: this.signupform.controls.bankaccountifsc.value,
      email: this.signupform.controls.email.value,
      password: this.signupform.controls.password.value,
      confirmPassword: this.signupform.controls.password.value,
      type: this.userType,
      orgname: this.signupform.controls.orgname.value,
    };

    console.log(data);

    this.authSrv.uSignup(data).subscribe(
      (res) => {
        if (res.success) {
          this.popSrv.showSuccess(`${res.message}`);
          this.router.navigateByUrl('/auth/login');
        } else {
        }
      },
      (error: HttpErrorResponse) => {
        this.popSrv.showError(error.error.errors.message);
      }
    );

    // this.authSrv.uSignup(data).subscribe(res => {
    //   if (res.success) {
    //     this.popSrv.showSuccess(`${res.message}`);
    //     this.router.navigateByUrl('/auth/login');
    //   } else {
    //   }
    // }, (error: HttpErrorResponse) => {
    //   this.popSrv.showError(error.error.errors.message);
    // });
  }
}
