import { Component, OnInit } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { WorkOption } from '../../model/timesheet';
import { TimesheetService } from '../../services/timesheet.service';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [TableModule, CommonModule],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent implements OnInit {
  workOptions$: Observable<WorkOption[]> = of([]);

  constructor(private timesheetService: TimesheetService) {}

  ngOnInit(): void {
    this.fetchWorkOptions();
  }

  fetchWorkOptions(): void {
    this.workOptions$ = this.timesheetService.test().pipe(
      map((data) => data ?? []) // Use nullish coalescing to ensure a default empty array
    );
  }
}
