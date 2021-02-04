import { Injectable } from '@angular/core';
import { HttpClient, HttpResponseBase, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';

@Injectable()
export class UserService{

    public url: string;
    public identity;
    public token;

    constructor(private _http: HttpClient) {
        this.url = GLOBAL.url;
    }

    signup(userLogin: any, getHash: string | null = null) {
        if(getHash) {
            userLogin.gethash = getHash;
        }
        let json = JSON.stringify(userLogin);
        let params = json;

        let headers = new HttpHeaders({'Content-Type':'application/json'});

        return this._http.post(this.url+'userlogin', params, {headers: headers})
                         .pipe(map(res => res));
    }

    register(userRegister){
        let params = JSON.stringify(userRegister);;

        let headers = new HttpHeaders({'Content-Type':'application/json'});

        return this._http.post(this.url+'userregister', params, {headers: headers})
                         .pipe(map(res => res));
    }

    updateUser(userUpdate) {
        let params = JSON.stringify(userUpdate);;

        let headers = new HttpHeaders({
            'Content-Type':'application/json',
            'Autorizathion': this.getToken()
        });

        return this._http.post(this.url+'update-user/'+userUpdate._id, params, {headers: headers})
                         .pipe(map(res => res));
    }

    getIdentity(){
        let identity = JSON.parse(localStorage.getItem('identity'));
        if(identity != "undefined"){
            this.identity = identity;
        } else{
            this.identity = null;
        }
        return this.identity;
    }

    getToken(){
        let token = localStorage.getItem('token');
        if(token != "undefined"){
            this.token = token;
        } else{
            this.token = null;
        }
        return this.token;
    }

}