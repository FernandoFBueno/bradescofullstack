import { Injectable } from '@angular/core';

@Injectable()
export class PersistData{
    public identity;
    public token;

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