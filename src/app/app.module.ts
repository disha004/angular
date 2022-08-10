import { NgModule, CUSTOM_ELEMENTS_SCHEMA}from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { AddressListComponent } from './address-list/address-list.component';
import { AngularComponent } from './angular/angular.component';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ReviewDateComponent } from './review-date/review-date.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';  
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';  
import { TranslateHttpLoader } from '@ngx-translate/http-loader'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { sharedService } from './shared.service';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatCardModule} from '@angular/material/card';
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { CustomTranslationLoader } from './translation-custom.loader';

@NgModule({
  declarations: [
    AppComponent,
    AddressListComponent,
    CustomerListComponent,
    AngularComponent,
    ReviewDateComponent,
    CustomerDetailsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,  
    MatSnackBarModule,
    NgbModule,  
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatButtonModule,
    MatCardModule,
    //MatMomentDateModule,
    TranslateModule.forRoot({  
      loader: {  
         provide: TranslateLoader,  
         useFactory: HttpLoaderFactory,  
         deps: [HttpClient]  
         }  
      })
  ],
  providers: [sharedService],
schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
  exports:[
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule
    //MatMomentDateModule
  ]
})
export class AppModule { }
export function HttpTranslateLoader(http: HttpClient) {  
    return new TranslateHttpLoader(http); 
}
export function HttpLoaderFactory(http: HttpClient) {
  return new CustomTranslationLoader(http);
}
