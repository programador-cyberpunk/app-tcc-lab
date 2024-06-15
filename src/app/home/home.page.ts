import { Component, inject } from '@angular/core';
import { RefresherCustomEvent } from '@ionic/angular';
import { MessageComponent } from '../message/message.component';

import { DataService, Message } from '../services/data.service';
import axios from 'axios';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  postagem: string ='';
  postagens: any = [];
  private data = inject(DataService);
  constructor() {
    this.pegaPostagem();
  }

  postagemDados = {
    postagem: ""
  }

  refresh(ev: any) {
    setTimeout(() => {
      (ev as RefresherCustomEvent).detail.complete();
    }, 3000);
  }

  getMessages(): Message[] {
    return this.data.getMessages();
  }

  ngOnInit() {
   
  }

  create() {
    
    console.log(this.postagemDados);
    
    axios.post("https://localhost/postagemConn.php", this.postagemDados)
    .then(
      (response) => [
console.log(response),

      ])
    .catch((error: any ) => {
      console.log(error);
      
    })
    
  }

  pegaPostagem() {
    axios.get("https://localhost/postagemConn.php")
    .then(
      (response) => [
console.log(response.data),
     this.postagens = response.data

      ])
    .catch((error: any ) => {
      console.log(error);
      
    })
  }
}
