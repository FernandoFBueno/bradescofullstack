import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { UserService } from "../service/user.service";

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  providers: [UserService]
})
export class UserEditComponent implements OnInit {
  public titulo: string;
  public user: User;
  public identity;
  public token;
  public alertUpdate;

  constructor(
    private _userService: UserService
  ) { 
    this.titulo = 'Atualizar dados';
    this.alertUpdate = '';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.user = this.identity;
  }

  ngOnInit(): void {
    
  }

  onSubmit() {
    
  }

  onSubmitUpdate(){
    console.log(this.user);

    this._userService.updateUser(this.user).subscribe(
      (response: any) => {

        if(!response.user) {
          this.alertUpdate = 'Erro ao atualizar usuario';
        } else {
          this.user = response.user;
          localStorage.setItem('identity', JSON.stringify(this.user));
          this.alertUpdate = 'Usuario atualizado corretamente';
        }
      },
      error => {
        var errorMessage = <any>error;
        
        if(errorMessage != null){
          this.alertUpdate = errorMessage.error.message;
        }
      }
    );
  }

}
