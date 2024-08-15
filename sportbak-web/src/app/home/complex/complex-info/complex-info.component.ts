import {Component, ElementRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Conf} from 'src/app/conf';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {ComplexModel} from 'src/app/shared/models/complex/complex.model';
import {DataService} from 'src/app/shared/services/data.service';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';


@Component({
  selector: 'complex-info',
  templateUrl: './complex-info.component.html',
  styleUrls: ['./complex-info.component.scss'],
})
export class ComplexInfoComponent extends FBKComponent {
  complexes : ComplexModel[];
  myComplex :any;
  logo = Conf.staticBaseUrl + '/images/complexes/logos/';
  image = Conf.staticBaseUrl + '/images/complexes/images/';
  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    public dataService: DataService,
    private route: ActivatedRoute,
  ) {
    super(_refElement, translate, 'HomePageComponent');
  }

  fbkOnInit() {
    this.initData();
    this.dataService.subscribeDataUpdated(() => {
      this.initData();
    });
  }

  initData() {
    this.complexes = this.dataService.complexes;
    this.showMyComplex();
  }

  showMyComplex() {
    this.myComplex = this.complexes.find((ComplexModel) => ComplexModel._id == this.route.snapshot.queryParams['complex_id'] );
  }
}
