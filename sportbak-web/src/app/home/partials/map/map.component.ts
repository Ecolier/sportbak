import {Component, ElementRef} from '@angular/core';
import {Router} from '@angular/router';
import {Loader} from '@googlemaps/js-api-loader';
import MarkerClusterer from '@googlemaps/markerclustererplus';
import {Conf} from 'src/app/conf';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {ComplexModel} from 'src/app/shared/models/complex/complex.model';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {map_config} from 'src/app/shared/values/map-config';
import {DataService} from '../../../shared/services/data.service';

@Component({
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})

export class MapComponent extends FBKComponent {
  loader = new Loader({
    apiKey: Conf.googleMapApi,
    libraries: ['places'],

  });
  markers = [] ;
  complexes: ComplexModel[] = [];
  map: google.maps.Map;
  marker: google.maps.Marker;
  placeId: string ;
  name: string ;
  formatted_address: any ;
  formatted_phone_number: string ;
  rating: number ;
  status: any ;
  reviews = [] ;
  photos = [] ;
  photoActive = [] ;
  mapError: any ;
  logo: string;
  complexId:string
  loadedMap: boolean = false;
  mapLoadingError: string;
  reloadData:any;
  constructor(
    public dataService: DataService,
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    private _router: Router,
  ) {
    super(_refElement, translate, 'HomePageComponent');
  }


  fbkOnInit() {
    if (this.loadedMap == false) {
      this.reloadData = setInterval(()=> {
        if (this.loadedMap == true) {
          clearInterval(this.reloadData);
        } else {
          this.initData();
        }
      }, 2000);
    }
  }

  initData() {
    this.loader.load().then(() => {
      this.complexes = this.dataService.complexes;
      const map = document.getElementById('map');
      if (map) {
        this.map = new google.maps.Map(map as HTMLElement, map_config as google.maps.MapOptions);
        this.setMarker();
      }
    });
  }


  setMarker() {
    for (let i = 0; i < this.complexes.length; i++) {
      const complex = this.complexes[i];
      const latitude = Number(complex.latitude);
      const longitude = Number(complex.longitude);
      const icon_marker = '../assets/img/home-page/soccerball.png';

      this.marker = new google.maps.Marker(
          {
            position: {lat: latitude, lng: longitude},
            title: complex.name,
            icon: icon_marker,
          },

      );

      this.marker.setMap(this.map);
      this.markers.push(this.marker);

      this.marker.addListener('click', () => {
        this.findPlace(complex);
        this.complexId = complex._id;
        this.map.setZoom(13);
        this.map.setCenter({lat: latitude, lng: longitude});
      });
    }

    if (this.markers.length < 2) {
      this.loadedMap = false;
      console.log('The map is not loaded');
      this.mapLoadingError = this.getTranslation('map_loading');
    } else {
      this.loadedMap = true;
      this.mapLoadingError = null; ;
    }
    new MarkerClusterer(this.map, this.markers, {
      maxZoom: 8,
      imagePath:
        './assets/img/home-page/markercluster/m',
    });
  }

  findPlace(complex) {
    this.rating = null;
    this.reviews = null;
    this.status = null;
    this.name = null;
    this.formatted_address = null;
    this.logo = null;
    this.formatted_phone_number = null;
    this.photos = null;
    let service;
    const request = {
      query: complex.name,
      fields: ['place_id', 'name'],
      locationBias: {radius: 100, center: {lat: parseFloat(complex.latitude), lng: parseFloat(complex.longitude)}},
    };
    service = new google.maps.places.PlacesService(this.map);
    service.findPlaceFromQuery(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        this.placeId = results[0].place_id;
        this.getDetails(complex);
      } else {
        this.mapError = this.getTranslation('map_error');
      }
    });
  }

  getDetails(complex) {
    let service;
    const request = {
      placeId: this.placeId,
      fields: ['name', 'rating', 'formatted_phone_number', 'photo', 'business_status', 'formatted_address', 'photos', 'reviews', 'types'],
    };
    service = new google.maps.places.PlacesService(this.map);
    service.getDetails(request, (place, status) => {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        if (complex.name == place.name) {
          this.name = place.name;
          this.formatted_address = place.formatted_address;
          this.formatted_phone_number = place.formatted_phone_number;

          if (place.photos) {
            this.photos = place.photos.splice(5);
            this.photoActive[0] = this.photos.shift();
          } else {
            this.photos = null;
          }
          this.rating = place.rating;
          this.reviews = place.reviews;
          this.status = place.business_status;
        } else {
          this.name = complex.name;
          this.formatted_address = complex.address.street + ', ' + complex.address.zipcode + ' ' + complex.address.city + ', ' + complex.address.country;
          this.logo = Conf.staticBaseUrl + '/images/complexes/logos/' + complex.logo;
          this.formatted_phone_number = complex.phone;
        }
      } else {
        this.mapError = this.getTranslation('map_error');
      }
    },
    );
  };


  imageSelect(index) {
    this.photos.push(this.photoActive[0]);
    this.photoActive = this.photos.splice(index, 1);
  }

  closeModal() {
    this.name = null;
    this.map.setZoom(5);
    this.map.setCenter;
  }

  showCompetition(complexId) {
    this._router.navigate(['/complex-ctn'], {queryParams: {complex_id: complexId}});
  }
  OnReload() {
    if (this.markers.length < 2) {
      this.initData();
    }
  }
}
