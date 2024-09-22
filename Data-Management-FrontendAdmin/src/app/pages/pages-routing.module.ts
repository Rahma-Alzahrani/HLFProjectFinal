import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EscrowComponent } from './escrow/escrow.component';
import { JourneyComponent } from './journey/journey.component';
import { OfferComponent } from './offer/offer.component';
import { NewJourneyComponent } from './journey/new-journey/new-journey.component';
import { ClaimManagementComponent } from './claim-management/claim-management.component';
import { DataReolverService } from '../services/data-reolver.service';
import { HistoricalOffersComponent } from './historical-offers/historical-offers.component';
import { CostsComponent } from './costs/costs.component';

const routes: Routes = [
  { path: 'user-management', loadChildren: () => import('./user-management/user-management.module').then(m => m.UserManagementModule) },
  { path: 'offers', component: OfferComponent },
  { path: 'journey', component: JourneyComponent, resolve: { title: DataReolverService } },
  { path: 'journey/new-journey', component: NewJourneyComponent },
  { path: 'escrow', component: EscrowComponent },
  { path: 'claim-management', component: ClaimManagementComponent },
  { path: 'historical-offers', component: HistoricalOffersComponent },
  { path: 'costs', component: CostsComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
