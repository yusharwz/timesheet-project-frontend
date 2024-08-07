import { inject, Injectable } from '@angular/core';
import { ITimesheetService } from './itimesheet.service';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import {
  Status,
  Timesheet,
  TimesheetResponse,
  WorkOption,
} from '../model/timesheet';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PagedResponse } from '../../../core/models/api.model';
import { API_ENDPOINT } from '../../../core/constants/api-endpoint';
import { SessionService } from '../../../core/services/session.service';

@Injectable({
  providedIn: 'root',
})
export class TimesheetService {
  private readonly http = inject(HttpClient);
  private session = inject(SessionService);

  private fetchWorkData: WorkOption[] = [];
  private fetchTimesheetData: Timesheet[] = [];
  private fetchTimesheetDataID: TimesheetResponse = {} as TimesheetResponse;
  // private apiUrl = 'https://api.yusharwz.my.id/api/v1';
  private apiUrl = API_ENDPOINT.TIMESHEET;
  private readonly token = this.session.get('token');
  // private readonly token =
  //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MjU1OTUwMTgsImlhdCI6MTcyMzAwMzAxOCwiaXNzIjoidGltZXNoZWV0LWFwcCIsImlkIjoiYjZhZmY4ODUtZWM0My00YmU5LWJiZDItOTI5OWUxMDE4ZTNiIiwidXNlcm5hbWUiOiJBa3UgVXNlciIsImVtYWlsIjoiZXBjNDE4MDVAemNjY2suY29tIiwicm9sZSI6InVzZXIifQ.s19zyTJ7_QJCvNHoDkSCJBRETjyxcbAb_SwgwKZLfuc';

  GetTimesheet(): Observable<Timesheet[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'ngrok-skip-browser-warning': 'true',
    });

    return this.http
      .get<{ data: Timesheet[] }>(API_ENDPOINT.TIMESHEET, { headers })
      .pipe(
        map((response) => {
          // Filter only timesheets with status 'created'
          this.fetchTimesheetData = response.data
            .filter((timesheet) => timesheet.status === 'created')
            .map((timesheet) => ({
              ...timesheet,
            }));

          return this.sortTimesheetsByDate(this.fetchTimesheetData);
        }),
        catchError((error) => {
          this.fetchTimesheetData = [];
          return of(this.fetchTimesheetData);
        })
      );
  }

  private sortTimesheetsByDate(timesheets: Timesheet[]): Timesheet[] {
    return timesheets.sort((a, b) => {
      const dateA = new Date(a.createdAt!).getTime();
      const dateB = new Date(b.createdAt!).getTime();
      return dateA - dateB;
    });
  }

  GetTimesheetById(id: any): Observable<TimesheetResponse> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'ngrok-skip-browser-warning': 'true',
    });

    const reqUrl = `${this.apiUrl}/${id}`;
    // console.log('Request URL:', reqUrl);

    return this.http.get<{ data: TimesheetResponse }>(reqUrl, { headers }).pipe(
      map((response) => {
        // console.log('Fetch Work Data:', response.data.timeSheetDetails);
        const timesheet = {
          ...response.data,
          status: Status.Pending,
        };

        this.fetchTimesheetDataID = timesheet;
        return this.fetchTimesheetDataID;
      }),
      catchError((error) => {
        console.error('Error fetching work options:', error);
        return of();
      })
    );
  }

  SaveTimesheet(timesheet: Timesheet): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'ngrok-skip-browser-warning': 'true',
    });

    return this.http.post(API_ENDPOINT.TIMESHEET, timesheet, { headers }).pipe(
      tap((response) => {
        // console.log('Timesheet saved successfully:', response);
      }),
      catchError((error) => {
        console.error('Error saving timesheet:', error);
        return throwError(error);
      })
    );
  }

  UpdateTimesheet(id: any, timesheet: Timesheet): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'ngrok-skip-browser-warning': 'true',
    });

    const reqUrl = `${this.apiUrl}/${id}`;
    // console.log('Request URL:', reqUrl);
    // console.log('id:', id);
    // console.log('Edit Timesheet: ' + timesheet);

    return this.http.put(reqUrl, timesheet, { headers }).pipe(
      tap((response) => {
        // console.log('Timesheet edited successfully:', response);
      }),
      catchError((error) => {
        console.error('Error Edited timesheet:', error);
        return throwError(error);
      })
    );
  }

  DeleteTimesheet(id: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'ngrok-skip-browser-warning': 'true',
    });

    const reqUrl = `${this.apiUrl}/${id}`;
    // console.log('Request URL:', reqUrl);
    // console.log('Delete Timesheet: ' + JSON.stringify(id));

    return this.http.delete(reqUrl, { headers }).pipe(
      tap((response) => {
        // console.log('Timesheet deleted successfully:', response);
      }),
      catchError((error) => {
        console.error('Error deleting timesheet:', error);
        return throwError(error);
      })
    );
  }

  SubmitTimesheet(id: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'ngrok-skip-browser-warning': 'true',
    });

    const reqUrl = `${this.apiUrl}/${id}/submit`;
    // console.log('Request URL:', reqUrl);
    // console.log('submit Timesheet: ' + JSON.stringify(id));

    return this.http.put(reqUrl, { headers }).pipe(
      tap((response) => {
        // console.log('Timesheet submited successfully:', response);
      }),
      catchError((error) => {
        console.error('Error submiting timesheet:', error);
        return throwError(error);
      })
    );
  }

  GetWorkOptions(): WorkOption[] {
    return this.fetchWorkData;
  }

  fethcWorkOptions(): Observable<WorkOption[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'ngrok-skip-browser-warning': 'true',
    });

    return this.http
      .get<PagedResponse<WorkOption[]>>(API_ENDPOINT.WORK, { headers })
      .pipe(
        map((response) => {
          this.fetchWorkData = response.data;
          // console.log('Fetch Work Data:', this.fetchWorkData);
          return this.fetchWorkData;
        }),
        catchError((error) => {
          // console.error('Error fetching work options:', error);
          this.fetchWorkData = [];
          return of(this.fetchWorkData);
        })
      );
  }
}
