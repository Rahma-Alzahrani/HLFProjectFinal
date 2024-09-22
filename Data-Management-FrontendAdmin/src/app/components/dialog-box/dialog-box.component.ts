import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { PopupService } from 'src/app/services/popup.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { OperationsService } from 'src/app/services/operations.service';




@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.scss']
})
export class DialogBoxComponent implements OnInit {

  providerTransaction: string = '';
  consumerTransaction: string = '';
  transactionStatus: boolean = false;
  transactionData: any = [];
  bankName: string = '';
  bankAccountNumber : string = '';
  bankAccountHolderName: string = '';
  bankAccountIFSC: string = '';


  ngOnInit(): void {
  

  }

  constructor(
    private oprSrv: OperationsService,
    private popSrv: PopupService,
    private router: Router,
    public dialogRef: MatDialogRef<DialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    console.log("data", data);
    this.transactionData = data;

    if(data.type == 'costs') {
    this.oprSrv.getTransactionDetails(this.transactionData.costID).subscribe((res: any) => {
      console.log("restrans", res);
      this.transactionData = res;
    
      this.providerTransaction = this.transactionData.providerTransactionId;
      this.consumerTransaction = this.transactionData.consumerTransactionId;
      this.transactionStatus = this.transactionData.transactionStatus;
    }
    );
  } 
  if(data.type == 'bank') {
  const id = data.bankHolderName;
    this.oprSrv.getBankDetailsById(id).subscribe((res: any) => {
      console.log("resBank", res);
      if (res == null) {
        this.popSrv.showError('No Data Found');
      } else {
      //   {
      //     "_id": "64d1d98416631e3ffad4b9e8",
      //     "bankName": "fdfsdf",
      //     "bankAccountNumber": "sdfsdf",
      //     "bankAccountHolderName": "sdfsdf",
      //     "bankAccountIFSC": "sdfsdf",
      //     "email": "rahul",
      //     "type": "Provider",
      //     "orgname": "Org1",
      //     "__v": 0
      // }
        this.bankName = res.bankName;
        this.bankAccountNumber = res.bankAccountNumber;
        this.bankAccountHolderName = res.bankAccountHolderName;
        this.bankAccountIFSC = res.bankAccountIFSC;
        // this.bankDetails = res;
      }
    }, (error: HttpErrorResponse) => {
      this.popSrv.showError(error.error.errors.message);
    });
  } 

  
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  releaseTransaction(id: any) {
console.log("idAA", id);
const data = {
  "costId" : id.id,
  "providerTransactionId" : this.providerTransaction,
  "consumerTransactionId" : this.consumerTransaction,
  "transactionStatus": true
}

this.oprSrv.createTransaction(data).subscribe((res: any) => {
  this.popSrv.showSuccess('Status Updated Successfully');
  this.router.navigate(['/admin/costs']);
}, (error: HttpErrorResponse) => {
  this.popSrv.showError(error.statusText);
});

    this.dialogRef.close({event:'Released', data: this.data});
  }

  updateReleaseTransaction(id: any) {
    console.log("idAA", id);
    const data = {
      "costId" : id.id,
      "providerTransactionId" : this.providerTransaction,
      "consumerTransactionId" : this.consumerTransaction,
      "transactionStatus": false
    }
    
    this.oprSrv.updateTransaction(id.id, data).subscribe((res: any) => {
      this.popSrv.showSuccess('Status Updated Successfully');
      this.router.navigate(['/admin/costs']);
    }, (error: HttpErrorResponse) => {
      this.popSrv.showError(error.statusText);
    });
    
        this.dialogRef.close({event:'Released', data: this.data});
      }


}
