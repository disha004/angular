import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { Customer } from './customer';
import { Address, Address2 } from './address';
import { Friend } from './friend';
import { Review } from './review';

@Injectable({
  providedIn: 'root'
})
export class NgserviceService {

  constructor(private _http: HttpClient) { }

  addcustomerlist(customer: Customer): Observable<any> {
    return this._http.post<any>("http://localhost:8080/savecustomers", customer);
  }

  getCustomer(id: number): Observable<any> {
    return this._http.get<any>("http://localhost:8080/getCustomerById/" + id);
  }

  getReviewByCustomer(id: number): Observable<any> {
    return this._http.get<any>("http://localhost:8080/getReviewByCustomer/" + id);
  }

  addaddresslist(address: Object): Observable<any> {
    const mData = JSON.stringify(address);
    return this._http.post<any>("http://localhost:8080/address/saveaddress", address);
  }

  addreviewlist(review: Object): Observable<any> {
    const mData = JSON.stringify(review);
    return this._http.post<any>("http://localhost:8080/savereview", review);
  }
  getaddresslist(id: number): Observable<any> {
    //const mData = JSON.stringify(addre);  
    return this._http.get<any>("http://localhost:8080/address/getaddressbyid/" + id);
  }
  deleteAddresslist(id: number): Observable<any> {
    return this._http.delete<any>("http://localhost:8080/address/deleteaddress/" + id);
  }
  getProfileCard(id: number): Observable<any> {
    //const mData = JSON.stringify(addre);  
    return this._http.get<any>("http://localhost:8080/getaddbycid/" + id);
  }
  deleteProfilelist(id: number): Observable<any> {
    return this._http.delete<any>("http://localhost:8080/deleteprofile/" + id);
  }
  updatecustomerlist(id: Number, customer: Customer): Observable<any> {
    return this._http.post<any>("http://localhost:8080/updatecustomer/" + id, customer);
  }
  updateaddresslist(id: Number, address: Address2): Observable<any> {
    return this._http.post<any>("http://localhost:8080/address/updateaddress/" + id, address);
  }
  updatereviewlist(id: Number, review: Review): Observable<any> {
    return this._http.post<any>("http://localhost:8080/updatereview/" + id, review);
  }
}
