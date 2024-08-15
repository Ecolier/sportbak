import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Conf} from 'src/app/conf';
import {convertToMidnight, convertToNoSecondNoMillisecondDate} from '../helpers/date.helper';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  static bookingURL = '/booking/';

  constructor(
    private http: HttpClient,
  ) {
  }

  getBookings(): Observable<object> {
    return this.http.get(Conf.apiBaseUrl + BookingService.bookingURL);
  }

  getBookingsOfDay(day: Date): Observable<object> {
    const populate = [
      {
        path: 'target',
        select: '_id teams competition',
        populate: [{
          path: 'competition',
          select: 'name _id type',
        }],
      },
      {
        path: 'booker',
        select: '_id picture nickname',
      },
    ];

    const params = new HttpParams({
      fromObject: {
        startRange: convertToNoSecondNoMillisecondDate(day).toISOString(),
        populate: JSON.stringify(populate),
        endRange: new Date(day.getTime() + 48 * 60 * 60 * 1000).toISOString(),
      },
    });
    return this.http.get(Conf.apiBaseUrl + BookingService.bookingURL, {params});
  }

  getMonthBookings(startDate: Date): Observable<object> {
    const params = new HttpParams({
      fromObject: {
        startRange: convertToMidnight(startDate).toISOString(),
        count: 'true',
      },
    });
    return this.http.get(Conf.apiBaseUrl + BookingService.bookingURL + 'details', {params});
  }

  getUpcomingBookings(startDate: Date, endDate: Date): Observable<object> {
    const params = new HttpParams({
      fromObject: {
        startRange: convertToNoSecondNoMillisecondDate(startDate).toISOString(),
        endRange: convertToNoSecondNoMillisecondDate(endDate).toISOString(),
        selectors: '{"initiator":"booker", "$or": [{"status":"waiting"},{"status":"request"}]} ',
      },
    });
    return this.http.get(Conf.apiBaseUrl + BookingService.bookingURL, {params});
  }

  getUserById(id: string): Observable<object> {
    return this.http.get(Conf.apiBaseUrl + '/users/' + id);
  }

  getBookingById(id: string) {
    const populate = [
      {
        path: 'booker',
        select: '_id picture nickname email numPhone firstname lastname',
      },
      {
        path: 'field',
        select: '_id name',
      },
    ];

    const params = new HttpParams({
      fromObject: {
        populate: JSON.stringify(populate),
      },
    });
    return this.http.get(Conf.apiBaseUrl + BookingService.bookingURL + id, {params});
  }

  postNewBooking(bookingData): Observable<object> {
    const populate = [
      {
        path: 'booker',
        select: '_id picture nickname',
      },
    ];

    const params = new HttpParams({
      fromObject: {
        populate: JSON.stringify(populate),
      },
    });
    return this.http.post(Conf.apiBaseUrl + BookingService.bookingURL, bookingData, {params});
  }

  updateBooking(bookingData): Observable<object> {
    const populate = [
      {
        path: 'target',
        select: '_id teams competition',
        populate: [{
          path: 'competition',
          select: 'name _id type',
        }],
      },
      {
        path: 'booker',
        select: '_id picture nickname',
      },
    ];
    const params = new HttpParams({
      fromObject: {
        populate: JSON.stringify(populate),
      },
    });
    return this.http.patch(Conf.apiBaseUrl + BookingService.bookingURL + bookingData._id + '/update', bookingData, {params});
  }

  deleteBooking(bookingData): Observable<object> {
    return this.http.patch(Conf.apiBaseUrl + BookingService.bookingURL + bookingData._id + '/cancel', bookingData);
  }

  acceptBooking(bookingId, bookingData): Observable<object> {
    const populate = [
      {
        path: 'booker',
        select: '_id picture nickname',
      },
    ];

    const params = new HttpParams({
      fromObject: {
        populate: JSON.stringify(populate),
      },
    });
    return this.http.post(Conf.apiBaseUrl + BookingService.bookingURL + bookingId + '/accept', bookingData, {params});
  }

  refuseBooking(bookingId, bookingData): Observable<object> {
    return this.http.post(Conf.apiBaseUrl + BookingService.bookingURL + bookingId + '/refuse', bookingData);
  }

  getStatistics(startRange: Date, endRange: Date, sizeInterval: number): Observable<any> {
    return this.http.get(Conf.apiBaseUrl + BookingService.bookingURL +
      'details/?mode=fields&count=true&filling=true&documents=true&startRange=' + startRange +
      '&endRange=' + endRange +
      '&sizeInterval=' + sizeInterval);
  }
}
