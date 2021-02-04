import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { UserService } from './service/user.service';
import { UserEditComponent } from './user-edit/user-edit.component';


@NgModule({
  declarations: [
    AppComponent,
    UserEditComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule

  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
