import { OperationsService } from 'src/app/services/operations.service';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-comp',
  templateUrl: './comp.component.html',
  styleUrls: ['./comp.component.scss'],
})
export class CompComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;
  userType: any;
  userEmail: any;
  headerTitle: string;
  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private oprSrv: OperationsService,
    private route: ActivatedRoute
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.headerTitle = this.route.snapshot.data['title'];
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.userType = sessionStorage.getItem('uType');
    this.userEmail = sessionStorage.getItem('uEmail');
  }

  logout() {
    this.oprSrv.logout();
  }
}
