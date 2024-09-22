import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { PopupService } from './../../../services/popup.service';
import { OperationsService } from './../../../services/operations.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-journey',
  templateUrl: './new-journey.component.html',
  styleUrls: ['./new-journey.component.scss'],
})
export class NewJourneyComponent implements OnInit {
  public journeyForm: FormGroup;
  current_Date = new Date();
  journeyData: any = [];

  constructor(
    private fBuilder: FormBuilder,
    private router: Router,
    private oprSrv: OperationsService,
    private popSrv: PopupService
  ) {
    this.journeyForm = this.fBuilder.group({
      uid: ['', Validators.required],
      type: ['', Validators.required],
      cat: ['', Validators.required],
      journey: ['', Validators.required],
      days: [{ value: '', disabled: true }, Validators.required],
      operator: [null, Validators.required],
      valid_to: ['', Validators.required],
      valid_from: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  onStartDateChange() {}
  onStartDateChange1() {
    var date1 = new Date(this.journeyForm.controls.valid_from.value);
    var date2 = new Date(this.journeyForm.controls.valid_to.value);
    var Difference_In_Time = date2.getTime() - date1.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    this.journeyForm.controls.days.setValue(
      parseInt(Difference_In_Days.toString()) + 1
    );
  }

  submitJourney() {
    if (this.journeyForm.valid) {
      this.journeyData = this.journeyForm.value;
      this.journeyData.valid_from = this.journeyForm.controls.valid_from.value;
      this.journeyData.valid_to = this.journeyForm.controls.valid_to.value;
      this.journeyData.uid = this.journeyForm.controls.uid.value;
      this.journeyData.type = this.journeyForm.controls.type.value;
      this.journeyData.cat = this.journeyForm.controls.cat.value;
      this.journeyData.journey = this.journeyForm.controls.journey.value;
      this.journeyData.days = this.journeyForm.controls.days.value.toString();
      this.journeyData.operator = this.journeyForm.controls.operator.value;
      this.journeyData.valid_from = this.journeyForm.controls.valid_from.value;
      this.journeyData.valid_to = this.journeyForm.controls.valid_to.value;
      this.oprSrv.addJourney(this.journeyData).subscribe(
        (res) => {
          this.popSrv.showSuccess('Journey Added Successfully');
          this.router.navigate(['/admin/journey']);
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
