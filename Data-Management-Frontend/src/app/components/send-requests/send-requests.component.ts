import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PopupService } from 'src/app/services/popup.service';
import { OperationsService } from './../../services/operations.service';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-send-requests',
  templateUrl: './send-requests.component.html',
  styleUrls: ['./send-requests.component.scss'],
})
export class SendRequestsComponent implements OnInit {
  public requestForm: FormGroup;
  current_Date = new Date();
  offersList: any = [];
  offerData: any = {};
  filterOffersList: any = [];
  isLoading: boolean = false;
  hideAction: boolean = false;
  isActive: boolean = false;
  requestTime: number = environment.requestTime;
  constructor(
    private fBuilder: FormBuilder,
    private oprSrv: OperationsService,
    private popSrv: PopupService,
    private actiRoute: ActivatedRoute,
    private router: Router
  ) {
    this.requestForm = this.fBuilder.group({
      offer_id: '',
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      cDeposit: [{ value: null, disabled: true }],
      price: [{ value: null, disabled: true }],
    });
    this.actiRoute.queryParams.subscribe((res) => {
      if (res.offer_id === undefined || res.offer_id === null) {
      } else {
        //getOfferById
        this.oprSrv.getOfferById(res.offer_id).subscribe((res) => {
          console.log(res);
          this.offerData = res;
          this.hideAction = false;
          this.isActive = res.is_active;
          this.requestForm.controls.cDeposit.setValue(parseInt(res.deposit));
          this.requestForm.controls.price.setValue(parseInt(res.price));
          this.requestForm.controls.startDate.setValue(
            moment.utc(res.depart_time).local().format('YYYY-MM-DDTHH:mm')
          );
          this.requestForm.controls.endDate.setValue(
            moment.utc(res.arrival_time).local().format('YYYY-MM-DDTHH:mm')
          );
        });

        this.requestForm.controls.offer_id.setValue(res.offer_id);
        // this.requestForm.controls.cDeposit.setValue(parseInt(res.deposit));
        // this.requestForm.controls.price.setValue(parseInt(res.price));
        this.requestForm.controls.offer_id.disable();
      }
    });
  }

  ngOnInit(): void {
    this.oprSrv.getAllExistingOffer().subscribe((res) => {
      this.filterOffersList = this.offersList = res;
    });
    this.router.routerState.root.queryParams.subscribe((params) => {
      console.log(params, 'paramsssssssssssssssssssss');
      if (params.status == 'true') {
        this.isLoading = true;
        //post data to backend submitOfferPayment method
        this.oprSrv.submitOfferPayment(params).subscribe((res) => {
          console.log(res);
          this.popSrv.showSuccess('Payment Successful');
          this.isLoading = false;
          this.router.navigate(['/home/send-requests']);
          // window.location.reload();
        });
      }
    });
  }

  onOfferIdChange(offerID: string) {
    const filter_obj = this.filterOffersList.filter(
      (res: { Record: { id: string } }) => res.Record.id === offerID
    );
    this.hideAction = moment()
      .subtract(this.requestTime, 'minutes')
      .utc()
      .local()
      .isSameOrAfter(moment.utc(filter_obj[0].Record.arrival_time).local());
    this.isActive = filter_obj[0].Record.is_active;
    this.requestForm.controls.cDeposit.setValue(filter_obj[0].Record.deposit);
    this.requestForm.controls.price.setValue(filter_obj[0].Record.price);
    this.requestForm.controls.startDate.setValue(
      filter_obj[0].Record.depart_time
    );
    this.requestForm.controls.endDate.setValue(
      filter_obj[0].Record.arrival_time
    );

    console.log(
      this.isActive,
      'this.isActive',
      this.hideAction,
      'this.hideAction'
    );
  }

  onStartDateChange() {
    this.requestForm.controls.endDate.setValue('');
  }

  submitRequest() {
    this.isLoading = true;
    const start = this.offerData.depart_time;
    const end = this.offerData.arrival_time;
    console.log(start, end);
    const data2 = {
      offer_id: this.requestForm.controls.offer_id.value,
      price: this.requestForm.controls.price.value,
      cDeposit: this.requestForm.controls.cDeposit.value,
      startDate: moment(this.requestForm.controls.startDate.value).format(
        'YYYY-MM-DD HH:mm'
      ),
      endDate: moment(this.requestForm.controls.endDate.value).format(
        'YYYY-MM-DD HH:mm'
      ),
      // startDate: this.oprSrv.formatDate(this.requestForm.controls.startDate.value, 'yyyy-MM-dd HH:mm'),
      // endDate: this.oprSrv.formatDate(this.requestForm.controls.endDate.value, 'yyyy-MM-dd HH:mm'),
    };
    const data = {
      offer_id: this.requestForm.controls.offer_id.value,
      price: this.requestForm.controls.price.value,
      cDeposit: this.requestForm.controls.cDeposit.value,
      start: moment(this.requestForm.controls.startDate.value).format(
        'YYYY-MM-DD HH:mm'
      ),
      end: moment(this.requestForm.controls.endDate.value).format(
        'YYYY-MM-DD HH:mm'
      ),
      startDate: this.oprSrv.formatDate(start, 'yyyy-MM-dd HH:mm'),
      endDate: this.oprSrv.formatDate(end, 'yyyy-MM-dd HH:mm'),
    };

    console.log(data, data2);
    this.oprSrv.sendRequest(data).subscribe((res) => {
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

        console.log('URL', url);
      } else {
        this.popSrv.showError(res.sdkResponse.errors[0].message);
      }
    });
  }
}
