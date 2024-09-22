import { formatDate } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SAVER, Saver } from '../components/saver.provider';
import { GetAllAgreements } from './../models/getAllAgreements';
import { GetAllEscrow } from './../models/getAllEscrow';
import { GetExistingOffer } from './../models/getAllExistingOffer';
import { GetAllOffers } from './../models/getAllOffers';
import { UploadDocResponse } from './../models/uploadDocResponse';
import { download } from './download';
@Injectable({
  providedIn: 'root'
})
export class OperationsService {
  private sec_key = '';
  baseUrl = environment.baseUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(SAVER) private save: Saver
  ) {
    const tDate = Date();
    this.sec_key = `xx${this.formatDate(tDate, 'ddMM')}xxx${this.formatDate(tDate, 'yyyy')}xxxxx`;
    // this.usertoken = sessionStorage.getItem('uToken') ? sessionStorage.getItem('uToken') : '';
  }

  logout() {
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigate(['/auth/login']));
  }



  getCosts() {
    const serviceName = '/api/v1/cost/totalCost';
    const apiUrl = `${this.baseUrl}${serviceName}`;
    var usertoken = sessionStorage.getItem('uToken') ? sessionStorage.getItem('uToken') : '';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + usertoken,
      }),
    };
    return this.http.get<any>(apiUrl, httpOptions);
  }


  getAllEscrow() {
    const serviceName = '/api/v1/escrow/admin';
    const apiUrl = `${this.baseUrl}${serviceName}`;
    var usertoken = sessionStorage.getItem('uToken') ? sessionStorage.getItem('uToken') : '';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + usertoken,
      }),
    };
    return this.http.get<GetAllEscrow>(apiUrl, httpOptions);
  }

  getAllAgreements() {
    const serviceName = '/api/v1/dataagreement';
    const apiUrl = `${this.baseUrl}${serviceName}`;
    var usertoken = sessionStorage.getItem('uToken') ? sessionStorage.getItem('uToken') : '';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + usertoken,
      }),
    };
    return this.http.get<GetAllAgreements>(apiUrl, httpOptions);
  }

  getAllJourneyRequests() {
    const serviceName = '/api/v1/journey/getAllJourney';
    const apiUrl = `${this.baseUrl}${serviceName}`;
    var usertoken = sessionStorage.getItem('uToken') ? sessionStorage.getItem('uToken') : '';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + usertoken,
      }),
    };
    return this.http.get<any>(apiUrl, httpOptions);
  }

  updateOffer(data: any) {
    const serviceName = '/api/v1/offer';
    const apiUrl = `${this.baseUrl}${serviceName}`;
    var usertoken = sessionStorage.getItem('uToken') ? sessionStorage.getItem('uToken') : '';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + usertoken,
      }),
    };
    return this.http.put<any>(apiUrl, data, httpOptions);
  }




  getOffers() {
    const serviceName = '/api/v1/offer';
    const apiUrl = `${this.baseUrl}${serviceName}`;
    var usertoken = sessionStorage.getItem('uToken') ? sessionStorage.getItem('uToken') : '';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + usertoken,
      }),
    };
    return this.http.get<GetAllOffers>(apiUrl, httpOptions);
  }
  getHistoricalOffers() {
    const serviceName = '/api/v1/offer/getAllHistoricalOffers';
    const apiUrl = `${this.baseUrl}${serviceName}`;
    var usertoken = sessionStorage.getItem('uToken') ? sessionStorage.getItem('uToken') : '';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + usertoken,
      }),
    };
    return this.http.get<GetAllOffers>(apiUrl, httpOptions);
  }


  formatDate(value: any, dateFormat: string) {
    return formatDate(value, dateFormat, 'en-GB', 'UTC/GMT')
  }





  blob(url: string, filename?: string): Observable<Blob> {
    return this.http.get(url, {
      responseType: 'blob'
    })
  }


  getProviderData() {
    const serviceName = '/api/v1/admin/getAllUsers';
    const apiUrl = `${this.baseUrl}${serviceName}`;
    var usertoken = sessionStorage.getItem('uToken') ? sessionStorage.getItem('uToken') : '';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + usertoken,
      }),
    };
    return this.http.post(apiUrl, {},httpOptions);
  }


  getConsumerData() {
    const serviceName = '/api/v1/admin/getAllUsers';
    const apiUrl = `${this.baseUrl}${serviceName}`;
    var usertoken = sessionStorage.getItem('uToken') ? sessionStorage.getItem('uToken') : '';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + usertoken,
      }),
    };
    return this.http.post(apiUrl, {},httpOptions);
  }

  addJourney(payload: any) {
    const serviceName = '/api/v1/journey/journeySchedule';
    const apiUrl = `${this.baseUrl}${serviceName}`;
    var usertoken = sessionStorage.getItem('uToken') ? sessionStorage.getItem('uToken') : '';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + usertoken,
      }),
    };
    return this.http.post(apiUrl, payload, httpOptions);
  }
  
  addclaim(payload: any) {
    const serviceName = '/api/v1/claim/createClaimPeriod';
    const apiUrl = `${this.baseUrl}${serviceName}`;
    var usertoken = sessionStorage.getItem('uToken') ? sessionStorage.getItem('uToken') : '';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + usertoken,
      }),
    };
    return this.http.post(apiUrl, payload, httpOptions);
  }



  getClaimeData() {
      const serviceName = '/api/v1/claim/createClaimPeriod';
      const apiUrl = `${this.baseUrl}${serviceName}`;
      var usertoken = sessionStorage.getItem('uToken') ? sessionStorage.getItem('uToken') : '';
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + usertoken,
        }),
      };
      return this.http.get<any>(apiUrl, httpOptions);
    }

    createTransaction(payload: any) {

      const serviceName = '/api/v1/transactionDetails';
      const apiUrl = `${this.baseUrl}${serviceName}`;
      var usertoken = sessionStorage.getItem('uToken') ? sessionStorage.getItem('uToken') : '';
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + usertoken,
        }),
      };
      return this.http.post(apiUrl, payload, httpOptions);
    }

    getTransactions() {
      const serviceName = '/api/v1/transactionDetails';
      const apiUrl = `${this.baseUrl}${serviceName}`;
      var usertoken = sessionStorage.getItem('uToken') ? sessionStorage.getItem('uToken') : '';
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + usertoken,
        }),
      };
      return this.http.get<any>(apiUrl, httpOptions);
    }

    getTransactionDetails(id: any) {
      const serviceName = '/api/v1/transactionDetails/' + id;
      const apiUrl = `${this.baseUrl}${serviceName}`;
      var usertoken = sessionStorage.getItem('uToken') ? sessionStorage.getItem('uToken') : '';
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + usertoken,
        }),
      };
      return this.http.get<any>(apiUrl, httpOptions);
    }

    updateTransaction(id: any, payload: any) {
      const serviceName = '/api/v1/transactionDetails/' + id;
      const apiUrl = `${this.baseUrl}${serviceName}`;
      var usertoken = sessionStorage.getItem('uToken') ? sessionStorage.getItem('uToken') : '';
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + usertoken,
        }),
      };
      return this.http.put<any>(apiUrl, payload, httpOptions);

    }

    getBankDetailsById(id: any) {
      const serviceName = '/api/v1/bankDetails/' + id;
      const apiUrl = `${this.baseUrl}${serviceName}`;
      var usertoken = sessionStorage.getItem('uToken') ? sessionStorage.getItem('uToken') : '';
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + usertoken,
        }),
      };
      return this.http.get<any>(apiUrl, httpOptions);
    }
    
  


  

}
