import { Component, OnInit } from '@angular/core';
import { Registro } from 'src/app/models/registro.model';
import { DataLocalService } from './../../services/data-local.service';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.page.html',
  styleUrls: ['./historico.page.scss'],
})
export class HistoricoPage implements OnInit {

  constructor(private dataLocal: DataLocalService) {  }

  ngOnInit() {
    console.log('data: ', this.dataLocal.dados);
  }

  sendMail(){
    console.log('send email');
    this.dataLocal.sendMail();
  }

  openRegistro(registro: Registro){
    console.log('registro: ', registro);
    this.dataLocal.abrirRegistro(registro);

  }

}
