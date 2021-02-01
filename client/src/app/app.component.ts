import { Component } from '@angular/core';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title = 'APP Bradesco';
  public user: User;
  public identity;
  public token;

  constructor(){
    this.user = new User('','','','','','','');
    this.identity = false;
    this.token = '';
  }
}
