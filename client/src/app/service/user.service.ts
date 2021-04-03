import { Injectable } from '@angular/core';
import { HttpClient, HttpResponseBase, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';

@Injectable()
export class UserService{

    public url: string;

    constructor(private _http: HttpClient) {
        this.url = GLOBAL.url;
    }

    signup(userLogin: any, getHash: string | null = null) {

        if(getHash) {
            userLogin.gethash = getHash;
        }

        let json = JSON.stringify(userLogin);
        let params = json;

        return this._http.post(this.url+'userlogin', params)
                         .pipe(map(res => res));
    }

    register(userRegister){

        let params = JSON.stringify(userRegister);;

        return this._http.post(this.url+'userregister', params)
                         .pipe(map(res => res));
    }

    updateUser(userUpdate) {
        
        let params = JSON.stringify(userUpdate);;

        return this._http.put(this.url+'update-user/'+userUpdate._id, params)
                         .pipe(map(res => res));
    }

}