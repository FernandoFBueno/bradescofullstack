import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { UserService } from "../service/user.service";
import { PersistData }  from '../service/persistdata';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  providers: [UserService, PersistData]
})
export class UserEditComponent implements OnInit {
  public titulo: string;
  public user: User;
  public identity;
  public token;
  public alertUpdate;

  constructor(
    private _userService: UserService,
    private _persistData: PersistData
  ) { 
    this.titulo = 'Atualizar dados';
    this.alertUpdate = '';
    this.identity = this._persistData.getIdentity();
    this.token = this._persistData.getToken();
    this.user = this.identity;
  }

  ngOnInit(): void {
    
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
          document.getElementById('identityName').innerHTML = this.user.name;
          this.alertUpdate = 'Usuario atualizado com sucesso';
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
