import {Component, ElementRef, HostListener} from '@angular/core';
import {Router} from '@angular/router';
import {ComplexModel} from '../../shared/models/complex/complex.model';
import {ManagerProvider} from '../shared/services/manager.service';
import {TranslateAppProvider} from '../../shared/services/translate/translate.service';
import {footColors, padelColors} from 'src/app/manager/shared/const/statistics-colors';
import {StatisticsHelper} from './statistics-helper.service';
import {ManagerData} from '../shared/models/manager-data.model';
import {ManagerMenuService} from '../layout/manager-menu/manager-menu.service';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {Interval, INTERVALS} from '../shared/helpers/date.helper';


@Component({
  selector: 'manager-statistics',
  templateUrl: './manager-statistics.component.html',
  styleUrls: ['./manager-statistics.component.scss'],
})
export class ManagerStatisticsComponent extends FBKComponent {
  complex: ComplexModel;
  fields: any[];

  statDataModular: any;
  statDataFixed: any;
  loaded = false;
  startRange: Date;
  endRange: Date;
  availableFields: any[];
  availableFieldsNames: string[];
  selectedFields: any[];
  availableSports: string[];
  selectedSports: string[];
  sizeIntervalModular: number;
  possibleIntervals: Interval[];

  customSportColors = {
    foot5: 'background-color: ' + footColors[footColors.length / 2],
    padel: 'background-color: ' + padelColors[padelColors.length / 2],
  };

  chartColors: string[];

  statGetters: StatisticsHelper[] = [];

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    private managerProvider: ManagerProvider,
    protected managerMenuService: ManagerMenuService,
    private _router: Router,
    private statGetterModular: StatisticsHelper,
    private statGetterFixed: StatisticsHelper,
  ) {
    super(_refElement, translate, 'ManagerStatisticsComponent');
    this.managerMenuService.setActiveMenuItemKey('stats');
    this.statGetters.push(statGetterModular);
    this.statGetters.push(statGetterFixed);
  }

  fbkOnInit() {
    this.initialise();
  }

  initialise() {
    this.complex = this.managerProvider.getComplex();
    this.fields = this.complex.fields;
    this.giveColorsToFields();
    this.availableSports = this.complex.sport;
    this.selectedSports = [...this.availableSports];
    this.initDates();
    this.initStatProviders();
    this.reloadAttributes(['availableFields', 'availableFieldsNames', 'selectedFields', 'availableSports', 'selectedSports', 'possibleIntervals']);
    this.loaded = true;
  }

  initDates(): void {
    this.startRange = new Date();
    this.endRange = new Date(this.startRange.getTime() + 7 * 24 * 60 * 60 * 1000);
    this.sizeIntervalModular = INTERVALS.DAY.value;
  }

  private initStatProviders(): void {
    for (const statGetter of this.statGetters) {
      statGetter.setComplex(this.complex);
      statGetter.setStartRange(this.startRange);
      statGetter.setEndRange(this.endRange);
    }
    this.statGetterModular.setInterval(this.sizeIntervalModular);
    this.statGetterFixed.setInterval(INTERVALS.DAY.value);
    this.statGetterModular.initialise().subscribe((data) => {
      this.statDataModular = data;
    });
    this.statGetterFixed.initialise().subscribe((data) => {
      this.statDataFixed = data;
    });
  }

  @HostListener('window:resize', ['$event'])
  isLandscape(): boolean {
    const width = window.innerWidth;
    const height = window.innerHeight;
    return width > height && width > 992;
  }

  updateStatisticsOnStartChange(date: Date): void {
    this.statGetterModular.updateStatisticsOnStartChange(date)
        .subscribe((data) => {
          this.statDataModular = data;
        });
    this.statGetterFixed.updateStatisticsOnStartChange(date)
        .subscribe((data) => {
          this.statDataFixed = data;
        });
    this.reloadAttributes(['possibleIntervals', 'startRange', 'endRange']);
  }

  updateStatisticsOnEndChange(date: Date): void {
    this.statGetterModular.updateStatisticsOnEndChange(date)
        .subscribe((data) => {
          this.statDataModular = data;
        });
    this.statGetterFixed.updateStatisticsOnEndChange(date)
        .subscribe((data) => {
          this.statDataFixed = data;
        });
    this.reloadAttributes(['possibleIntervals', 'startRange', 'endRange']);
  }

  updateStatisticsOnIntervalChange(interval: number): void {
    this.sizeIntervalModular = interval;
    this.statGetterModular.updateStatisticsOnIntervalChange(this.sizeIntervalModular)
        .subscribe((data) => {
          this.statDataModular = data;
        });
    this.reloadAttributes(['possibleIntervals']);
  }

  toggleSportInSelected(sport: string): void {
    this.statGetterModular.toggleSportInSelected(sport);
    this.reloadAttributes(['selectedSports', 'availableFields', 'availableFieldsNames', 'selectedFields']);
  }

  toggleFieldInSelected(name): void {
    this.statGetterModular.toggleFieldInSelected(name);
    this.reloadAttributes(['selectedFields']);
  }

  reloadAttributes(champs): void {
    for (const champ of champs) {
      this[champ] = this.statGetterModular[champ];
    }
    this.setCustomColors();
  }

  giveColorsToFields(): void {
    let footNumber = 0;
    let padelNumber = 0;
    for (const field of this.fields) {
      if (field.sport === 'foot5') {
        field.customColor = footColors[footNumber];
        footNumber++;
      } else if (field.sport === 'padel') {
        field.customColor = padelColors[padelNumber];
        padelNumber++;
      }
    }
  }

  getCustomFieldColor(fieldId) {
    const customColor = this.fields.find((f) => f._id === fieldId).customColor;
    return {'background-color': customColor};
  }

  private setCustomColors(): void {
    this.chartColors = this.selectedFields.map((field) => field.customColor);
  }
}
