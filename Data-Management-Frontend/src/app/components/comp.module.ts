import {
  NgxMatDateAdapter,
  NgxMatDateFormats,
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule,
  NGX_MAT_DATE_FORMATS
} from '@angular-material-components/datetime-picker';
import { NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular-material-components/moment-adapter';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule, MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxPaginationModule } from 'ngx-pagination';
import { AgreementsComponent } from './agreements/agreements.component';
import { AllOffersComponent } from './all-offers/all-offers.component';
import { CompRoutingModule } from './comp-routing.module';
import { CompComponent } from './comp.component';
import { CostsComponent } from './costs/costs.component';
import { CustomSnackbarComponent } from './custom-snackbar/custom-snackbar.component';
import { CustomNgxDatetimeAdapter } from './CustomNgxDatetimeAdapter';
import { EscrowComponent } from './escrow/escrow.component';
import { HashValuesComponent } from './hash-values/hash-values.component';
import { MyOffersComponent } from './my-offers/my-offers.component';
import { NewHashValuesComponent } from './new-hash-values/new-hash-values.component';
import { NewOfferComponent } from './new-offer/new-offer.component';
import { LocalDateFormatPipe } from './pipes/localdate.pipe';
import { RequestsComponent } from './requests/requests.component';
import { SendRequestsComponent } from './send-requests/send-requests.component';
import { JourneyComponent } from './journey/journey.component';
import { HistoricalComponent } from './historical/historical.component';
import { MyhistoricalComponent } from './myhistorical/myhistorical.component';
import { SendHistoricalRequestsComponent } from './send-historical-requests/send-historical-requests.component';
import { HistoricalRequestsComponent } from './historical-requests/historical-requests.component';
import { EditOfferComponent } from './edit-offer/edit-offer.component';
import { EsitHistoricalOfferComponent } from './esit-historical-offer/esit-historical-offer.component';
import {MatDialogModule} from '@angular/material/dialog';
import { DialogBoxComponent } from './dialog-box/dialog-box.component';

const CUSTOM_DATE_FORMATS: NgxMatDateFormats = {
  parse: {
    dateInput: 'l, LTS'
  },
  display: {
    dateInput: 'YYYY-MM-DD HH:mm',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  }
};

@NgModule({
  declarations: [
    CompComponent,
    NewOfferComponent,
    MyOffersComponent,
    RequestsComponent,
    NewHashValuesComponent,
    HashValuesComponent,
    AgreementsComponent,
    EscrowComponent,
    CostsComponent,
    AllOffersComponent,
    SendRequestsComponent,
    CustomSnackbarComponent,
    LocalDateFormatPipe,
    JourneyComponent,
    HistoricalComponent,
    MyhistoricalComponent,
    SendHistoricalRequestsComponent,
    HistoricalRequestsComponent,
    EditOfferComponent,
    EsitHistoricalOfferComponent,
    DialogBoxComponent
  ],
  imports: [
    CommonModule,
    CompRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    MatToolbarModule,
    MatProgressBarModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatTabsModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatSnackBarModule,
    MatTooltipModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    MatDialogModule
  ],
  exports: [CustomSnackbarComponent],
  providers: [
    {
      provide: MAT_RADIO_DEFAULT_OPTIONS,
      useValue: { color: 'primary' },
    },
    {
      provide: NgxMatDateAdapter,
      useClass: CustomNgxDatetimeAdapter,
      deps: [MAT_DATE_LOCALE, NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: NGX_MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS }
  ]
})
export class CompModule { }
