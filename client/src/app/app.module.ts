import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { UserService } from './service/user.service';
import { PersistData }  from './service/persistdata';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { TokenInterceptorService } from './service/tokeninterceptor.service';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ArtistListComponent } from './components/artist-list/artist-list.component';


@NgModule({
  declarations: [
    AppComponent,
    UserEditComponent,
    ArtistListComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    MDBBootstrapModule.forRoot()
  ],
  providers: [
    UserService,
    PersistData,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
