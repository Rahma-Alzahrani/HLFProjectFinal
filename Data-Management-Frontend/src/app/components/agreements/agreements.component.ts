import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { OperationsService } from 'src/app/services/operations.service';
import { PopupService } from 'src/app/services/popup.service';

@Component({
  selector: 'app-agreements',
  templateUrl: './agreements.component.html',
  styleUrls: ['./agreements.component.scss']
})
export class AgreementsComponent implements OnInit {

  allAgreements: any = [];
  config: any;
  userType: any;
  allEscrow: any = []
  constructor(
    private oprSrv: OperationsService,
    private popSrv: PopupService,
    private router: Router
  ) {
    this.config = {
      currentPage: 1,
      itemsPerPage: 10
    }

    this.userType = sessionStorage.getItem('uType');
  }

  ngOnInit(): void {
    this.oprSrv.getAllAgreements().subscribe(res => {
      if (res == null) {
        this.allAgreements.length = 0;
      } else {
        const response: any = res;
        response.filter((item: any) => {
          console.log(moment.utc(item.end_date).local().format('DD/MM/YYYY HH:mm'));
          item.startDate = moment.utc(item.end_date).local().format('DD/MM/YYYY HH:mm')
          item.endDate = moment(item.endDate).format('DD/MM/YYYY HH:mm')
        })
        console.log(response,"filternot")
        this.allAgreements = response;
        
      }
    }, (error: HttpErrorResponse) => {
      this.popSrv.showError(error.error.errors.message);
    });

    this.oprSrv.getAllEscrow().subscribe(res => {
      this.allEscrow = res;
      this.allEscrow = this.allEscrow.filter((item: any) => item.agreement_id);
    }, (error: HttpErrorResponse) => {
      this.popSrv.showError(error.error.errors.message);
    });

  }

  revoke(agrId: string) {
    const data = { 
      agreement_id: agrId,
   
    };
    this.oprSrv.revokeAgreement(data).subscribe(res => {
      if (res.result == '') {
        this.popSrv.showSuccess('Agreement Revoked');
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/home/agreements']);
        });
      } else {
        this.popSrv.showError('Something Failure !');
      }
    }, (error: HttpErrorResponse) => {
      this.popSrv.showError(error.message);
    })
  }

  isAgreementExp(expiryDate: string) {

    if (expiryDate.length == 10) expiryDate += " 00:00"
    console.log(expiryDate)
    const exp = moment(expiryDate, 'YYYY-MM-DD hh:mm');

    const today = moment(new Date(), 'YYYY-MM-DD hh:mm');

    const diffMins = exp.diff(today, 'minutes');
    console.log(diffMins)
    return diffMins < 0 ? true : false;

  }
}
