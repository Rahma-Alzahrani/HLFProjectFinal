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
import { MatDialog } from '@angular/material/dialog';
import { DialogBoxComponent } from 'src/app/components/dialog-box/dialog-box.component';
import * as moment from 'moment';

@Component({
  selector: 'app-historical-offers',
  templateUrl: './historical-offers.component.html',
  styleUrls: ['./historical-offers.component.scss'],
})
export class HistoricalOffersComponent implements OnInit {
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
    private router: Router,
    public dialog: MatDialog
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
    this.oprSrv.getHistoricalOffers().subscribe(
      (res) => {
        if (res == null) {
          this.offersData.length = 0;
        } else {
          const response: any = res;
          response.filter((item: any) => {
            item.start_date = moment
              .utc(item.start_date)
              .local()
              .format('DD/MM/YYYY HH:mm');
            item.end_date = moment
              .utc(item.end_date)
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

  openDialog(offerID: string) {
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '350px',
      data: { offerID: offerID, type: 'offer' },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
}
