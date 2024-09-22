import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PopupService } from 'src/app/services/popup.service';
import { OperationsService } from './../../services/operations.service';
import { FormControl } from '@angular/forms';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-send-historical-requests',
  templateUrl: './send-historical-requests.component.html',
  styleUrls: ['./send-historical-requests.component.scss']
})
export class SendHistoricalRequestsComponent implements OnInit {

  public requestForm: FormGroup;
  current_Date = new Date();
  offersList: any = [];
  filterOffersList: any = [];
  offerData: any = [];
  offerIDs = new FormControl();
  offerIDList: string[] = [];
  selectedOfferID: string = '';
  isLoading: boolean = false;
  constructor(
    private fBuilder: FormBuilder,
    private oprSrv: OperationsService,
    private popSrv: PopupService,
    private actiRoute: ActivatedRoute,
    private router: Router
  ) {
    this.requestForm = this.fBuilder.group({
      offer_id: '',
      // startDate: ['', Validators.required],
      // endDate: ['', Validators.required],
      cDeposit: [{ value: null, disabled: true }],
      price: [{ value: null, disabled: true }],
    });
    this.actiRoute.queryParams.subscribe(res => {
      
      console.log(res,"sssssssssssssssssss",this.filterOffersList);
      if (res.offer_id === undefined || res.offer_id === null) {
      } else {
        this.oprSrv.getAllExistingHistoricalOffer().subscribe(resp => {
          console.log(resp,"aaaaaaaaa");
          this.filterOffersList = this.offersList = resp;
          this.filterOffersList = this.filterOffersList.filter((ress: { id: string; }) => ress.id === res.offer_id);
          console.log(this.filterOffersList,"bbb");

          this.offerData = this.filterOffersList[0].multiple_offer_id;
        this.selectedOfferID = this.filterOffersList[0].multiple_offer_id;
        this.offerIDList = this.filterOffersList[0].multiple_offer_id;
        this.offerIDs.setValue(this.filterOffersList[0].multiple_offer_id);
        });
        this.requestForm.controls.offer_id.setValue(res.offer_id);
        this.requestForm.controls.cDeposit.setValue(parseInt(res.deposit));
        this.requestForm.controls.price.setValue(parseInt(res.price));
        this.requestForm.controls.offer_id.disable();
      }
    })
  }

  ngOnInit(): void {
    this.oprSrv.getAllExistingHistoricalOffer().subscribe(res => {
      this.filterOffersList = this.offersList = res;
      // this.offerData = this.filterOffersList[0].multiple_offer_id;
    // this.selectedOfferID = this.filterOffersList[0].multiple_offer_id;
    // this.offerIDList = this.filterOffersList[0].multiple_offer_id;
    // this.offerIDs.setValue(this.filterOffersList[0].multiple_offer_id);
    });
    this.router.routerState.root.queryParams.subscribe(params => {
      console.log(params, 'paramsssssssssssssssssssss');
      if(params.status == 'true'){
        //post data to backend submitOfferPayment method
        this.oprSrv.submitHistoricalOfferPayment(params).subscribe(res => {
          console.log(res);
          this.popSrv.showSuccess('Payment Successful');
          this.router.navigate(['/home/send-historical-requests']);
          // window.location.reload();

        }
        );
      }
    }
    );
  }

  offerDataChange(offerID: any) {
    console.log(offerID.value, 'offerID');
    //calculate price by multiplying the length of array with price
        this.requestForm.controls.price.setValue(environment.price * offerID.value.length);
        console.log(this.selectedOfferID, this.offerIDList,this.offerIDs,'selectedOfferID');


  }

  onOfferIdChange(offerID: string) {
    const filter_obj = this.filterOffersList.filter((res: { id: string }) => res.id === offerID);
    console.log(filter_obj, 'filter_obj');
    this.requestForm.controls.cDeposit.setValue(filter_obj[0].deposit);
    this.requestForm.controls.price.setValue(filter_obj[0].price);
    this.offerData = filter_obj[0].multiple_offer_id;
    this.selectedOfferID = filter_obj[0].multiple_offer_id;
    this.offerIDList = filter_obj[0].multiple_offer_id;
    this.offerIDs.setValue(filter_obj[0].multiple_offer_id);
    console.log(this.selectedOfferID, this.offerIDList,this.offerIDs,'selectedOfferID');
    console.log(this.offerData, 'offerData');
    // const filter_obj = this.filterOffersList.filter((res: { Record: { id: string; }; }) => res.Record.id === offerID);
    // this.requestForm.controls.cDeposit.setValue(filter_obj[0].Record.deposit);
    // this.requestForm.controls.price.setValue(filter_obj[0].Record.price);
  }

  onStartDateChange() {
    this.requestForm.controls.endDate.setValue('');
  }

  submitRequest() {
    this.isLoading = true;
    const data = {
      offer_id: this.requestForm.controls.offer_id.value,
      price: this.requestForm.controls.price.value,
      cDeposit: this.requestForm.controls.cDeposit.value,
      // startDate: this.oprSrv.formatDate(this.requestForm.controls.startDate.value, 'yyyy-MM-dd HH:mm'),
      // endDate: this.oprSrv.formatDate(this.requestForm.controls.endDate.value, 'yyyy-MM-dd HH:mm'),
      multiple_offer_id: this.offerIDs.value
    }
    console.log(data, 'data');
    this.oprSrv.sendHistoricalRequest(data).subscribe(res => {
      // this.popSrv.showSuccess('New Request Sent Successfully');
      // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      //   this.router.navigate(['/home/send-requests']);
      // });
      // console.log("Response",res);
      if (res.status === 'open') {
        // const url = 'https://payment.' + res.sdkResponse.body.partialRedirectUrl;
        const url = res._links.checkout.href;

        this.isLoading = false;

        //open url in same page
        window.open(url, '_self');

        console.log("URL",url);
      }
      else{
        this.popSrv.showError(res.sdkResponse.errors[0].message);
      }
    });
    
  }

}
