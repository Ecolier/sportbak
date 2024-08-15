import {Component, ElementRef, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Conf} from 'src/app/conf';
import {ComplexModel} from 'src/app/shared/models/complex/complex.model';
import {ManagerProvider} from 'src/app/manager/shared/services/manager.service';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {ManagerData} from '../shared/models/manager-data.model';
import {ManagerMenuService} from '../layout/manager-menu/manager-menu.service';
import {FBKComponent} from 'src/app/shared/components/base.component';

class OpeningDay {
  dayName: string;
  slots: string[][] = [];

  constructor(name: string, daySlots) {
    this.dayName = name;

    daySlots.forEach(slot => {
      if (slot.start) {
        let startDate = new Date(slot['start']);
        let endDate = new Date(slot['end'])
          this.slots.push(
            [
              ("0" + startDate.getHours()).slice(-2) + ':' + ("0" + startDate.getMinutes()).slice(-2), 
              ("0" + endDate.getHours()).slice(-2) + ':' + ("0" + endDate.getMinutes()).slice(-2)
            ]
          );
      }
    });
  }
}

@Component({
  selector: 'manager-space',
  templateUrl: './manager-space.component.html',
  styleUrls: ['./manager-space.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ManagerSpaceComponent extends FBKComponent {
  complex: ComplexModel;
  logoURL = Conf.staticBaseUrl + '/images/complexes/logos/';
  followers: any;
  openingDays: OpeningDay[] = [];
  isShowingFollowers: boolean = false;
  week: []
  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    private managerProvider: ManagerProvider,
    private activatedRoute: ActivatedRoute,
    protected managerMenuService: ManagerMenuService,
    private _router: Router,
  ) {
    super(_refElement, translate, 'ManagerPageComponent');
    this.managerMenuService.setActiveMenuItemKey('space');
  }

  fbkOnInit() {
    this.complex = this.managerProvider.getComplex();
    this.managerProvider.getFollowers().subscribe({
      next: (response) => {
        this.followers = response;
      }, error: (error) => {
        console.log(error);
      },
    }); ;
    this.initOpeningDays();
    
  }
  
  initOpeningDays() {
    if (this.complex.opening && this.complex.opening.length > 0) {
      const openings = this.complex.opening;
      let days = [];
      let names = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"]

      for (let indexDay = 0; indexDay < names.length; indexDay++) {
          days.push(openings.filter(day => day.subtype == names[indexDay]))
          if (days[indexDay].length == 0) {
            days[indexDay].push({subtype: names[indexDay]})
          }        
      }
      days.forEach(day => {
          this.openingDays.push(
            new OpeningDay(day[0].subtype,
            day)
            );
        });
      }
  }

  onPasswordChangeClick() {
    this._router.navigate(['manager/password-change']);
  }

  toggleFollowersModal() {
    this.isShowingFollowers = !this.isShowingFollowers;
  }
}
