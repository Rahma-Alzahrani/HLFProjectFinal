import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { OperationsService } from 'src/app/services/operations.service';
import { PopupService } from 'src/app/services/popup.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogBoxComponent } from 'src/app/components/dialog-box/dialog-box.component';

@Component({
  selector: 'app-consumer',
  templateUrl: './consumer.component.html',
  styleUrls: ['./consumer.component.scss'],
})
export class ConsumerComponent implements OnInit {
  config: any;
  selectedId: string = '';
  userType: any;
  consumerData: any = [];
  searchText: string = '';

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
    sessionStorage.setItem('uType', 'Consumer');
    this.oprSrv.getConsumerData().subscribe(
      (res) => {
        this.consumerData = res;
        //filtering data
        let data: any = [];
        if (this.consumerData.data.length > 0) {
          this.consumerData.data.filter((item: any, index: any) => {
            if (item.type == 'Consumer') {
              data.push(item);
            }
          });
        }
        this.consumerData = data;
        this.consumerData.forEach((item: any, index: any) => {
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

  searchConsumer() {
    if (this.searchText === '') {
      this.ngOnInit();
    } else {
      this.consumerData = this.consumerData.filter((res: any) => {
        return res.email
          .toLocaleLowerCase()
          .match(this.searchText.toLocaleLowerCase());
      });
    }
  }

  ViewBankDetails(id: any) {
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '450px',
      data: { bankHolderName: id, type: 'bank' },
    });

    dialogRef.afterClosed().subscribe((result) => {
    });
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
