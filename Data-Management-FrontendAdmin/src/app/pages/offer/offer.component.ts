import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { PopupService } from 'src/app/services/popup.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { OperationsService } from './../../services/operations.service';
import * as moment from 'moment';

@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.scss'],
})
export class OfferComponent implements OnInit {
  offersData: any = [];
  config: any;
  isEdit = false;
  searchText: string = '';

  setVal: boolean = true;
  public offerForm: FormGroup;
  constructor(
    private fBuilder: FormBuilder,
    private popSrv: PopupService,
    private oprSrv: OperationsService,
    private router: Router
  ) {
    this.config = {
      currentPage: 1,
      itemsPerPage: 10,
    };
    this.offerForm = this.fBuilder.group({
      id: [{ value: '', disabled: true }],
      validity: true,
      dataOwner: '',
      equipment: ['', [Validators.required, this.noWhitespaceValidator]],
      monitoredAsset: ['', [Validators.required, this.noWhitespaceValidator]],
      processingLevel: ['', [Validators.required, this.noWhitespaceValidator]],
      price: [null, Validators.required],
      deposit: [null, Validators.required],
    });
  }

  searchOffer() {
    if (this.searchText === '') {
      this.ngOnInit();
    } else {
      this.offersData = this.offersData.filter((res: any) => {
        return res.Record.equipment
          .toLocaleLowerCase()
          .match(this.searchText.toLocaleLowerCase());
      });
    }
  }

  ngOnInit(): void {
    sessionStorage.setItem('uType', 'Offers');
    this.oprSrv.getOffers().subscribe(
      (res) => {
        if (res == null) {
          this.offersData.length = 0;
        } else {
          const response: any = res;
          response.filter((item: any) => {
            item.Record.depart_time = moment
              .utc(item.Record.depart_time)
              .local()
              .format('DD/MM/YYYY HH:mm');
            item.Record.arrival_time = moment
              .utc(item.Record.arrival_time)
              .local()
              .format('DD/MM/YYYY HH:mm');
          });
          this.offersData = res;
        }
      },
      (error: HttpErrorResponse) => {
        this.popSrv.showError(error.error.errors.message);
      }
    );
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  setValidity(validity: boolean) {
    this.setVal = validity;
    this.offerForm.controls.validity.setValue(validity);
  }
}
