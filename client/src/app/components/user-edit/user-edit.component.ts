import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from "../../service/user.service";
import { PersistData }  from '../../service/persistdata';
import { GLOBAL } from '../../service/global';

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
  public filesToUpload: Array<File>;
  public url: string;

  constructor(
    private _userService: UserService,
    private _persistData: PersistData
  ) { 
    this.titulo = 'Atualizar dados';
    this.alertUpdate = '';
    this.identity = this._persistData.getIdentity();
    this.token = this._persistData.getToken();
    this.user = this.identity;
    this.url = GLOBAL.url;
  }

  ngOnInit(): void {
    console.log(this.identity);
    
  }

  onSubmitUpdate(){
    this._userService.updateUser(this.user).subscribe(
      (response: any) => {
        if(!response.user) {
          this.alertUpdate = 'Erro ao atualizar usuario';
        } else {
          this.user = response.user;
          localStorage.setItem('identity', JSON.stringify(this.user));
          document.getElementById('identityName').innerHTML = this.user.name;

          if(!this.filesToUpload) {
            //redirect
          } else {
            this.makeFileRequest(this.url+'upload-user-image/'+this.user._id, [], this.filesToUpload).then(
              (result: any) => {
                this.user.image = result.image;
                localStorage.setItem('identity', JSON.stringify(this.user));
                
                //document.getElementById("divImageUser").style.backgroundImage = "url('"+ this.url +"get-user-image/"+this.user.image+"')";

              }
            );
          }

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

  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }

  makeFileRequest(url: string, params: Array<string>, files: Array<File>) {
    var token = this.token;

    return new Promise(function(resolve, reject) {
      var formData:any = new FormData();
      var xhr = new XMLHttpRequest();

      for(var i = 0; i < files.length; i++) {
        formData.append('image', files[i], files[i].name);
      }

      xhr.onreadystatechange = function() {
        
        if(xhr.readyState == 4) {

          if(xhr.status == 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      }

      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', token);
      xhr.send(formData);

    });
  }

}
