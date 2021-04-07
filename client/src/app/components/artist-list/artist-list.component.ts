import { Component, OnInit } from '@angular/core';
import { UserService } from "../../service/user.service";
import { PersistData }  from '../../service/persistdata';
import { Artist }  from '../../models/artist';
import { GLOBAL } from '../../service/global';

@Component({
  selector: 'app-artist-list',
  templateUrl: './artist-list.component.html',
  styleUrls: ['./artist-list.component.css'],
  providers: [UserService, PersistData]
})
export class ArtistListComponent implements OnInit {

  public titulo: string;
  public artist: Artist[];
  public identity;
  public token;
  public url: string;

  constructor(
    private _userService: UserService,
    private _persistData: PersistData
  ) { 
    this.titulo = 'Artistas';
    this.identity = this._persistData.getIdentity();
    this.token = this._persistData.getToken();
    this.url = GLOBAL.url;
  }

  ngOnInit(): void {
    
  }

}
