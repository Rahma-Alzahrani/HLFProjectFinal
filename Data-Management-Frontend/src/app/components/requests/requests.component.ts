import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopupService } from 'src/app/services/popup.service';
import { OperationsService } from './../../services/operations.service';
import * as moment from 'moment';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit {

  allRequests: any = [];
  isLoading: boolean = false;
  config: any;
  constructor(
    private oprSrv: OperationsService,
    private router: Router,
    private popSrv: PopupService
  ) {
    this.config = {
      currentPage: 1,
      itemsPerPage: 10
    }
  }

  ngOnInit(): void {
    this.oprSrv.getAllRequests().subscribe(res => {
      if (res == null) {
        this.allRequests.length = 0;
      } else {
        console.log("Response",res);
        res.filter((item: any) => {
          // item.Record.arrival_time = moment.utc(item.Record.arrival_time).local().format('DD/MM/YYYY HH:mm')

          item.startDate = moment.utc(item.startDate).local().format('DD/MM/YYYY HH:mm')
          item.endDate = moment.utc(item.endDate).local().format('DD/MM/YYYY HH:mm')
        })


        this.allRequests = res;

      }
    }, (error: HttpErrorResponse) => {
      this.popSrv.showError(error.statusText);
    });

    this.router.routerState.root.queryParams.subscribe(params => {
      console.log(params, 'paramsssssssssssssssssssss');
      if(params.isAccepted == 'true'){
        //post data to backend submitOfferPayment method
        this.oprSrv.onSubmitAcceptRejectRequest(params).subscribe(res => {
          console.log(res);
          this.popSrv.showSuccess('Payment Successful');
          // this.router.navigate(['/home/requests']);
          window.location.reload();

        }
        );
      }
    }
    );


  }


  onAcceptReject(offerID: string, offerReqID: string, isAccept: boolean) {
    this.isLoading = true;
    const data = { "offerID": offerID, "offerRequestID": offerReqID, "isAccepted": isAccept }
    isAccept ? this.popSrv.showSuccess('Request Accepted') : this.popSrv.showSuccess('Request Rejected')
    if(isAccept){
    this.oprSrv.onAcceptRejectRequest(data).subscribe(res => {
      // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      //   this.router.navigate(['/home/requests']);
      // });
      console.log("Response",res);
      if (res.status === 'open') {
        // const url = 'https://payment.' + res.sdkResponse.body.partialRedirectUrl;
        const url = res._links.checkout.href;

        this.isLoading = false;

        //open url in same page
        window.open(url, '_self');

        console.log("URL",url);
      }
    }, (error: HttpErrorResponse) => {
      console.log("Errorsssssss",error);
      this.popSrv.showError(error.error.errors.message);
      this.isLoading = false;
    });
  }
    else{
      this.oprSrv.onAcceptRejectRequest(data).subscribe(res => {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/home/requests']);
        });
      }, (error: HttpErrorResponse) => {
        this.popSrv.showError(error.statusText);
      }
      );
    }

  }

  // onAcceptReject(offerID: string, offerReqID: string, isAccept: boolean) {
  //   const data = { "offerID": offerID, "offerRequestID": offerReqID, "isAccepted": isAccept }
  //   isAccept ? this.popSrv.showSuccess('Request Accepted') : this.popSrv.showSuccess('Request Rejected')
  //   this.oprSrv.onAcceptRejectRequest(data).subscribe(res => {
  //     this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
  //       this.router.navigate(['/home/requests']);
  //     });
  //   }, (error: HttpErrorResponse) => {
  //     this.popSrv.showError(error.statusText);
  //   });
  // }

  format(date: string, format: string): string {
    var dt = new Date(date)

    dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset())
    return formatDate(dt, format, 'en-GB');
  }

}
