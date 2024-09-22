import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { OperationsService } from 'src/app/services/operations.service';
import { PopupService } from 'src/app/services/popup.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogBoxComponent } from 'src/app/components/dialog-box/dialog-box.component';

@Component({
  selector: 'app-provider',
  templateUrl: './provider.component.html',
  styleUrls: ['./provider.component.scss'],
})
export class ProviderComponent implements OnInit {
  config: any;
  selectedId: string = '';
  userType: any;
  providerData: any = [];
  searchText: string = '';
  bankDetails: any = [];

  constructor(
    private oprSrv: OperationsService,
    private popSrv: PopupService,
    public dialog: MatDialog
  ) {
    this.config = {
      currentPage: 1,
      itemsPerPage: 10,
    };
    this.userType = sessionStorage.getItem('uType');
  }

  ngOnInit(): void {
    sessionStorage.setItem('uType', 'Provider');
    this.oprSrv.getProviderData().subscribe(
      (res) => {
        this.providerData = res;
        //filtering data
        let data: any = [];
        if (this.providerData.data.length > 0) {
          this.providerData.data.filter((item: any, index: any) => {
            if (item.type == 'Provider') {
              data.push(item);
            }
          });
        }
        this.providerData = data;
        this.providerData.forEach((item: any, index: any) => {
          item.id = index + 1;
          item.updatedAt = new Date(item.updatedAt).toLocaleDateString();
        });
      },
      (error: HttpErrorResponse) => {
        this.popSrv.showError(error.error.errors.message);
      }
    );
  }
  claimDisabled: boolean = false;

  ViewBankDetails(id: any) {
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '450px',
      data: { bankHolderName: id, type: 'bank' },
    });

    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  searchProvider() {
    if (this.searchText === '') {
      this.ngOnInit();
    } else {
      this.providerData = this.providerData.filter((res: any) => {
        return res.email
          .toLocaleLowerCase()
          .match(this.searchText.toLocaleLowerCase());
      });
    }
  }

  format(date: string, format: string): string {
    var dt = new Date(date);

    dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());
    return formatDate(dt, format, 'en-GB');
  }

  refresh(): void {
    window.location.reload();
  }
}
function Inject(DOCUMENT: any) {
  throw new Error('Function not implemented.');
}
