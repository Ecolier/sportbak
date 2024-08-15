import {Pipe, PipeTransform} from '@angular/core';
import {TranslateAppProvider} from './translate/translate.service';

@Pipe({
  name: 'dateAgo',
  pure: true,
})
export class DateAgoPipe implements PipeTransform {
    private lang = 'en';

    constructor( protected translate : TranslateAppProvider,
    ) {
      this.lang = this.translate.getLanguage();
    }

    transform(value: any, args?: any): any {
      if (value) {
        if (this.lang === 'fr') {
          const seconds = Math.floor((+new Date() - +new Date(value)) / 1000);
          if (seconds < 29) // less than 30 seconds ago will show as 'Just now'
          {
            return 'maintenant';
          }
          const intervals = {
            an: 31536000,
            mois: 2592000,
            semaine: 604800,
            jour: 86400,
            heure: 3600,
            minute: 60,
            seconde: 1,
          };
          let counter;
          for (const i in intervals) {
            counter = Math.floor(seconds / intervals[i]);
            if (counter > 0) {
              if (counter === 1 || i === 'mois') {
                return 'il y a ' + counter + ' ' + i;
              } else {
                return 'il y a ' + counter + ' ' + i + 's';
              }
            }
          }
        } else {
          const seconds = Math.floor((+new Date() - +new Date(value)) / 1000);
          if (seconds < 29) // less than 30 seconds ago will show as 'Just now'
          {
            return 'now';
          }
          const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60,
            second: 1,
          };
          let counter;
          for (const i in intervals) {
            counter = Math.floor(seconds / intervals[i]);
            if (counter > 0) {
              if (counter === 1) {
                return counter + ' ' + i + ' ago'; // singular (1 day ago)
              } else {
                return counter + ' ' + i + 's ago'; // plural (2 days ago)
              }
            }
          }
        }
      }
      return value;
    }
}
