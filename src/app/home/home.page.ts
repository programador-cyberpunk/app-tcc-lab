import { Component, inject } from '@angular/core';
import { RefresherCustomEvent } from '@ionic/angular';
import { DataService } from '../services/data.service';
import axios from 'axios';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  postagem: string = '';
  postagens: any = [];
  selectedFiles: any = [];
  isEditing: boolean = false;
  editingPostagemId: number | null = null;

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

  ngOnInit() {}

  onFileSelected(event: any) {
    this.selectedFiles = Array.from(event.target.files).slice(0, 4);
  }

  async createOrUpdate() {
    const formData = new FormData();
    formData.append('postagem', this.postagemDados.postagem);

    this.selectedFiles.forEach((file: string | Blob, index: number) => {
      formData.append(`file${index + 1}`, file);
    });

    try {
      if (this.isEditing && this.editingPostagemId !== null) {
        formData.append('id', this.editingPostagemId.toString());
        const response = await axios.post("https://localhost/postagemConn.php", formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log(response);
        this.isEditing = false;
        this.editingPostagemId = null;
      } else {
        const response = await axios.post("https://localhost/postagemConn.php", formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log(response);
      }
      this.postagemDados.postagem = '';  // Reset the input field
      this.selectedFiles = [];  // Reset the file input
      this.pegaPostagem(); // Refresh postagens list after creating or updating a post
    } catch (error) {
      console.log(error);
    }
  }

  async pegaPostagem() {
    try {
      const response = await axios.get("https://localhost/postagemConn.php");
      this.postagens = response.data.map((postagem: any) => {
        return {
          ...postagem,
          files: [
            { path: postagem.arquivoPostagem1, name: postagem.arquivoPostagem1 ? postagem.arquivoPostagem1.split('/').pop() : null },
            { path: postagem.arquivoPostagem2, name: postagem.arquivoPostagem2 ? postagem.arquivoPostagem2.split('/').pop() : null },
            { path: postagem.arquivoPostagem3, name: postagem.arquivoPostagem3 ? postagem.arquivoPostagem3.split('/').pop() : null },
            { path: postagem.arquivoPostagem4, name: postagem.arquivoPostagem4 ? postagem.arquivoPostagem4.split('/').pop() : null }
          ]
        };
      });
    } catch (error) {
      console.log(error);
    }
  }

  editPostagem(postagem: any) {
    this.isEditing = true;
    this.editingPostagemId = postagem.idPostagem;
    this.postagemDados.postagem = postagem.textoPostagem;
    this.selectedFiles = []; // Clear the selected files for editing
    postagem.files.forEach((file: any, index: number) => {
      if (file.path) {
        this.selectedFiles.push(file);
      }
    });
  }

  isImage(filePath: string): boolean {
    return /\.(jpg|jpeg|png|gif)$/i.test(filePath);
  }
}
