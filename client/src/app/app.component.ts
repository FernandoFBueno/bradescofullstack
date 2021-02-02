import { Component, OnInit } from '@angular/core';
import { UserService } from './service/user.service';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public title = 'APP Bradesco';
  public user: User;
  public userRegister: User;
  public identity;
  public token;
  public errorMessage;
  public alertMessage;

  constructor(
    private _userService:UserService
  ){
    this.user = new User('','','','','','ROLE_USER','');
    this.userRegister = new User('','','','','','ROLE_USER','');
    this.token = '';
    this.errorMessage = '';
  }

  ngOnInit() {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();

    console.log(this.identity);
  }

  public onSubmit(){
    console.log(this.user)
    this._userService.signup(this.user).subscribe(
      (response: any) => {
        let identity = response.user;
        this.identity = identity;
        if(!this.identity._id) {
          this.errorMessage = 'Erro ao identificar usuário';
        } else {
          //Criar localstorage
          localStorage.setItem('identity', JSON.stringify(identity));

          //Tokenizar
          this._userService.signup(this.user, 'true').subscribe(
            (response: any) => {
              let token = response.token;
              this.token = token;
      
              if(this.token.length <= 0) {
                this.errorMessage = 'Erro ao guardar token';
              } else {
                localStorage.setItem('token', token);
                this.user = new User('','','','','','ROLE_USER','');
              }
            },
            error => {
              var errorMessage = <any>error;
              
              if(errorMessage != null){
                this.errorMessage = errorMessage.error.message;
              }
            }
          );
        }
      },
      error => {
        var errorMessage = <any>error;
        if(errorMessage != null){
          this.errorMessage = errorMessage.error.message;
        }
      }
    );
  }

  logout(){
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear();
    this.identity = null;
    this.token = null;
  }

  onSubmitRegister(){
    this._userService.register(this.userRegister).subscribe(
      (response: any) => {
        let user = response.user;
        this.userRegister = user;

        if(!user._id){
          this.alertMessage = 'Erro ao cadastrar usuario';
        } else {
          this.alertMessage = 'Usuario cadastrado com sucesso';
          this.userRegister = new User('','','','','','ROLE_USER','');
        }

      },
      error => {
        var errorMessage = <any>error;
        if(errorMessage != null){
          this.alertMessage = errorMessage.error.message;
        }
      }
    );
  }

}
