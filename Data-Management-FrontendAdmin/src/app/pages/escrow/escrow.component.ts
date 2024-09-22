import { Component, OnInit } from '@angular/core';
import { OperationsService } from 'src/app/services/operations.service';
import { PopupService } from 'src/app/services/popup.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-escrow',
  templateUrl: './escrow.component.html',
  styleUrls: ['./escrow.component.scss'],
})
export class EscrowComponent implements OnInit {
  allEscrow: any = [];
  config: any;
  searchText: string = '';

  constructor(private oprSrv: OperationsService, private popSrv: PopupService) {
    this.config = {
      currentPage: 1,
      itemsPerPage: 10,
    };
  }

  ngOnInit(): void {
    sessionStorage.setItem('uType', 'Escrow');
    this.oprSrv.getAllEscrow().subscribe(
      (res) => {
        if (res == null) {
          this.allEscrow = [];
        } else {
          this.allEscrow = res;
        }
      },
      (error: HttpErrorResponse) => {
        this.popSrv.showError(error.error.errors.message);
      }
    );
  }
}
