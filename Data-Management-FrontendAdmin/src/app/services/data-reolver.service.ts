import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { HeaderService } from './header.service';

@Injectable({
  providedIn: 'root'
})
export class DataReolverService implements Resolve<string> {

  constructor(private headerService: HeaderService) { }

  resolve(): Observable<string> | Promise<string> | any {
    return this.headerService.getTitle();
  }

}
