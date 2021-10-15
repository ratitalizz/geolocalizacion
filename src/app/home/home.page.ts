import { Component,OnInit } from '@angular/core';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LoadingController } from '@ionic/angular';
import {marcadorI} from '../model/marcador.interface';
declare var google;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  //-33.59817268340164, -70.57856504454823
  lat:number=-33.59817268340164;
  lng:number=-70.57856504454823;
  map=null;

  constructor(
    private geoLoca : Geolocation,
    private loadingCtrl: LoadingController)
     {}
  ngOnInit(){
    this.cargarMapa();
  }
  async cargarMapa(){
    const cargar= await this.loadingCtrl.create({
      message:"Cargando Mapa..."
    });
    await cargar.present();
    const ubicacion={
      lat: this.lat,
      lng:this.lng
    };
    const mapaHtml: HTMLElement = document.getElementById("map");
    this.map = new google.maps.Map(mapaHtml,{
      center: ubicacion,
      zoom:12
    });
    google.maps.event.addListenerOnce(this.map,'idle',()=>{
      cargar.dismiss();

      const marcador = new google.maps.Marker({
        position: {
          lat: ubicacion.lat,
          lng: ubicacion.lng
        },
        zoom:8,
        map:this.map,
        title: 'SEDE DUOC UC PUENTE ASALTO'
      });
      this.cargarMarcadores();
    });
  }
  cargarMarcadores(){
    this.listaMarcadores.forEach(marcador=>{
      this.agregarMarcadores(marcador);
    })
  }
  agregarMarcadores(ubicacion:marcadorI){
    const marcador = new google.maps.Marker({
      position: {
        lat: ubicacion.position.lat,
        lng: ubicacion.position.lng
      },
      zoom:8,
      map:this.map,
      title: 'SEDE DUOC UC PUENTE ASALTO'
    });

  }
  listaMarcadores: marcadorI[]=[{
    position:{
      lat:-33.59802024778923, 
      lng:-70.57502141700137
    },
    title: 'Colegio San Carlos'
  },
  {
  position:{
    lat:-33.59802024778923, 
    lng:-70.57502141700137
  },
  title: 'Colegio San Carlos'
},
{
  position : {
    lat : -33.5790119,
    lng : -70.63460169999999
  },
  title: 'Mikasa'
}];



}
