import { AuthService } from '../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { PopupService } from 'src/app/services/popup.service';

@Component({
  selector: 'app-forget',
  templateUrl: './forget.component.html',
  styleUrls: ['./forget.component.scss']
})
export class ForgetComponent implements OnInit {

  cus = false;
  public forgetform: FormGroup;

  constructor(
    private authSrv: AuthService,
    private fBuilder: FormBuilder,
    private router: Router,
    private popSrv: PopupService
  ) {
    this.forgetform = this.fBuilder.group({
      email: ['', Validators.required],
      // password: ['', Validators.required],
    });
  }

 

  ngOnInit(): void {
  }


  forget() {
    const data = {
      email: this.forgetform.controls.email.value,
      orgname: "Org1"
    }
    this.authSrv.forget(data).subscribe(res => {
      if (res.success) {
        this.popSrv.showSuccess(`${res.message}`);
        this.router.navigateByUrl('/auth/login');
      } else {
      }
    }, (error: HttpErrorResponse) => {
      this.popSrv.showError(error.error.errors.message);
    });
  }

}
