import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { PopupService } from './../../services/popup.service';
import { OperationsService } from './../../services/operations.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-claim-management',
  templateUrl: './claim-management.component.html',
  styleUrls: ['./claim-management.component.scss'],
})
export class ClaimManagementComponent implements OnInit {
  public claimForm: FormGroup;
  current_Date = new Date();
  claimData: any = [];
  hours: any = [];
  minutes: any = [];
  time: string = '';

  constructor(
    private fBuilder: FormBuilder,
    private router: Router,
    private oprSrv: OperationsService,
    private popSrv: PopupService
  ) {
    this.claimForm = this.fBuilder.group({
      hours: ['', Validators.required],
      minutes: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    //get claim data
    this.oprSrv.getClaimeData().subscribe(
      (res) => {
        const h1: string =
          res.claimPeriodHours < 10
            ? '0' + res.claimPeriodHours
            : `${res.claimPeriodHours}`;
        const m1: string =
          res.claimPeriodMinutes < 10
            ? '0' + res.claimPeriodMinutes
            : `${res.claimPeriodMinutes}`;
        this.time = `${h1} : ${m1} : 00`;
      },
      (error: HttpErrorResponse) => {
        this.popSrv.showError(error.statusText);
      }
    );
  }

  submitclaim() {
    if (this.claimForm.valid) {
      const data = {
        claimPeriodHours: this.claimForm.value.hours,
        claimPeriodMinutes: this.claimForm.value.minutes,
      };

      this.oprSrv.addclaim(data).subscribe(
        (res) => {
          this.popSrv.showSuccess('Claim Time Period Added Successfully');
          //get claim data
          this.oprSrv.getClaimeData().subscribe(
            (res) => {
              const h1: string =
                res.claimPeriodHours < 10
                  ? '0' + res.claimPeriodHours
                  : `${res.claimPeriodHours}`;
              const m1: string =
                res.claimPeriodMinutes < 10
                  ? '0' + res.claimPeriodMinutes
                  : `${res.claimPeriodMinutes}`;
              this.time = `${h1} : ${m1} : 00`;
            },
            (error: HttpErrorResponse) => {
              this.popSrv.showError(error.statusText);
            }
          );
        },
        (error: HttpErrorResponse) => {
          this.popSrv.showError(error.statusText);
        }
      );
    } else {
      this.popSrv.showError('Please fill all the required fields');
    }
  }
}
