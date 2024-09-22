import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { PopupService } from 'src/app/services/popup.service';
import { OperationsService } from './../../services/operations.service';
import { HeaderService } from 'src/app/services/header.service';
import * as moment from 'moment';

@Component({
  selector: 'app-journey',
  templateUrl: './journey.component.html',
  styleUrls: ['./journey.component.scss']
})
export class JourneyComponent implements OnInit {
  allRequests: any = [];
  config: any;
  searchText: string = '';
  headerTitle: string = 'Journey Requests';
  currentDate: string ='';
  constructor(
    private oprSrv: OperationsService,
    private router: Router,
    private popSrv: PopupService,
    private headerService: HeaderService
  ) {
    this.config = {
      currentPage: 1,
      itemsPerPage: 5
    }
  }

  ngOnInit(): void {
    sessionStorage.setItem('uType', 'Journey');
    this.oprSrv.getAllJourneyRequests().subscribe(res => {
      if (res == null) {
        this.allRequests.length = 0;
      } else {
        res.filter((item: any) => { 
          item.valid_from = moment.utc(item.valid_from).local().format('DD/MM/YYYY HH:mm');
          item.valid_to = moment.utc(item.valid_to).local().format('DD/MM/YYYY HH:mm');
          this.currentDate = moment.utc().local().format('DD/MM/YYYY HH:mm');
        })
        this.allRequests = res;
      }
    }, (error: HttpErrorResponse) => {
      this.popSrv.showError(error.statusText);
    });
    this.headerService.setTitle(this.headerTitle);

  }

  searchJourney() {
    if (this.searchText === '') {
      this.ngOnInit();
    } else {
      this.allRequests = this.allRequests.filter((res: any) => {
        return res.journey.toLocaleLowerCase().match(this.searchText.toLocaleLowerCase());
      });
    }
  }


  selectJourney(journey: any) {
    this.router.navigate(['/home/new-offers'], { queryParams: { journeyID: journey.uid } });
  }

  addJourney() {
    this.router.navigate(['/admin/journey/new-journey']);
  }


  pageChange(newPage: number) {
    this.config.currentPage = newPage;
  }


  format(date: string, format: string): string {
    var dt = new Date(date)

    dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset())
    return formatDate(dt, format, 'en-GB');
  }

}
