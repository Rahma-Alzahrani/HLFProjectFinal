import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GetAllOffers } from './../../models/getAllOffers';
import { OperationsService } from './../../services/operations.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PopupService } from 'src/app/services/popup.service';
import { HttpErrorResponse } from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import * as moment from 'moment';





@Component({
  selector: 'app-myhistorical',
  templateUrl: './myhistorical.component.html',
  styleUrls: ['./myhistorical.component.scss']
})
export class MyhistoricalComponent implements OnInit {
  offersData: any = [];
  selectedJourneyId: string = '';
  journeyData: any = [];
  config: any;
  isEdit = false;
  setVal: boolean = true;
  current_Date = new Date();
  user: any = '';
  sensorID: string = '';
  journeyID: string = '';
  sensorData: any = [];
  offerData: any = [];
  offerIDs = new FormControl();
  offerIDList: string[] = [];
  selectedOfferID: string = '';
  isLoading: boolean = false;

  public offerForm: FormGroup;
  constructor(
    private fBuilder: FormBuilder,
    private popSrv: PopupService,
    private oprSrv: OperationsService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.config = {
      currentPage: 1,
      itemsPerPage: 10
    };
    this.offerForm = this.fBuilder.group({
    //   {
    //     "docType": "historicalOffer",
    //     "id": "9",
    //     "validity": true,
    //     "data_owner": "Provider@44.org",
    //     "equipment": "pc11",
    //     "moniteredAsset": "",
    //     "processing_level": "141",
    //     "price": 100.23,
    //     "deposit": 10.23,
    //     "owner_org": "Org1MSP",
    //     "creator": "rahul",
    //     "operator": "op",
    //     "journey_uid": "G44734",
    //     "start_date": "19:00",
    //     "end_date": "20:00"
    // }
      id: [{ value: '', disabled: true }],
      validity: true,
      dataOwner: '',
      equipment: ['', [Validators.required, this.noWhitespaceValidator]],
      monitoredAsset: ['', [Validators.required, this.noWhitespaceValidator]],
      processingLevel: ['', [Validators.required, this.noWhitespaceValidator]],
      price: [null, Validators.required],
      deposit: [null, Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
  }

  sensorDataChange(sensorID: string) {
    // this.sensorID = sensorID;
    // console.log(this.sensorID, 'sensorID');
    // console.log(this.allRequests, 'allRequests');
    // const filter_obj = this.allRequests.filter((res: { Record: any; }) => res.Record.monitered_asset === sensorID);
    // console.log(filter_obj, 'filter_obj');
    // this.journeyData = filter_obj.map((res: { Record: any; }) => res.Record);
    // console.log(this.journeyData, 'journeyData');
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.user = sessionStorage.getItem('uType');
    console.log("user", this.user);
    this.oprSrv.getHistoricalOffers().subscribe(res => {
      console.log("resss",res);
      if (res == null) {
        this.offersData.length = 0;
        this.isLoading = false;
      } else {
        const response: any = res;
        response.filter((item: any) => { 
          console.log("item.valid_from", new Date(item.start_date).toLocaleString())
          // item.valid_from = this.format(item.valid_from, 'dd/MM/yyyy HH:mm:ss')
          // item.valid_to = this.format(item.valid_to, 'dd/MM/yyyy HH:mm:ss')
          item.start_date = moment.utc(item.start_date).local().format('DD/MM/YYYY HH:mm:ss')
          item.end_date = moment.utc(item.end_date).local().format('DD/MM/YYYY HH:mm:ss')
        })
        this.offersData = res;
        this.isLoading = false;
      }
    }, (error: HttpErrorResponse) => {
      this.popSrv.showError(error.error.errors.message);
      this.isLoading = false;
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  onStartDateChange() {
    this.offerForm.controls.endDate.setValue('');
  }

  openDialog(offerID: string) {
    console.log("offerIDsssss", offerID);
    // this.selectedOfferID = offerID;
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '350px',
      data: { offerID: offerID }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
   
  }


  setValidity(validity: boolean) {
    this.setVal = validity;
    this.offerForm.controls.validity.setValue(validity);
  }

  cancelUpdate() {
    this.isEdit = false;
    this.offerForm.controls.id.setValue(''),
      this.offerForm.controls.validity.setValue(false),
      this.offerForm.controls.dataOwner.setValue(''),
      this.offerForm.controls.equipment.setValue(''),
      this.offerForm.controls.monitoredAsset.setValue(''),
      this.offerForm.controls.processingLevel.setValue(''),
      this.offerForm.controls.price.setValue(''),
      this.offerForm.controls.deposit.setValue(''),
      this.offerForm.controls.startDate.setValue(''),
      this.offerForm.controls.endDate.setValue('')
  }

  offerRequest(offerID: string, deposit: number, price: number) {
    console.log("offerID", offerID);
    this.router.navigate(['/home/send-historical-requests'], { queryParams: { offer_id: offerID, deposit: deposit, price: price } });
  }

  updateOffer(rowData: any) {
    console.log("rowData", rowData);
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/home/edit-historical-offer'], { queryParams: { id: rowData.id } });
    });
    // this.isEdit = true;
    // this.setVal = rowData.validity;
    // this.offerForm.patchValue({
    //   id: rowData.id,
    //   validity: rowData.validity,
    //   dataOwner: rowData.data_owner,
    //   equipment: rowData.equipment,
    //   monitoredAsset: rowData.moniteredAsset,
    //   processingLevel: rowData.processing_level,
    //   price: rowData.price,
    //   deposit: rowData.deposit,
    //   startDate: rowData.start_date,
    //   endDate: rowData.end_date
    // });
  }
  journeyDataChange(journeyID: string) {
    console.log("journeyID", journeyID);
  }
  offerDataChange(offerID: any) {
    console.log("offerID", offerID);
  }

  submitOffer() {
    const data = {
      id: this.offerForm.controls.id.value,
      validity: this.offerForm.controls.validity.value,
      data_owner: this.offerForm.controls.dataOwner.value,
      equipment: this.offerForm.controls.equipment.value,
      moniteredAsset: this.offerForm.controls.monitoredAsset.value,
      processing_level: this.offerForm.controls.processingLevel.value,
      price: this.offerForm.controls.price.value,
      deposit: this.offerForm.controls.deposit.value,
      start_date: this.offerForm.controls.startDate.value,
      end_date: this.offerForm.controls.endDate.value
    }
    this.oprSrv.updateHistoricalOffer(data).subscribe(res => {
      if (res.result !== undefined || res.result !== null) {
        this.popSrv.showSuccess('Offer Updated Successfully!');
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/home/my-offers']);
        });
      }
    }, (error: HttpErrorResponse) => {
      this.popSrv.showError(error.error.errors.message);
    });
  }

}
