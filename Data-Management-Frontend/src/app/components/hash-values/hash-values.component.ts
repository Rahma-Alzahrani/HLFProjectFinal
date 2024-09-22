import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { OperationsService } from 'src/app/services/operations.service';
import { PopupService } from 'src/app/services/popup.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hash-values',
  templateUrl: './hash-values.component.html',
  styleUrls: ['./hash-values.component.scss']
})
export class HashValuesComponent implements OnInit {
  allAgreements: any = [];
  config: any;
  selectedId: string = '';
  userType: any;
  offersData: any = [];
  isLoading: boolean = false;
  hashedData: any = [];
  isHistorical: boolean = false;
  check: boolean = false;
  checkHistorical: boolean = false;
  constructor(
    private oprSrv: OperationsService,
    private popSrv: PopupService
  ) {
    this.config = {
      currentPage: 1,
      itemsPerPage: 10
    }
    this.userType = sessionStorage.getItem('uType');
  }

  ngOnInit(): void {
    this.oprSrv.getOffers().subscribe(res => {
      if (res == null) {
        this.offersData.length = 0;
      } else {
        this.offersData = res;
      }
    }, (error: HttpErrorResponse) => {
      this.popSrv.showError(error.error.errors.message);
    });
    this.oprSrv.getAllAgreements().subscribe(res => {
      this.allAgreements = res;
    }, (error: HttpErrorResponse) => {
      this.popSrv.showError(error.error.errors.message);
    });
  }
  claimDisabled: boolean = false;
  getHashDatabyAgreementId() {
    this.isLoading = true;
    let agreement = this.allAgreements?.find((item: any) => item.id === this.selectedId);
    console.log(agreement,"agreement");
    this.checkHistorical = agreement?.offer_id.includes("H_OFFER");
    console.log(this.checkHistorical,"checkHistorical");
    this.claimDisabled = agreement?.state
    const data = this.userType == 'Provider' ? {
      offer_id: this.selectedId
    } : {
      agreement_id: this.selectedId
    }
    this.oprSrv.getDataHashByOfferId(data, this.userType == 'Provider' ? 'GetDataHashByOffer' : 'GetDataHashByAgreementID').subscribe(res => {
      if (res == null) {
        this.hashedData.length = 0
      } else {
        console.log(res,"respo");
        if(res.message){
          this.check = true;
          this.popSrv.showError(res.message);
          this.isLoading = false;
        }
        else{
        this.hashedData = res;
        this.isLoading = false;
        if(res.length == 0){
          this.popSrv.showError("NO HASH FOUND");
        }
        else{
        this.popSrv.showSuccess("SUCCESSFULLY FETCHED HASHED DATA");
        }
        }
      }
    }, (error: HttpErrorResponse) => {
      // console.log(error);
      this.popSrv.showError("NO HASH FOUND");
      this.isLoading = false;
    });
  }

  toggleMenubar(key:string) {
    this.isHistorical = !this.isHistorical;
    console.log(this.isHistorical);
    if(key == 'offer'){
      // this.oprSrv.getOffers().subscribe(res => {
      //   if (res == null) {
      //     this.allRequests.length = 0;
      //   } else {
      //     this.allRequests = res;
      //     console.log(this.allRequests);
      //   }
      // }, (error: HttpErrorResponse) => {
      //   this.popSrv.showError(error.statusText);
      // });
      // const hash = this.oprSrv.generate_HASH_ID();
      // this.newHashForm.controls.hash_id.setValue(hash);
    }
    else{
    //   this.oprSrv.getHistoricalOffers().subscribe(res => {
    //     if (res == null) {
    //       this.allHistoricalRequests.length = 0;
    //     } else {
    //       this.allHistoricalRequests = res;
    //       console.log(this.allHistoricalRequests);

    //     }
    //   }, (error: HttpErrorResponse) => {
    //     this.popSrv.showError(error.statusText);
    //   });
    //   const hash = this.oprSrv.generate_HASH_ID();
    //   this.newHashForm.controls.hash_id.setValue(hash);
    }

  }
  missingClaim() {
    // let agreement = this.allAgreements.find((item: any) => item.id === this.selectedId);

    // let payload = {
    //   "offerId": agreement?.offer_id,
    //   "agreementId": this.selectedId
    // };

    let agreement = this.allAgreements.find((item: any) => item.id === this.selectedId);
    let fileNames = this.hashedData.map((item: any) => item.file_name);
    let payload = {
      "offerId": agreement?.offer_id,
      "fileName": fileNames,
      "agreementId": this.selectedId
    };
    console.log(payload);

    this.oprSrv.missingClaim(payload).subscribe((resp: any) => {
      console.log(resp);
      this.popSrv.showSuccess(resp["message"])
      this.refresh();
    });
  }



  downloadFile(file_name: string, hash: string) {
    let data = {
      file_name, hash
    }
    this.oprSrv.downloadFile(data).toPromise().then(resp => {
      console.log(resp)
      if (resp.progress == 100 && resp.content == null) this.popSrv.showError("File has been tempered")
    }).catch(error => {
      this.popSrv.showError("File has been tempered")
    })

  }

  format(date: string, format: string): string {
    var dt = new Date(date)

    dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset())
    return formatDate(dt, format, 'en-GB');
  }

  latencyClaim() {
    let agreement = this.allAgreements.find((item: any) => item.id === this.selectedId);

    let payload = {
      "offerId": agreement?.offer_id,
      "agreementId": this.selectedId
    };

    this.oprSrv.latencyClaim(payload).subscribe((resp: any) => {
      console.log(resp);
      this.popSrv.showSuccess(resp["message"])
      this.refresh();
    });
  }

  falsifyClaim() {
    let agreement = this.allAgreements.find((item: any) => item.id === this.selectedId);
    let fileNames = this.hashedData.map((item: any) => item.file_name);
    let payload = {
      "offerId": agreement?.offer_id,
      "fileName": fileNames,
      "agreementId": this.selectedId
    };
    this.oprSrv.falsifyClaim(payload).subscribe((resp: any) => {
      console.log(resp);
      this.popSrv.showSuccess(resp["message"])
      this.refresh()
    });
   
  }



  refresh(): void {
    window.location.reload();
  }

}
function Inject(DOCUMENT: any) {
  throw new Error('Function not implemented.');
}

