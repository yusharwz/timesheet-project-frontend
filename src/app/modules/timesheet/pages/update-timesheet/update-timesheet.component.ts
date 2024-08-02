import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TimesheetService } from '../../services/timesheet.service';
import { Overtime, Timesheet } from '../../model/timesheet';
import { OvertimeUpdateService } from '../../services/overtime-update.service';
import { EditComponent } from '../../components/edit-form/edit.component';
import { UpdateButtonComponent } from '../../components/update-button/update-button.component';
import { TotalPayComponent } from '../../components/total-pay/total-pay.component';
import { FormComponent } from '../../components/form/form.component';
import { ListComponent } from '../../components/list/list.component';
import { LoadingComponent } from '../../components/loading/loading.component';

@Component({
  selector: 'app-update-timesheet',
  standalone: true,
  imports: [
    EditComponent,
    UpdateButtonComponent,
    TotalPayComponent,
    FormComponent,
    ListComponent,
    LoadingComponent,
  ],
  templateUrl: './update-timesheet.component.html',
  styleUrls: ['./update-timesheet.component.scss'],
})
export class UpdateTimesheetComponent implements OnInit {
  private readonly updateService = inject(OvertimeUpdateService);
  private readonly timesheetService = inject(TimesheetService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  timesheetId: number = 0;
  overtimeForm: Overtime[] = [];
  totalPay: number = 0;
  isLoading: boolean = true;

  ngOnInit(): void {
    this.route.params.subscribe({
      next: (params) => {
        this.timesheetId = +params['id'];
        this.fetchAndInitData();
      },
    });
  }

  fetchAndInitData(): void {
    this.timesheetService.GetTimsheetById(this.timesheetId).subscribe({
      next: (response: Timesheet) => {
        if (response) {
          this.updateService.GetWorks(response.works).subscribe({
            next: () => {
              this.updateService.List().subscribe((works) => {
                this.overtimeForm = works;
                this.getTotal();
              });
              this.isLoading = false;
            },
            error: (err) => console.error('Error adding works', err),
          });
        }
      },
      error: (err) => {
        console.error('Error fetching timesheet', err);
        this.router.navigate(['errors/404']);
      },
    });
  }

  getTotal(): void {
    this.updateService.getTotalPay().subscribe((total) => {
      this.totalPay = total;
    });
  }

  remove(id: number): void {
    this.updateService.Delete(id).subscribe(() => {});
  }
}
