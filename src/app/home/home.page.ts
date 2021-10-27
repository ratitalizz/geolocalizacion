import { Component,OnInit } from '@angular/core';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LoadingController } from '@ionic/angular';
import {marcadorI} from '../model/marcador.interface';
import {WayPoint} from '../model/WayPoints';
import {ApiService} from '../api.service';


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

  origen={ lat: -33.5790119, lng:-70.63460169999999}
  destino={lat: -33.59748012388128, lng:-70.5784577539687}
  map=null;
  //crear un servicio de manejo de ruta
  direccionService = new google.maps.DirectionsService();
  //crea un dibujo de la dirección de viaje
  direccionDibuja = new google.maps.DirectionsRenderer();

//VARIABLE DONDE SE RECUPERA LA DIRECCION
dire:string;

  constructor(
    private geoLoca : Geolocation,
    private loadingCtrl: LoadingController,
    private api: ApiService)
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
    this.direccionDibuja.setMap(this.map);
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
      //this.cargarMarcadores();
      this.calcularRuta();
    });
  }
  cargarMarcadores(){
    this.listaMarcadores.forEach(marcador=>{
      this.agregarMarcadores(marcador);
    })
  }
  private calcularRuta(){
    this.direccionService.route({
      origin: this.origen,
      destination: this.destino,
      travelMode: google.maps.TravelMode.DRIVING,
      waypoints: this.WayPoints,
      optimizeWaypoints:true
    },(response, status)=>{
      if (status== google.maps.DirectionsStatus.OK){
        this.direccionDibuja.setDirections(response);
      }
      else{
        console.log("error al cargar la ruta "+ status);
      }
    });
  }
  agregarMarcadores(ubicacion:marcadorI){
    const marcador = new google.maps.Marker({
      position: {
        lat: ubicacion.position.lat,
        lng: ubicacion.position.lng
      },
      zoom:8,
      map:this.map,
      title: ubicacion.title
    });

  }//Lista de puntos (paradas) sobre mi ruta
  WayPoints:WayPoint[]=[
    {
      location:{
        lat:-33.57623792466899, lng:-70.58136660854994
      },stopover:true
    },
    {
      location:{
        lat:-33.594042051674094, lng: -70.57930667204892
      },stopover:true
    }
  
    //Listado de marcadores
  ]
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

//metodo que busca la direccion
private Direccion(){
  console.log(this.dire);
  this.api.getDireccion(this.dire).subscribe(
    (data)=>{
      console.log(data);
    },
    (e)=>{
      console.log(e);
    }
  )
}

}
