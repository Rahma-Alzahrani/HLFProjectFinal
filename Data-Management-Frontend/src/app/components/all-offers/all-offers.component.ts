import { Router } from '@angular/router';
import { GetExistingOffer } from './../../models/getAllExistingOffer';
import { OperationsService } from './../../services/operations.service';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-all-offers',
  templateUrl: './all-offers.component.html',
  styleUrls: ['./all-offers.component.scss'],
})
export class AllOffersComponent implements OnInit {
  existingOfferData: any = [];
  config: any;
  currentDate: string = '';
  hideAction: boolean = false;
  requestTime: number = environment.requestTime;
  constructor(private oprSrv: OperationsService, private router: Router) {
    this.config = {
      currentPage: 1,
      itemsPerPage: 10,
    };
    this.oprSrv.getAllExistingOffer().subscribe((res) => {
      const response: any = res;
      response.filter((item: any) => {
        item.Record.hideAction = moment()
          .subtract(this.requestTime, 'minutes')
          .utc()
          .local()
          .isSameOrAfter(moment.utc(item.Record.arrival_time).local());
        item.Record.depart_time = moment
          .utc(item.Record.depart_time)
          .local()
          .format('DD/MM/YYYY HH:mm');
        item.Record.arrival_time = moment
          .utc(item.Record.arrival_time)
          .local()
          .format('DD/MM/YYYY HH:mm');
        return item;
      });
      this.existingOfferData = res;
      console.log('this.existingOfferData', this.existingOfferData);
    });
  }

  offerRequest(offerID: string, deposit: number, price: number) {
    this.router.navigate(['/home/send-requests'], {
      queryParams: { offer_id: offerID, deposit: deposit, price: price },
    });
  }

  ngOnInit(): void {}
}
