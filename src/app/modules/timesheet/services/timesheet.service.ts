import { Injectable } from '@angular/core';
import { ITimesheetService } from './itimesheet.service';
import { Observable, of } from 'rxjs';
import { Overtime, Status, Timesheet } from '../model/timesheet';

@Injectable({
  providedIn: 'root',
})
export class TimesheetService implements ITimesheetService {
  private dummyData: Timesheet[] = [
    {
      id: 1,
      userId: 1,
      confirmedManagerBy: 'ManagerName',
      confirmedBenefitBy: 'BenefitName',
      works: [
        {
          date: new Date('2024-07-03T17:00:00.000Z'),
          startTime: new Date('2024-07-04T02:00:00.000Z'),
          endTime: new Date('2024-07-04T05:00:00.000Z'),
          workID: 3,
        },
        {
          date: new Date('2024-07-05T17:00:00.000Z'),
          startTime: new Date('2024-07-06T02:00:00.000Z'),
          endTime: new Date('2024-07-06T02:00:00.000Z'),
          workID: 2,
        },
      ],
      status: Status.Pending,
    },
  ];

  GetTimesheet(): Observable<Timesheet[]> {
    throw new Error('Method not implemented.');
  }
  GetTimsheetById(id: number): Observable<Timesheet> {
    const timesheet = this.dummyData.find((t) => t.id === id);
    return of(timesheet!);
  }

  SaveTimesheet(timesheet: Timesheet): Observable<void> {
    throw new Error('Method not implemented.');
  }
  UpdateTimesheet(timesheet: Timesheet): Observable<void> {
    throw new Error('Method not implemented.');
  }
  DeleteTimesheet(id: number): Observable<void> {
    throw new Error('Method not implemented.');
  }
}
