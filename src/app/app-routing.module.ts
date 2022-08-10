import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddressListComponent } from './address-list/address-list.component';
import { AppComponent } from './app.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { ReviewDateComponent } from './review-date/review-date.component';

const routes: Routes = [
  { path:'home', component:AppComponent},
  { path:'customer-list', component:CustomerListComponent},
  { path:'customer-list/:id', component: CustomerListComponent},
  { path:'address-list/:id', component: AddressListComponent},
  { path:'review-date/:custId', component: ReviewDateComponent},
  { path:'review-date', component:ReviewDateComponent},
  { path:'address-list', component:AddressListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
