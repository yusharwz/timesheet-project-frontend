import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ChartModule } from 'primeng/chart';
import { StatusTimesheets } from '../../../../core/constants/status-timesheets';
import { TitleHeaderComponent } from '../../../../shared/components/title-header/title-header.component';
import { TimesheetTableComponent } from '../../../approval/components/timesheet-table/timesheet-table.component';
import {
  Timesheet,
  TimesheetSummary,
} from '../../../approval/model/timesheet.model';
import { SummaryTableComponent } from '../../components/summary/summary-table/summary-table.component';
import { Chart, ChartOptions } from '../../models/chart.model';
import { SummaryService } from '../../services/summary.service';
import { RupiahFormatPipe } from '../../../../shared/pipes/rupiah-format.pipe';
import { Roles } from '../../../../core/constants/roles';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [
    NgIf,
    RupiahFormatPipe,
    RouterLink,
    ChartModule,
    TimesheetTableComponent,
    SummaryTableComponent,
    TitleHeaderComponent,
  ],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss',
})
export class SummaryComponent implements OnInit {
  title = 'Dashboard';
  subtitle = 'Timesheet Summary';

  pieData?: Chart;
  pieOptions?: ChartOptions;

  lineData?: Chart;
  lineOptions?: ChartOptions;

  total: number = 0;
  submission: number = 0;
  submissionItems: number = 0;

  // Example Timesheet
  timesheets: TimesheetSummary[] = [];
  recentTimesheets: TimesheetSummary[] = [];

  // Data Role
  paymentTitle: string = 'Payment Estimation';

  // Data Loading
  isLoading: boolean = true;

  pieLabels: string[] = [
    StatusTimesheets.APPROVED,
    StatusTimesheets.REJECTED,
    StatusTimesheets.PENDING,
  ];

  month: string = new Date().toLocaleString('default', { month: 'long' });

  constructor(private readonly summaryService: SummaryService) {}

  ngOnInit() {
    this.summaryService.getSummary().subscribe((response) => {
      this.timesheets = response.data;
      this.isLoading = false;
      this.recentTimesheets = this.getRecentTimesheets();
    });
    this.paymentTitle =
      this.summaryService.role === Roles.USER
        ? 'Overtime Bonus'
        : this.paymentTitle;
    this.getPieChart();
  }

  private getRecentTimesheets() {
    return this.timesheets.slice(0, 3);
  }

  private getPieChart() {
    const pieDocumentStyle = getComputedStyle(document.documentElement);
    const pieTextColor = pieDocumentStyle.getPropertyValue('--text-color');
    this.pieOptions = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: pieTextColor,
          },
        },
      },
    };

    this.summaryService.getMonthReport().subscribe({
      next: ({ data }) => {
        const getDataCounts = (data: Timesheet[]) => {
          if (!data || data.length === 0) return [0, 0, 0];
          let approvedCount = 0;
          let rejectedCount = 0;
          let pendingCount = 0;
          this.total = data.reduce(
            (acc, timesheet) => acc + timesheet.total,
            0
          );
          this.submission = data.length;
          this.submissionItems = data.reduce(
            (acc, timesheet) => acc + timesheet.timeSheetDetails.length,
            0
          );

          data.forEach((element) => {
            switch (element.status) {
              case StatusTimesheets.APPROVED:
                approvedCount += 1;
                break;
              case (StatusTimesheets.REJECTED, StatusTimesheets.DENIED):
                rejectedCount += 1;
                break;
              default:
                pendingCount += 1;
                break;
            }
          });
          return [approvedCount, rejectedCount, pendingCount];
        };
        this.pieData = {
          labels: this.pieLabels.map((label) => label.toUpperCase()),
          datasets: [
            {
              data: getDataCounts(data),
              backgroundColor: [
                pieDocumentStyle.getPropertyValue('--green-500'),
                pieDocumentStyle.getPropertyValue('--red-500'),
                pieDocumentStyle.getPropertyValue('--blue-500'),
              ],
              hoverBackgroundColor: [
                pieDocumentStyle.getPropertyValue('--green-400'),
                pieDocumentStyle.getPropertyValue('--red-400'),
                pieDocumentStyle.getPropertyValue('--blue-400'),
              ],
            },
          ],
        };
      },
      error(err) {
        return err;
      },
    });
  }
}
