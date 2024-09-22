import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsumerComponent } from './consumer/consumer.component';
import { ProviderComponent } from './provider/provider.component';

const routes: Routes = [
  { path: 'consumer', component: ConsumerComponent },
  { path: 'provider', component: ProviderComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule { }
