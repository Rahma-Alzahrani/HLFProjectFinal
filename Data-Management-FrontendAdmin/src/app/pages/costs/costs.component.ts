import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { OperationsService } from 'src/app/services/operations.service';
import { PopupService } from 'src/app/services/popup.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogBoxComponent } from 'src/app/components/dialog-box/dialog-box.component';

@Component({
  selector: 'app-costs',
  templateUrl: './costs.component.html',
  styleUrls: ['./costs.component.scss'],
})
export class CostsComponent implements OnInit {
  costData: any = [];
  allTransactions: any = [];
  // userType: any;
  config: any;
  options: any = {
    released: true,
    view: false,
  };
  constructor(
    private oprSrv: OperationsService,
    private popSrv: PopupService,
    public dialog: MatDialog
  ) {
    this.config = {
      currentPage: 1,
      itemsPerPage: 10,
    };
  }

  ngOnInit(): void {
    this.oprSrv.getCosts().subscribe((res) => {
      if (res == null) {
        this.costData.length = 0;
      } else {
        res.filter((item: any) => {
          item.createdAt = moment
            .utc(item.createdAt)
            .local()
            .format('YYYY-MM-DD HH:mm');
        });
        this.costData = res;
        if (this.costData.length === 0) {
          this.popSrv.showError('No Data Found');
        } else {
          this.oprSrv.getTransactions().subscribe(
            (res: any) => {
              this.allTransactions = res;

              if (this.allTransactions.length !== 0) {
                this.costData.filter((cost: any) => {
                  this.allTransactions.filter((transaction: any) => {
                    if (cost.id === transaction.costId) {
                      if (transaction.transactionStatus === true) {
                        this.costData[this.costData.indexOf(cost)].released =
                          false;
                        this.costData[this.costData.indexOf(cost)].view = true;
                      }
                    } else {
                      this.costData[this.costData.indexOf(cost)].view = false;
                      this.costData[this.costData.indexOf(cost)].released =
                        true;
                    }
                  });
                });
              } else {
                this.costData.filter((cost: any) => {
                  this.costData[this.costData.indexOf(cost)].released = true;
                  this.costData[this.costData.indexOf(cost)].view = false;
                });
              }
            },
            (error: HttpErrorResponse) => {
              this.popSrv.showError(error.statusText);
            }
          );
        }
      }
    }),
      (error: HttpErrorResponse) => {
        this.popSrv.showError(error.message);
      };
  }

  viewTransactions(id: any) {
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '450px',
      data: { costID: id, type: 'costs' },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  openBankDetails(id: any) {
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '450px',
      data: { bankHolderName: id, type: 'bank' },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  ReleasedModalOpen(id: any) {
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '450px',
      data: { costID: id, type: 'costs' },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
}
