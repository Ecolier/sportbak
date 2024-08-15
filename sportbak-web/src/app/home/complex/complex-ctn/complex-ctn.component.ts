import {Component, ElementRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Conf} from 'src/app/conf';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {ComplexModel} from 'src/app/shared/models/complex/complex.model';
import {DataService} from 'src/app/shared/services/data.service';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';


@Component({
  selector: 'complex-ctn',
  templateUrl: './complex-ctn.component.html',
  styleUrls: ['./complex-ctn.component.scss'],
})
export class ComplexCtnComponent extends FBKComponent {
  complexes : ComplexModel[];
  myComplex :any;
  address: any;
  logo = Conf.staticBaseUrl + '/images/complexes/logos/';
  complexNav: any;

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    public dataService: DataService,
    private route: ActivatedRoute,
    private _router: Router,
  ) {
    super(_refElement, translate, 'HomePageComponent');
  }

  fbkOnInit() {
    this.complexNav = 'information';
    this.initData();
    this.dataService.subscribeDataUpdated(() => {
      this.initData();
    });
  }

  initData() {
    this.complexes = this.dataService.complexes;
    this.showMyComplex();
    this.getURLId();
    // this.address = this.myComplex.address.street + this.myComplex.address.zipcode + this.myComplex.address.city
  }

  showMyComplex() {
    this.myComplex = this.complexes.find((ComplexModel) => ComplexModel._id == this.route.snapshot.queryParams['complex_id'] );
  }
  getURLId() {
    if (this.route.snapshot.queryParams['nav']) {
      if (this.route.snapshot.queryParams['league_id']) {
        this.navigation('competition');
      } else {
        this.complexNav = this.route.snapshot.queryParams['nav'];
      }
    }
  }

  navigation(idNavigation) {
    if (this.route.snapshot.queryParams['league_id'] && this.complexNav != 'competition') {
      this.complexNav = idNavigation;
      this._router.navigate(['/complex-ctn'], {queryParams: {
        nav: idNavigation,
        complex_id: this.route.snapshot.queryParams['complex_id'],
        league_id: this.route.snapshot.queryParams['league_id'],
      },
      });
    } else {
      this.complexNav = idNavigation;
      this._router.navigateByUrl('my-complex', {skipLocationChange: false}).then(() => {
        this._router.navigate(['/complex-ctn'], {queryParams: {nav: idNavigation, complex_id: this.route.snapshot.queryParams['complex_id']}});
      });
    }
  }
}
