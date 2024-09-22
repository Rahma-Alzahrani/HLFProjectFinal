import { PopupService } from './../../services/popup.service';
import { OperationsService } from './../../services/operations.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import * as moment from 'moment';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.component.html',
  styleUrls: ['./edit-offer.component.scss'],
})
export class EditOfferComponent implements OnInit {
  public offerForm: FormGroup;
  setVal: boolean = true;
  selectedJourneyId: string = '';
  journeyData: any = [];
  current_Date = new Date();
  journeyID: string = '';
  isClicked: boolean = false;
  uniqueAsset: string = '';
  allRequests: any = [];
  sensorID: string = '';
  sensorData: any = [];

  constructor(
    private fBuilder: FormBuilder,
    private router: Router,
    private oprSrv: OperationsService,
    private popSrv: PopupService
  ) {
    this.offerForm = this.fBuilder.group({
      id: [{ value: '', disabled: true }],
      validity: true,
      dataOwner: [{ value: '', disabled: true }, Validators.required],
      equipment: ['', Validators.required],
      // monitoredAsset: [{ value: '', disabled: true }, Validators.required], // Updated to get value from "monitoredAsset" form control
      monitoredAsset: ['', Validators.required],
      processingLevel: ['', Validators.required],
      price: [null, Validators.required],
      deposit: [null, Validators.required],
      journeyID: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const uName = sessionStorage.getItem('uEmail');
    this.offerForm.controls.dataOwner.setValue(uName);
    this.getJourneyData();
    this.router.routerState.root.queryParams.subscribe((params) => {
      if (params.id) {
        this.oprSrv.getOfferById(params.id).subscribe(
          (res) => {
            if (res == null) {
              this.popSrv.showError('No Data Found');
            } else {
              this.offerForm.controls.id.setValue(res.id);
              this.offerForm.controls.validity.setValue(res.validity);
              this.offerForm.controls.dataOwner.setValue(res.data_owner);
              this.offerForm.controls.equipment.setValue(res.equipment);
              this.offerForm.controls.monitoredAsset.setValue(
                res.monitered_asset
              );
              this.offerForm.controls.processingLevel.setValue(
                res.processing_level
              );
              this.offerForm.controls.price.setValue(res.price);
              this.offerForm.controls.deposit.setValue(res.deposit);
              this.offerForm.controls.journeyID.setValue(res.journey_uid);
              this.offerForm.controls.startDate.setValue(moment.utc(res.depart_time).local().format('YYYY-MM-DDTHH:mm'));
              this.offerForm.controls.endDate.setValue(moment.utc(res.arrival_time).local().format('YYYY-MM-DDTHH:mm'));
              this.isClicked = true;
            }
          },
          (error: HttpErrorResponse) => {
            this.popSrv.showError(error.statusText);
          }
        );

        // this.offerForm.controls.journeyID.disable();
      }
    });
    this.oprSrv.getOffers().subscribe(
      (res) => {
        if (res == null) {
          this.allRequests.length = 0;
        } else {
          this.allRequests = res;
          // store unique monitored assets in an array
          this.allRequests.forEach((element: { Record: any }) => {
            this.sensorData.push(element.Record.monitered_asset);
          });
          this.sensorData = [...new Set(this.sensorData)];
        }
      },
      (error: HttpErrorResponse) => {
        this.popSrv.showError(error.statusText);
      }
    );
  }

  journeyDataChange(journeyID: string) {
    if (journeyID) {
      this.journeyID = journeyID;
      const filter_obj = this.journeyData.filter(
        (res: { uid: string }) => res.uid === journeyID
      );
      // this.isClicked == true ? this.offerForm.controls.monitoredAsset.setValue(filter_obj[0].monitored_asset)
      //   : this.offerForm.controls.monitoredAsset.setValue('');
      // this.offerForm.controls.processingLevel.setValue(filter_obj[0].processing_level);
      // this.offerForm.controls.equipment.setValue(filter_obj[0].equipment);
      // this.offerForm.controls.startDate.setValue(filter_obj[0].start_date);
      // this.offerForm.controls.endDate.setValue(filter_obj[0].end_date);
    }
  }

  setValidity(validity: boolean) {
    this.setVal = validity;
    this.offerForm.controls.validity.setValue(validity);
  }

  getJourneyData() {
    this.oprSrv.getJourneyData().subscribe(
      (res) => {
        if (res == null) {
          this.popSrv.showError('No Data Found');
        } else {
          this.journeyData = res;
        }
      },
      (error: HttpErrorResponse) => {
        this.popSrv.showError(error.error.errors.message);
      }
    );
  }

  onStartDateChange() {
    this.offerForm.controls.endDate.setValue('');
  }

  onUniqueAssetChange() {
    //genrate random string for unique asset
    this.uniqueAsset = this.oprSrv.generate_UUID().substring(0, 8);
    this.offerForm.controls.monitoredAsset.setValue(this.uniqueAsset);
    console.log(this.uniqueAsset);
  }

  getHashDatabyOfferId() {
    this.isClicked = !this.isClicked;
  }

  cancelUpdate() {
    this.offerForm.controls.id.setValue(''),
      this.offerForm.controls.validity.setValue(false),
      this.offerForm.controls.dataOwner.setValue(''),
      this.offerForm.controls.equipment.setValue(''),
      this.offerForm.controls.monitoredAsset.setValue(''),
      this.offerForm.controls.processingLevel.setValue(''),
      this.offerForm.controls.price.setValue(''),
      this.offerForm.controls.deposit.setValue('');
  }

  submitOffer() {
    const data = {
      id: this.offerForm.controls.id.value,
      validity: this.offerForm.controls.validity.value,
      data_owner: this.offerForm.controls.dataOwner.value,
      equipment: this.offerForm.controls.equipment.value,
      monitered_asset: this.offerForm.controls.monitoredAsset.value,
      processing_level: this.offerForm.controls.processingLevel.value,
      price: this.offerForm.controls.price.value,
      deposit: this.offerForm.controls.deposit.value,
      operator: this.offerForm.controls.dataOwner.value,
      journey_uid: this.offerForm.controls.journeyID.value, // Updated to get value from "journeyID" form control
      depart_time: this.oprSrv.formatDate(
        this.offerForm.controls.startDate.value,
        'yyyy-MM-dd HH:mm'
      ),
      arrival_time: this.oprSrv.formatDate(
        this.offerForm.controls.endDate.value,
        'yyyy-MM-dd HH:mm'
      ),
    };

    console.log(data);

    this.oprSrv.updateOffer(data).subscribe(
      (res) => {
        if (res.result !== undefined || res.result !== null) {
          this.popSrv.showSuccess('Offer Updated Successfully!');
          this.router
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() => {
              this.router.navigate(['/home/my-offers']);
            });
        }
      },
      (error: HttpErrorResponse) => {
        this.popSrv.showError(error.error.errors.message);
      }
    );
  }
  // getPath(val: any) {
  //   return val.queue[0] === undefined ? 'No File Chosen' : val.queue[val.queue.length - 1]._file.name;
  // }
}
