import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {CompetitionModel} from 'src/app/shared/models/league/competition.model';
import {HomeOutputRequestModel} from 'src/app/shared/models/requests/home-request.model';
import {SimulationInputRequestModel, SimulationOutputRequestModel} from 'src/app/shared/models/requests/simulation-request.model';
import {WhitePaperOutputRequestModel} from 'src/app/shared/models/requests/whitepaper-request.model';
import {Conf} from 'src/app/conf';


@Injectable({
  providedIn: 'root',
})
export class FBKRequestProvider {
  constructor(
    private http: HttpClient) {

  }

  // ******************************************************* //
  // ******************* HOME ****************************** //
  // ******************************************************* //

  public getHome(): Observable<HomeOutputRequestModel> {
    return this.http.get<any>(Conf.apiBaseUrl + '/website/home', {}).pipe(map((response) => {
      return response ? new HomeOutputRequestModel(response) : null;
    }));
  }

  public getLeagues(complexId: string): Observable<CompetitionModel[]> {
    return this.http
        .get<any[]>(Conf.apiBaseUrl + '/competitions?complex=' + complexId).pipe(map((response) => {
          const returnedCompetitions = [];
          if (response && response.length) {
            for (const r of response) {
              returnedCompetitions.push(new CompetitionModel(r));
            }
          }
          return returnedCompetitions;
        }));
  }

  getLeagueById(id: string): Observable<CompetitionModel> {
    return this.http.get<any>(Conf.apiBaseUrl + '/competitions/leagues/' + id).pipe(map((response)=>{
      return new CompetitionModel(response);
    }));
  }

  // ******************************************************* //
  // ******************* SIMULATION ****************************** //
  // ******************************************************* //

  public getSimulation(input: SimulationInputRequestModel): Observable<SimulationOutputRequestModel> {
    return this.http.post<any>(Conf.apiBaseUrl + '/website/simulation', input).pipe(map((response) => {
      return response ? new SimulationOutputRequestModel(response) : null;
    }));
  }

  public getWhitePaper(data): Observable<WhitePaperOutputRequestModel> {
    return this.http.post<any>(Conf.apiBaseUrl + '/track/download/download_pdf_futbak_presentation_US', data).pipe(map((response) => {
      return response;
    }));
  }

  public getInstagramData():Observable<object> {
    return this.http.get<any>('https://graph.instagram.com/me/media?fields=permalink,id,media_type,media_url,username,timestamp,caption&limit=6&access_token='+Conf.instagramToken).pipe(map((response) => {
      return response;
    }));
  }

  public contactMessage(data):Observable<object> {
    return this.http.post<any>(Conf.apiBaseUrl + '/website/message', data).pipe(map((response) => {
      return response;
    }));
  }

  public contactEmail(data):Observable<object> {
    return this.http.post<any>(Conf.apiBaseUrl + '/website/contact', data).pipe(map((response) => {
      return response;
    }));
  }
}
