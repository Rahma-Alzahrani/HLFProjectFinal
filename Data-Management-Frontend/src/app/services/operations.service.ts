import { formatDate } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SAVER, Saver } from '../components/saver.provider';
import { createOffer } from './../models/createOffer';
import { GetAllAgreements } from './../models/getAllAgreements';
import { GetAllEscrow } from './../models/getAllEscrow';
import { GetExistingOffer } from './../models/getAllExistingOffer';
import { GetAllOffers } from './../models/getAllOffers';
import { UploadDocResponse } from './../models/uploadDocResponse';
import { download } from './download';
@Injectable({
  providedIn: 'root',
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
    this.sec_key = `xx${this.formatDate(tDate, 'ddMM')}xxx${this.formatDate(
      tDate,
      'yyyy'
    )}xxxxx`;
    // this.usertoken = sessionStorage.getItem('uToken') ? sessionStorage.getItem('uToken') : '';
  }

  logout() {
    sessionStorage.clear();
    localStorage.clear();
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate(['/auth/login']));
  }

  revokeAgreement(data: any) {
    const serviceName = '/api/v1/dataagreement/revokeAgreement';
    const apiUrl = `${this.baseUrl}${serviceName}`;
    var usertoken = sessionStorage.getItem('uToken')
      ? sessionStorage.getItem('uToken')
      : '';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + usertoken,
      }),
    };
    return this.http.post<any>(apiUrl, data, httpOptions);
  }

  getCosts() {
    const serviceName = '/api/v1/cost/totalCost';
    const apiUrl = `${this.baseUrl}${serviceName}`;
    var usertoken = sessionStorage.getItem('uToken')
      ? sessionStorage.getItem('uToken')
      : '';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + usertoken,
      }),
    };
    return this.http.get<any>(apiUrl, httpOptions);
  }

  getDataHashByOfferId(data: any, endPoint: string) {
    const serviceName = '/api/v1/datahash/' + endPoint;
    const apiUrl = `${this.baseUrl}${serviceName}`;
    var usertoken = sessionStorage.getItem('uToken')
      ? sessionStorage.getItem('uToken')
      : '';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + usertoken,
      }),
    };
    return this.http.post<any>(apiUrl, data, httpOptions);
  }

  getJourneyData() {
    const serviceName = '/api/v1/journey/getAllJourney';
    const apiUrl = `${this.baseUrl}${serviceName}`;
    var usertoken = sessionStorage.getItem('uToken')
      ? sessionStorage.getItem('uToken')
      : '';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + usertoken,
      }),
    };
    return this.http.get<any>(apiUrl, httpOptions);
  }

  setNewHashOffer(data: any) {
    const serviceName = '/api/v1/datahash';
    const apiUrl = `${this.baseUrl}${serviceName}`;
    var usertoken = sessionStorage.getItem('uToken')
      ? sessionStorage.getItem('uToken')
      : '';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + usertoken,
      }),
    };
    return this.http.post<any>(apiUrl, data, httpOptions);
  }

  uploadFile(fileToUpload: any) {
    const serviceName = '/api/v1/files';
    const apiUrl = `${this.baseUrl}${serviceName}`;
    var usertoken = sessionStorage.getItem('uToken')
      ? sessionStorage.getItem('uToken')
      : '';
    const httpOptions = {
      headers: new HttpHeaders({
        // 'Content-Type': 'application/pdf',
        Authorization: 'Bearer ' + usertoken,
      }),
    };
    return this.http.post<UploadDocResponse>(apiUrl, fileToUpload, httpOptions);
  }

  getAllEscrow() {
    const serviceName = '/api/v1/escrow';
    const apiUrl = `${this.baseUrl}${serviceName}`;
    var usertoken = sessionStorage.getItem('uToken')
      ? sessionStorage.getItem('uToken')
      : '';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + usertoken,
      }),
    };
    return this.http.get<GetAllEscrow>(apiUrl, httpOptions);
  }

  getAllAgreements() {
    const serviceName = '/api/v1/dataagreement';
    const apiUrl = `${this.baseUrl}${serviceName}`;
    var usertoken = sessionStorage.getItem('uToken')
      ? sessionStorage.getItem('uToken')
      : '';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + usertoken,
      }),
    };
    return this.http.get<GetAllAgreements>(apiUrl, httpOptions);
  }

  updateOffer(data: any) {
    const serviceName = '/api/v1/offer';
    const apiUrl = `${this.baseUrl}${serviceName}`;
    var usertoken = sessionStorage.getItem('uToken')
      ? sessionStorage.getItem('uToken')
      : '';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + usertoken,
      }),
    };
    return this.http.put<any>(apiUrl, data, httpOptions);
  }
  updateHistoricalOffer(data: any) {
    const serviceName = '/api/v1/offer/updateHistoricalOffer';
    const apiUrl = `${this.baseUrl}${serviceName}`;
    var usertoken = sessionStorage.getItem('uToken')
      ? sessionStorage.getItem('uToken')
      : '';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + usertoken,
      }),
    };
    return this.http.put<any>(apiUrl, data, httpOptions);
  }

  onAcceptRejectRequest(data: any) {
    const serviceName = '/api/v1/offerRequest/acceptReject/payments';
    const apiUrl = `${this.baseUrl}${serviceName}`;
    var usertoken = sessionStorage.getItem('uToken')
      ? sessionStorage.getItem('uToken')
      : '';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + usertoken,
      }),
    };
    return this.http.post<any>(apiUrl, data, httpOptions);
  }

  onAcceptRejectHistoricalRequest(data: any) {
    const serviceName = '/api/v1/historiclOffer/acceptReject/payments';
    const apiUrl = `${this.baseUrl}${serviceName}`;
    var usertoken = sessionStorage.getItem('uToken')
      ? sessionStorage.getItem('uToken')
      : '';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + usertoken,
      }),
    };
    return this.http.post<any>(apiUrl, data, httpOptions);
  }
  onSubmitAcceptRejectRequest(data: any) {
    const serviceName = '/api/v1/offerRequest/acceptReject';
    const apiUrl = `${this.baseUrl}${serviceName}`;
    var usertoken = sessionStorage.getItem('uToken')
      ? sessionStorage.getItem('uToken')
      : '';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + usertoken,
      }),
    };
    return this.http.post<any>(apiUrl, data, httpOptions);
  }

  onSubmitHistoricalAcceptRejectRequest(data: any) {
    const serviceName = '/api/v1/historiclOffer/acceptReject';
    const apiUrl = `${this.baseUrl}${serviceName}`;
    var usertoken = sessionStorage.getItem('uToken')
      ? sessionStorage.getItem('uToken')
      : '';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + usertoken,
      }),
    };
    return this.http.post<any>(apiUrl, data, httpOptions);
  }

  getAllExistingOffer() {
    const serviceName = '/api/v1/offer';
    const apiUrl = `${this.baseUrl}${serviceName}`;
    var usertoken = sessionStorage.getItem('uToken')
      ? sessionStorage.getItem('uToken')
      : '';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + usertoken,
      }),
    };
    return this.http.get<GetExistingOffer>(apiUrl, httpOptions);
  }
  getAllExistingHistoricalOffer() {
    const serviceName = '/api/v1/offer/getAllHistoricalOffers';
    const apiUrl = `${this.baseUrl}${serviceName}`;
    var usertoken = sessionStorage.getItem('uToken')
      ? sessionStorage.getItem('uToken')
      : '';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + usertoken,
      }),
    };
    return this.http.get<GetExistingOffer>(apiUrl, httpOptions);
  }

  getAllRequests() {
    const serviceName = '/api/v1/offerRequest';
    const apiUrl = `${this.baseUrl}${serviceName}`;
    var usertoken = sessionStorage.getItem('uToken')
      ? sessionStorage.getItem('uToken')
      : '';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + usertoken,
      }),
    };
    return this.http.get<any>(apiUrl, httpOptions);
  }

  getAllHistoricalRequests() {
    const serviceName = '/api/v1/historiclOffer';
    const apiUrl = `${this.baseUrl}${serviceName}`;
    var usertoken = sessionStorage.getItem('uToken')
      ? sessionStorage.getItem('uToken')
      : '';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + usertoken,
      }),
    };
    return this.http.get<any>(apiUrl, httpOptions);
  }
  getAllJourneyRequests() {
    const serviceName = '/api/v1/journey/getAllJourney';
    const apiUrl = `${this.baseUrl}${serviceName}`;
    var usertoken = sessionStorage.getItem('uToken')
      ? sessionStorage.getItem('uToken')
      : '';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + usertoken,
      }),
    };
    return this.http.get<any>(apiUrl, httpOptions);
  }

  sendRequest(data: any) {
    const serviceName = '/api/v1/offerRequest/payments';
    const apiUrl = `${this.baseUrl}${serviceName}`;
    var usertoken = sessionStorage.getItem('uToken')
      ? sessionStorage.getItem('uToken')
      : '';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + usertoken,
      }),
    };
    return this.http.post<any>(apiUrl, data, httpOptions);
  }
  sendHistoricalRequest(data: any) {
    const serviceName = '/api/v1/historiclOffer/payments';
    const apiUrl = `${this.baseUrl}${serviceName}`;
    var usertoken = sessionStorage.getItem('uToken')
      ? sessionStorage.getItem('uToken')
      : '';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + usertoken,
      }),
    };
    return this.http.post<any>(apiUrl, data, httpOptions);
  }

  // submitOffer(data: any) {
  //   const serviceName = '/api/v1/offer';
  //   const apiUrl = `${this.baseUrl}${serviceName}`;
  //   var usertoken = sessionStorage.getItem('uToken') ? sessionStorage.getItem('uToken') : '';
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer ' + usertoken,
  //     }),
  //   };
  //   return this.http.post<createOffer>(apiUrl, data, httpOptions);
  // }

  submitOffer(data: any) {
    const serviceName = '/api/v1/offer';
    const apiUrl = `${this.baseUrl}${serviceName}`;
    var usertoken = sessionStorage.getItem('uToken')
      ? sessionStorage.getItem('uToken')
      : '';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + usertoken,
      }),
    };
    return this.http.post<any>(apiUrl, data, httpOptions);
  }

  getHashDatabyAssetId(assetId: any, offerId: any) {
    const serviceName = '/api/v1/offer/getHashDataByAssetId/' + assetId + '/' + offerId;
    const apiUrl = `${this.baseUrl}${serviceName}`;
    var usertoken = sessionStorage.getItem('uToken')
      ? sessionStorage.getItem('uToken')
      : '';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + usertoken,
      }),
    };
    return this.http.get<any>(apiUrl, httpOptions);
  }

  submitHistoricalOffer(data: any) {
    const serviceName = '/api/v1/offer/historicalDataOffer';
    const apiUrl = `${this.baseUrl}${serviceName}`;
    var usertoken = sessionStorage.getItem('uToken')
      ? sessionStorage.getItem('uToken')
      : '';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + usertoken,
      }),
    };
    return this.http.post<any>(apiUrl, data, httpOptions);
  }

  submitOfferPayment(data: any) {
    const serviceName = '/api/v1/offerRequest';
    const apiUrl = `${this.baseUrl}${serviceName}`;
    var usertoken = sessionStorage.getItem('uToken')
      ? sessionStorage.getItem('uToken')
      : '';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + usertoken,
      }),
    };
    return this.http.post<any>(apiUrl, data, httpOptions);
  }
  submitHistoricalOfferPayment(data: any) {
    const serviceName = '/api/v1/historiclOffer';
    const apiUrl = `${this.baseUrl}${serviceName}`;
    var usertoken = sessionStorage.getItem('uToken')
      ? sessionStorage.getItem('uToken')
      : '';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + usertoken,
      }),
    };
    return this.http.post<any>(apiUrl, data, httpOptions);
  }

  getOffers() {
    const serviceName = '/api/v1/offer';
    const apiUrl = `${this.baseUrl}${serviceName}`;
    var usertoken = sessionStorage.getItem('uToken')
      ? sessionStorage.getItem('uToken')
      : '';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + usertoken,
      }),
    };
    return this.http.get<GetAllOffers>(apiUrl, httpOptions);
  }
  getOfferById(id: any) {
    const serviceName = '/api/v1/offer/offerById/' + id;
    const apiUrl = `${this.baseUrl}${serviceName}`;
    var usertoken = sessionStorage.getItem('uToken')
      ? sessionStorage.getItem('uToken')
      : '';

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + usertoken,
      }),
    };
    return this.http.get<any>(apiUrl, httpOptions);
  }

  getHistoricalOffers() {
    const serviceName = '/api/v1/offer/getAllHistoricalOffers';
    const apiUrl = `${this.baseUrl}${serviceName}`;
    var usertoken = sessionStorage.getItem('uToken')
      ? sessionStorage.getItem('uToken')
      : '';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + usertoken,
      }),
    };
    return this.http.get<GetAllOffers>(apiUrl, httpOptions);
  }

  getHistoricalOfferById(id: any) {
    const serviceName = '/api/v1/offer/getHistoricalOfferById/' + id;
    const apiUrl = `${this.baseUrl}${serviceName}`;
    var usertoken = sessionStorage.getItem('uToken')
      ? sessionStorage.getItem('uToken')
      : '';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + usertoken,
      }),
    };
    return this.http.get<any>(apiUrl, httpOptions);
  }

  formatDate(value: any, dateFormat: string) {
    return formatDate(value, dateFormat, 'en-GB', 'UTC/GMT');
  }

  generate_UUID() {
    let dtd = new Date().getTime();
    return this.sec_key.replace(/[xy]/g, (cached) => {
      var rKey = (dtd + Math.random() * 999) % 32 | 0;
      dtd = Math.floor(dtd / 32);
      return (cached == 'x' ? rKey : (rKey & 0x3) | 0x8)
        .toString(32)
        .toUpperCase();
    });
  }

  generate_HASH_ID() {
    const tDate = Date();
    const hash_key = `xxxxx-xxxx${this.formatDate(
      tDate,
      'ddMM'
    )}xxxxxx-xxx${this.formatDate(tDate, 'yy')}xxxxxx-xxxxxx`;
    let dtd = new Date().getTime();
    return hash_key.replace(/[xy]/g, (cached) => {
      var rKey = (dtd + Math.random() * 999) % 32 | 0;
      dtd = Math.floor(dtd / 32);
      return (cached == 'x' ? rKey : (rKey & 0x3) | 0x8).toString(32);
    });
  }

  downloadFile(data: any) {
    const serviceName = '/api/v1/files/download';
    const apiUrl = `${this.baseUrl}${serviceName}`;
    var usertoken = sessionStorage.getItem('uToken')
      ? sessionStorage.getItem('uToken')
      : '';
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + usertoken,
      }),
      responseType: 'blob' as 'json',
      observe: 'response' as 'body',
    };

    return this.http
      .post(apiUrl, data, {
        headers: httpOptions.headers,
        reportProgress: true,
        observe: 'events',
        responseType: 'blob',
      })
      .pipe(download((blob) => this.save(blob, data.file_name)));
  }

  blob(url: string, filename?: string): Observable<Blob> {
    return this.http.get(url, {
      responseType: 'blob',
    });
  }

  latencyClaim(payload: any) {
    const serviceName = '/api/v1/claim/latencyClaim';
    const apiUrl = `${this.baseUrl}${serviceName}`;
    var usertoken = sessionStorage.getItem('uToken')
      ? sessionStorage.getItem('uToken')
      : '';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + usertoken,
      }),
    };
    return this.http.post(apiUrl, payload, httpOptions);
  }

  falsifyClaim(payload: any) {
    const serviceName = '/api/v1/claim/falsifyClaim';
    const apiUrl = `${this.baseUrl}${serviceName}`;
    var usertoken = sessionStorage.getItem('uToken')
      ? sessionStorage.getItem('uToken')
      : '';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + usertoken,
      }),
    };
    return this.http.post(apiUrl, payload, httpOptions);
  }
  missingClaim(payload: any) {
    const serviceName = '/api/v1/claim/missingClaim';
    const apiUrl = `${this.baseUrl}${serviceName}`;
    var usertoken = sessionStorage.getItem('uToken')
      ? sessionStorage.getItem('uToken')
      : '';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + usertoken,
      }),
    };
    return this.http.post(apiUrl, payload, httpOptions);
  }

  getData(data1: any) {
    const data = {
      search: 'MV29046',
    };
    const url = 'http://52.152.175.134:2018';
    const serviceName = '/requestcar/getCar';
    const apiUrl = `${url}${serviceName}`;
    // var usertoken = sessionStorage.getItem('uToken') ? sessionStorage.getItem('uToken') : '';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer ' + usertoken,
      }),
    };
    return this.http.post<any>(apiUrl, data, httpOptions);
  }
}
