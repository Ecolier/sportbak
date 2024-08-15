import {Injectable} from '@angular/core';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';
import {SBKEventsIds} from 'src/app/shared/values/events-ids';
import {SBKEventsProvider} from '../events.provider';
import {availableLanguages, defaultLanguage} from './translate.constants';

@Injectable({
  providedIn: 'root',
})
export class TranslateAppProvider {
	private languages : string[] = [];

	private pageTranslation = null;
	private componentTranslation = null;

	constructor(
		public translate: TranslateService,
		public events : SBKEventsProvider,
	) {
		 this.init();
	}

	init() {
	  for (const lang of availableLanguages) {
	    this.languages.push(lang.code);
	  }
	  this.translate.addLangs(this.languages);
	  this.translate.setDefaultLang(defaultLanguage);

	  const browserLang = this.translate.getBrowserLang();
	  const success = this.setLanguage(browserLang);

	  this.translate.onLangChange.subscribe(async (event: LangChangeEvent) => {
	    await this.loadAll();
	    this.events.publish(SBKEventsIds.languageChanged, event.lang);
	  });
	}

	subscribreLanguageChanged(observer: (_: any) => void) {
	  this.events.subscribe('translateService', SBKEventsIds.languageChanged, observer);
	}

	getDefaultLanguage() {
	  return defaultLanguage;
	}

	getLanguages() {
	  return this.translate.getLangs();
	}

	getLanguage() {
	  return this.translate.currentLang;
	}

	setLanguage(language : string) {
	  let result = false;
	  if (language) {
	    language = language.toLowerCase();
	    if (this.languageIsAvailable(language)) {
	      this.translate.use(language);
	      result = true;
	    }
	  }
	  return result;
	}

	languageIsAvailable(language : string) {
	  let result = false;
	  if (language) {
	    language = language.toLowerCase();
	    if (this.languages.indexOf(language) >= 0) {
	      result = true;
	    }
	  }
	  return result;
	}

	private async loadAll() {
	  await this.loadPageTranslation();
	  await this.loadComponentTranslation();
	}

	private async loadTranslation(path : string) {
	  let result = null;
	  const res = await this.translate.get([path]).toPromise();
	  if (res) {
	    result = res[path];
	  }
	  return result;
	}

	private async loadPageTranslation() {
	  this.pageTranslation = await this.loadTranslation('page');
	}

	private async loadComponentTranslation() {
	  this.componentTranslation = await this.loadTranslation('component');
	}

	private getValueOfTranslation(translation : any, path : string | string[] = null) {
	  let result = translation;
	  if (path && translation) {
	    if (Array.isArray(path)) {
	      for (let i = 0; i < path.length; i++) {
	        result = result[path[i]];
	      }
	    } else {
	      result = translation[path];
	    }
	  }
	  return result;
	}

	public async getTranslation(fullPath : string) {
	  return this.loadTranslation(fullPath);
	}


	public async getPageTranslation(path : string | string[] = null) {
	  if (this.pageTranslation == null) await this.loadPageTranslation();
	  return this.getValueOfTranslation(this.pageTranslation, path);
	}

	public async getComponentTranslation(path : string | string[] = null) {
	  if (this.componentTranslation == null) await this.loadComponentTranslation();
	  return this.getValueOfTranslation(this.componentTranslation, path);
	}
}
