/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { Registro } from './../models/registro.model';
import { Storage } from '@ionic/storage-angular';
import { NavController, ToastController } from '@ionic/angular';

import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';

@Injectable({
  providedIn: 'root',
})
export class DataLocalService {
  public dados: Registro[] = [];
  private _storage: Storage | null = null;

  constructor(
    private storage: Storage,
    private navController: NavController,
    private iab: InAppBrowser,
    private file: File,
    private toastController: ToastController,
    private emailComposer: EmailComposer
  ) {
    //this.storage.remove('data');
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  public set(key: string, value: any) {
    this._storage?.set(key, value);
  }

  async save(format: string, text: string) {
    const novoDado = new Registro(format, text);
    this.dados.unshift(novoDado);
    await this._storage.set('data', this.dados);
    this.navController.navigateForward(['tabs/historico']);
  }

  abrirRegistro(registro: Registro) {
    this.navController.navigateForward(['tabs/historico']);
    switch (registro.type) {
      case 'http':
        //abrir navegador web
        this.iab.create(registro.text, '_system', {
          fullscreen: 'yes',
        });
        break;
      case 'geo':
        this.navController.navigateForward([
          'tabs/historico/mapa',
          registro.text,
        ]);
        break;
    }
  }

  sendMail() {
    const tempRegistro = [];
    const title = 'Tipo, Formato, Criado em, Texto\n';
    tempRegistro.push(title);
    this.dados.forEach((registro) => {
      const fila = `${registro.type}, ${registro.format}, ${registro.created}, ${registro.text.replace(',', ' ')}\n`;
      tempRegistro.push( fila );
    });

    console.log(tempRegistro.join(' '));
    this.createArchive( tempRegistro.join(' ') );
  }

  createArchive(text: string){
    this.file.checkFile(this.file.dataDirectory, 'registros.csv').then( existe => {
      console.log('existe', existe);
      this.showToast(`${text}`, 'success');
      return this.escreverArchive( text );
    }).catch( err => {
      this.showToast(`${err}`, 'danger');
      return this.file.createFile( this.file.dataDirectory, 'registros.csv', false ).then( create => {
        this.showToast(`${create}`, 'success');
        return this.escreverArchive( text );
      }).catch( error => {
        this.showToast(`${error}`, 'danger');
      });
    });
  }

  async escreverArchive(text: string){
    await this.file.writeExistingFile( this.file.dataDirectory, 'registros.csv', text );
    const archive = `${this.file.dataDirectory}registros.csv`;

    const email = {
      to: 'djairn18@gmail.com',
      //cc: 'djairn18@gmail.com',
      bcc: ['djairn18@hotmail.com'],
      attachments: [
        archive,
      ],
      subject: 'Backup',
      body: 'registros.csv Scan APp',
      isHtml: true
    };

    // Send a text message using default options
    this.emailComposer.open(email);
  }

  async showToast(msg: string, color: string) {
    const toast = await this.toastController.create({
      animated: true,
      duration: 2000,
      message: msg,
      position: 'top',
      color
    });
    toast.present();
  }
}
