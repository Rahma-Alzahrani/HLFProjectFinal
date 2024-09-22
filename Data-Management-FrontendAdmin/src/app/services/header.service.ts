import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private _title: string = '';

  constructor() { }

  getTitle(): string {
    return this._title;
  }

  setTitle(title: string) {
    this._title = title;
  }


}
