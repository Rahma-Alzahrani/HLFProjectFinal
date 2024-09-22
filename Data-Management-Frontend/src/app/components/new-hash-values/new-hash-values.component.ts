import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OperationsService } from 'src/app/services/operations.service';
import { PopupService } from 'src/app/services/popup.service';
import { UploadDocResponse } from './../../models/uploadDocResponse';

@Component({
  selector: 'app-new-hash-values',
  templateUrl: './new-hash-values.component.html',
  styleUrls: ['./new-hash-values.component.scss']
})
export class NewHashValuesComponent implements OnInit {

  public newHashForm: FormGroup;
  docRes: UploadDocResponse | undefined;
  allRequests: any = [];
  allHistoricalRequests: any = [];
  isClicked: boolean = false;
  fileToUpload: File | any;
  isHistorical: boolean = false;
  // public userFile: FileUploader = new FileUploader({ isHTML5: true, itemAlias: 'file' });
  fileName: string = 'No file choosen ...';
  device_id: string = '';
  constructor(
    private fBuilder: FormBuilder,
    private oprSrv: OperationsService,
    private popSrv: PopupService,
    private router: Router
  ) {
    this.newHashForm = this.fBuilder.group({
      offer_id: ['', Validators.required],
      hash_id: '',
      data_hash: ['', Validators.required],
      doc_file: ''
    });
  }

  ngOnInit(): void {
    if(this.isHistorical == false){
    this.oprSrv.getOffers().subscribe(res => {
      if (res == null) {
        this.allRequests.length = 0;
      } else {
        this.allRequests = res;
      }
    }, (error: HttpErrorResponse) => {
      this.popSrv.showError(error.statusText);
    });
    const hash = this.oprSrv.generate_HASH_ID();
    this.newHashForm.controls.hash_id.setValue(hash);
  }
  }

  toggleMenubar(key:string) {
    this.isHistorical = !this.isHistorical;
    console.log(this.isHistorical);
    if(key == 'offer'){
      this.oprSrv.getOffers().subscribe(res => {
        if (res == null) {
          this.allRequests.length = 0;
        } else {
          this.allRequests = res;
          console.log(this.allRequests);
        }
      }, (error: HttpErrorResponse) => {
        this.popSrv.showError(error.statusText);
      });
      const hash = this.oprSrv.generate_HASH_ID();
      this.newHashForm.controls.hash_id.setValue(hash);
    }
    else{
      this.oprSrv.getHistoricalOffers().subscribe(res => {
        if (res == null) {
          this.allHistoricalRequests.length = 0;
        } else {
          this.allHistoricalRequests = res;
          console.log(this.allHistoricalRequests);

        }
      }, (error: HttpErrorResponse) => {
        this.popSrv.showError(error.statusText);
      });
      const hash = this.oprSrv.generate_HASH_ID();
      this.newHashForm.controls.hash_id.setValue(hash);
    }

  }

  // getFileName(val: any) {
  //   const dd = val.split('fakepath\\');
  //   return dd[1];
  // }

  uploadDoc(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      const formData = new FormData();
      formData.append("file", file, this.fileName);
      this.oprSrv.uploadFile(formData).subscribe(res => {
        this.docRes = res;
        this.newHashForm.controls.data_hash.setValue(res.md5);
      }, (error: HttpErrorResponse) => {
        this.popSrv.showError(error.error.errors.message);
      });
    }
  }

  

  getHashDatabyOfferId = () => {
    
    if(this.newHashForm.controls.offer_id.value == ''){
      this.popSrv.showError("Please select offer");
      return;
    }
    console.log(this.newHashForm.controls.offer_id.value);
    console.log(this.allRequests);
    //match offerId with allRequests
    const offerId = this.newHashForm.controls.offer_id.value;
    const offer = this.allRequests.find((x: any) => x.Key == offerId);
    if (offer) {
      const asset = offer.Record.monitered_asset;
      this.device_id = asset;
     
      console.log(asset);

    this.oprSrv.getHashDatabyAssetId(asset,offerId).subscribe(res => {
      if (res == null) {
        this.popSrv.showError("No data found");
      } else {
        console.log(res);
        this.newHashForm.controls.data_hash.setValue(res.md5);
        this.docRes = res;
      }
    }, (error: HttpErrorResponse) => {
      console.log(error,"sssssssssssssssssss");
      this.popSrv.showError(error.error);
    });
    }
  }


  submitForm() {
    const tDate = Date();
    const data = {
      offer_id: this.newHashForm.controls.offer_id.value,
      hash_id: this.newHashForm.controls.hash_id.value,
      datahash: this.docRes?.md5,
      filename: this.docRes?.filename,
      entrydate: this.oprSrv.formatDate(tDate, 'yyyy-MM-dd HH:mm'),
      device_id: this.device_id
    }
    console.log(data);
    this.oprSrv.setNewHashOffer(data).subscribe(res => {
      if (res.result === '') {
        this.popSrv.showSuccess("Hash value Saved");
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/home/new-hash-value']);
        });
      } else {
        this.popSrv.showError("Something error happens");
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/home/new-hash-value']);
        });
      }
    }, (error: HttpErrorResponse) => {
      this.popSrv.showError(error.error.errors.message);
    });
  }

}
