import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopupService } from 'src/app/services/popup.service';
import { OperationsService } from './../../services/operations.service';

@Component({
  selector: 'app-historical-requests',
  templateUrl: './historical-requests.component.html',
  styleUrls: ['./historical-requests.component.scss']
})
export class HistoricalRequestsComponent implements OnInit {
  allRequests: any = [];
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
    this.oprSrv.getAllHistoricalRequests().subscribe(res => {
      if (res == null) {
        this.allRequests.length = 0;
      } else {
        this.allRequests = res;
      }
    }, (error: HttpErrorResponse) => {
      this.popSrv.showError(error.statusText);
    });

    this.router.routerState.root.queryParams.subscribe(params => {
      console.log(params, 'paramsssssssssssssssssssss');
      if(params.isAccepted == 'true'){
        //post data to backend submitOfferPayment method
        this.oprSrv.onSubmitHistoricalAcceptRejectRequest(params).subscribe(res => {
          console.log(res);
          this.popSrv.showSuccess('Payment Successful');
          // this.router.navigate(['/home/historical-requests']);
          window.location.reload();

        }
        );
      }
    }
    );


  }


  onAcceptReject(offerID: string, offerReqID: string, isAccept: boolean) {
    const data = { "offerID": offerID, "offerRequestID": offerReqID, "isAccepted": isAccept }
    isAccept ? this.popSrv.showSuccess('Request Accepted') : this.popSrv.showSuccess('Request Rejected')
    if(isAccept){
    this.oprSrv.onAcceptRejectHistoricalRequest(data).subscribe(res => {
      // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      //   this.router.navigate(['/home/requests']);
      // });
      console.log("Response",res);
      if (res.status === 'open') {
        // const url = 'https://payment.' + res.sdkResponse.body.partialRedirectUrl;
        const url = res._links.checkout.href;

        //open url in same page
        window.open(url, '_self');

        console.log("URL",url);
      }
    }, (error: HttpErrorResponse) => {
      this.popSrv.showError(error.statusText);
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
