import { Component, OnInit } from '@angular/core';
import { PopupService } from './../../services/popup.service';
import { OperationsService } from './../../services/operations.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';

@Component({
  selector: 'app-historical',
  templateUrl: './historical.component.html',
  styleUrls: ['./historical.component.scss'],
})
export class HistoricalComponent implements OnInit {
  public offerForm: FormGroup;
  setVal: boolean = true;
  selectedJourneyId: string = '';
  journeyData: any = [];
  current_Date = new Date();
  journeyID: string = '';
  allRequests: any = [];
  offerDataAggrement: any = [];
  sensorID: string = '';
  sensorData: any = [];
  journeyDataSelection: any = [];
  selectedToppings: string[] = [];
  offers: any = [];
  offerData: any = [];
  offerIDs = new FormControl();
  offerIDList: string[] = [];
  selectedOfferID: string = '';
  toppings = new FormControl();
  isLoading: boolean = false;

  toppingList = [
    'Extra cheese',
    'Mushroom',
    'Onion',
    'Pepperoni',
    'Sausage',
    'Tomato',
  ];

  constructor(
    private fBuilder: FormBuilder,
    private router: Router,
    private oprSrv: OperationsService,
    private popSrv: PopupService
  ) {
    this.offerForm = this.fBuilder.group({
      id: [{ value: 'H_OFFER_' + this.oprSrv.generate_UUID(), disabled: true }],
      validity: true,
      dataOwner: [{ value: '', disabled: true }, Validators.required],
      equipment: ['', Validators.required],
      monitoredAsset: ['', Validators.required],
      processingLevel: ['', Validators.required],
      price: ['', Validators.required],
      total_price: [{ value: '', disabled: true }, Validators.required],
      deposit: [null, Validators.required],
      journeyID: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // const uName = sessionStorage.getItem('uEmail');
    // this.offerForm.controls.dataOwner.setValue(uName);
    // this.getJourneyData();
    // this.router.routerState.root.queryParams.subscribe(params => {
    //   if (params.journeyID) {
    //     this.offerForm.controls.journeyID.setValue(params.journeyID);
    //     this.journeyID = params.journeyID;
    //     // this.offerForm.controls.journeyID.disable();
    //   }
    // }
    // );

    this.oprSrv.getOffers().subscribe(
      (res) => {
        if (res == null) {
          this.allRequests.length = 0;
          this.offers.length = 0;
        } else {
          this.allRequests = res;
          this.offers = res;
          console.log(this.allRequests, 'allRequests');
          // Filter records where arrival_time is greater than current time
          const currentTime = new Date();
          console.log(currentTime, 'currentTime');
          this.allRequests = this.allRequests.filter((record: any) => {
        // item.Record.arrival_time = moment.utc(item.Record.arrival_time).local().format('DD/MM/YYYY HH:mm')
            const arrivalTime = moment.utc(record.Record.arrival_time).local().format('DD/MM/YYYY HH:mm');
            const currentTime = moment.utc().local().format('DD/MM/YYYY HH:mm');
            console.log(arrivalTime, 'arrivalTime', currentTime, 'currentTime');
            return arrivalTime < currentTime;

        // const arrivalTime = new Date(record.Record.arrival_time);
            // console.log(arrivalTime, 'arrivalTime');
            // return arrivalTime < currentTime;
          });
          console.log(this.allRequests, 'allRequestssssssssssssss');
          // store unique monitored assets in an array
          this.allRequests.forEach((element: { Record: any }) => {
            this.sensorData.push(element.Record.monitered_asset);
            console.log(element.Record, 'element.monitoredAsset');
          });
          this.sensorData = [...new Set(this.sensorData)];
        }
        console.log(this.sensorData, 'sensorData');
      },
      (error: HttpErrorResponse) => {
        this.popSrv.showError(error.statusText);
      }
    );
  }
  priceChange( price: any) {
    console.log(price, 'price');
    console.log(this.offerForm.controls.price.value, 'price');
    console.log(this.offerForm.controls.deposit.value, 'deposit');
    const total_price = this.offerForm.controls.price.value * this.selectedOfferID.length;
    this.offerForm.controls.total_price.setValue(total_price);
    console.log(this.offerForm.controls.total_price.value, 'total_price');
  }

  journeyDataChange(journeyID: any) {
    this.isLoading = true;
    console.log(this.sensorID, 'sensorID');
    console.log(journeyID, 'journeyID');

    // dataOwner: [{ value: '', disabled: true }, Validators.required],
    // equipment: ['', Validators.required],
    // monitoredAsset: ['', Validators.required],
    // processingLevel: ['', Validators.required],
    // price: [null, Validators.required],
    // deposit: [null, Validators.required],
    // journeyID: ['', Validators.required],
    // startDate: ['', Validators.required],
    // endDate: ['', Validators.required],
    this.oprSrv.getAllAgreements().subscribe(
      (res) => {
        if (res == null) {
          this.offerDataAggrement.length = 0;
          this.isLoading = false;
        } else {
          this.offerDataAggrement = res;
          console.log(this.offerDataAggrement, 'offerData');
        }
      },
      (error: HttpErrorResponse) => {
        this.popSrv.showError(error.statusText);
        this.isLoading = false;
      }
    );


    //  this.oprSrv.getOffers().subscribe(
    //   (res) => {
    //     if (res == null) {
    //       this.offers.length = 0;
    //     } else {
    //       this.offers = res;
    //       console.log(this.offers, 'offers');
    //     }
    //   },
    //   (error: HttpErrorResponse) => {
    //     this.popSrv.showError(error.statusText);
    //   }
    // );
    
    const filter_obj = this.offers.filter(
      (res: { Record: { journey_uid: any, monitered_asset:any } }) =>
        res.Record.journey_uid === journeyID && res.Record.monitered_asset === this.sensorID
    );
    console.log(filter_obj, 'filter_objzzzzzzzzzz', this.offerDataAggrement);
    if(filter_obj.length === 0){
      this.isLoading = false;
    }

    //compare this.offerDataAggrement with filter_obj with respect to offer_id with best time complexity
    const filter_obj2: any = [];
    for (var i = 0; i < this.offerDataAggrement.length; i++){
      filter_obj.forEach((element: {Record: {id: any}}) => {
        console.log(element.Record.id, 'element');
        console.log(this.offerDataAggrement[i].offer_id, 'this.offerDataAggrement[i].offer_id');
        if (element.Record.id === this.offerDataAggrement[i].offer_id){
          console.log(element.Record.id, 'element.offer_idzzzzzzz');
          filter_obj2.push(element.Record);
        }
      });
    }
    console.log(filter_obj2, 'filter_obj2');
   


    

    this.offerData = filter_obj2;
    // console.log(this.offerData, 'offerData');
    console.log(filter_obj, 'filter_obj');
    // this.offerForm.controls.startDate.setValue(filter_obj2[0].depart_time);
    // this.offerForm.controls.endDate.setValue(filter_obj2[0].arrival_time);
    this.offerForm.controls.dataOwner.setValue(filter_obj2[0].data_owner);
    // this.offerForm.controls.monitoredAsset.setValue(
    //   filter_obj2[0].monitered_asset
    // );

    console.log(this.offerForm.controls, 'offerFormXX');
    this.isLoading = false;
  }

  offerDataChange(offerID: any) {
    console.log(offerID.value, 'offerID');
    //calculate price by multiplying the length of array with price
        this.offerForm.controls.total_price.setValue(this.offerForm.controls.price.value * offerID.value.length);

    const filter_obj = this.offerData.filter(
      (res: { offer_uid: string }) => res.offer_uid === offerID
    );
    console.log(filter_obj, 'filter_obj');
  }
  sensorDataChange(sensorID: string) {
    // this.sensorID = sensorID;
    // console.log(this.sensorID, 'sensorID');
    // console.log(this.allRequests, 'allRequests');
    // const filter_obj = this.allRequests.filter((res: { Record: any; }) => res.Record.monitered_asset === sensorID);
    // console.log(filter_obj, 'filter_obj');
    // this.journeyData = filter_obj.map((res: { Record: any; }) => res.Record);
    // console.log(this.journeyData, 'journeyData');
  }

  setValidity(validity: boolean) {
    this.setVal = validity;
    this.offerForm.controls.validity.setValue(validity);
  }

  getJourneyData() {
    this.oprSrv.getJourneyData().subscribe(
      (res) => {
        if (res == null) {
          this.popSrv.showError('No Data Found');
        } else {
          this.journeyData = res;
          console.log(this.journeyData, 'journeyData ABCD');
        }
      },
      (error: HttpErrorResponse) => {
        this.popSrv.showError(error.error.errors.message);
      }
    );
  }

  onStartDateChange() {
    // this.offerForm.controls.endDate.setValue('');
  }
  onStartDateChange1() {
    console.log(this.allRequests, 'allRequests');
    //filter records between arrival_time and departure_time
    const filter_obj = this.allRequests.filter((res: { Record: any }) => {
      const startDate = moment.utc(this.offerForm.controls.startDate.value).local().format('YYYY-MM-DD');
      const endDate = moment.utc(this.offerForm.controls.endDate.value).local().format('YYYY-MM-DD');
      const arrivalTime = moment.utc(res.Record.arrival_time).local().format('YYYY-MM-DD');
      const departureTime = moment.utc(res.Record.depart_time).local().format('YYYY-MM-DD');
      return arrivalTime >= startDate && departureTime <= endDate;
    });
    console.log(filter_obj, 'filter_obj');
    this.journeyData = filter_obj.map((res: { Record: any }) => res.Record);
    //journey_uid is unique for each journey
    this.journeyDataSelection = this.journeyData.filter(
      (thing:any, index:any, self:any) =>
        index ===
        self.findIndex((t:any) => t.journey_uid === thing.journey_uid)
    );

    console.log(this.journeyData, 'journeyData');

    // this.offerForm.controls.endDate.setValue('');
  }

  submitOffer() {
    //     arrival_time
    // :
    // ""
    // creator
    // :
    // "rahul"
    // data_owner
    // :
    // ""
    // depart_time
    // :
    // ""
    // deposit
    // :
    // 20
    // docType
    // :
    // "dataoffer"
    // equipment
    // :
    // "Sensor2"
    // id
    // :
    // "OFFER_8622054962023TMABK"
    // journey_uid
    // :
    // "G44734"
    // monitered_asset
    // :
    // ""
    // operator
    // :
    // ""
    // owner_org
    // :
    // "Org1MSP"
    // price
    // :
    // 10
    // processing_level
    // :
    // ""
    // validity
    // :
    // true

    console.log(this.offerForm.controls.startDate.value, 'startDate');
    console.log(this.offerForm.controls.endDate.value, 'endDate');
    console.log(this.oprSrv.formatDate(this.offerForm.controls.startDate.value, 'yyyy-MM-dd HH:mm'), 'startDate');
    console.log(this.oprSrv.formatDate(this.offerForm.controls.endDate.value, 'yyyy-MM-dd HH:mm'), 'endDate');

    //validate all fields are filled
    if (this.offerForm.invalid) {
      this.popSrv.showError('Please fill all the fields');
      return;
    }



    const data = {
      id: this.offerForm.controls.id.value,
      validity: this.offerForm.controls.validity.value,
      data_owner: this.offerForm.controls.dataOwner.value,
      equipment: this.offerForm.controls.equipment.value,
      moniteredAsset: this.offerForm.controls.monitoredAsset.value,
      processing_level: this.offerForm.controls.processingLevel.value,
      total_price: this.offerForm.controls.total_price.value,
      price: this.offerForm.controls.total_price.value,
      deposit: this.offerForm.controls.deposit.value,
      operator: this.offerForm.controls.dataOwner.value,
      start_date: this.oprSrv.formatDate(this.offerForm.controls.startDate.value, 'yyyy-MM-dd HH:mm'),
      end_date: this.oprSrv.formatDate(this.offerForm.controls.endDate.value, 'yyyy-MM-dd HH:mm'),
      multiple_offer_id: this.selectedOfferID,
      // journey_uid: this.offerForm.controls.journeyIDList.value
      journey_uid: this.offerForm.controls.journeyID.value, // Updated to get value from "journeyID" form control
    };


    console.log(data);
    // if (
    //   this.journeyID === '' ||
    //   this.journeyID === undefined ||
    //   this.journeyID === null
    // ) {
    //   this.popSrv.showError('Please Fill All Required Fields');
    //   return;
    // }
    this.oprSrv.submitHistoricalOffer(data).subscribe(
      (res) => {
        if (res.result !== undefined || res.result !== null) {
          this.popSrv.showSuccess('New Historical Offer Created Successfully');
          this.router
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() => {
              this.router.navigate(['/home/my-historical']);
            });
        }
      },
      (error: HttpErrorResponse) => {
        this.popSrv.showError(error.error.errors.message);
      }
    );
  }
  // getPath(val: any) {
  //   return val.queue[0] === undefined ? 'No File Chosen' : val.queue[val.queue.length - 1]._file.name;
  // }
}
