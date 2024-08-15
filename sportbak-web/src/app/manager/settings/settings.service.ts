import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Conf} from 'src/app/conf';
import {ManagerProvider} from 'src/app/manager/shared/services/manager.service';
import {ComplexModel} from 'src/app/shared/models/complex/complex.model';
import {HydratedSessionSettingsRemote, SessionSettingsRemote} from './settings.model';

@Injectable({
  providedIn: 'root',
})
export class SessionSettingsService {
  complex: ComplexModel;

  constructor(
    private http: HttpClient,
    private managerProvider: ManagerProvider,
  ) {
    this.complex = this.managerProvider.allManagerData$.complex;
  }

  getAllDefaultSessionSettings(): Observable<HydratedSessionSettingsRemote[]> {
    return this.http.get(`${Conf.apiBaseUrl}/fr/scorer/session/settings/complex/${this.complex._id}?fields=true`) as Observable<HydratedSessionSettingsRemote[]>;
  }

  getDefaultSessionSettingsForField(fieldId: string): Observable<SessionSettingsRemote> {
    return this.http.get(`${Conf.apiBaseUrl}/fr/scorer/session/settings/field/${fieldId}`).pipe(map((response) => response[0]));
  }

  getDefaultSessionSettingsForComplex(): Observable<HydratedSessionSettingsRemote> {
    return this.http.get(`${Conf.apiBaseUrl}/fr/scorer/session/settings/complex/${this.complex._id}`).pipe(map((response) => response[0]));
  }

  updateDefaultSessionSettingsForField(fieldId: string, settingsId: string, settings: Partial<SessionSettingsRemote>) {
    return this.http.patch(`${Conf.apiBaseUrl}/fr/scorer/session/settings/field/${fieldId}/${settingsId}`, settings);
  }
  
  updateDefaultSessionSettingsForComplex(settingsId: string, settings: Partial<SessionSettingsRemote>) {
    return this.http.patch(`${Conf.apiBaseUrl}/fr/scorer/session/settings/complex/${this.complex._id}/${settingsId}`, settings);
  }
  
  deleteConfigurationSessionSettingsForField(fieldId: string, settingsId: string) {
    return this.http.delete(`${Conf.apiBaseUrl}/fr/scorer/session/settings/field/${fieldId}/${settingsId}`);
  }
  
  deleteConfigurationSessionSettingsForComplex(settingsId: string) {
    return this.http.delete(`${Conf.apiBaseUrl}/fr/scorer/session/settings/complex/${this.complex._id}/${settingsId}`);
  }

  setDefaultSessionSettingsForComplex(settings: Partial<SessionSettingsRemote>) {
    return this.http.post(`${Conf.apiBaseUrl}/fr/scorer/session/settings/complex/${this.complex._id}`, settings);
  }

  setDefaultSessionSettingsForField(fieldId: string, settings: Partial<SessionSettingsRemote>) {
    return this.http.post(`${Conf.apiBaseUrl}/fr/scorer/session/settings/field/${fieldId}`, settings);
  }
}
