import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { CreateTimesheetComponent } from '../timesheet/pages/create-timesheet/create-timesheet.component';
import { UpdateTimesheetComponent } from '../timesheet/pages/update-timesheet/update-timesheet.component';
import { ListTimesheetComponent } from '../timesheet/pages/list-timesheet/list-timesheet.component';
import { DetailTimesheetComponent } from '../timesheet/pages/detail-timesheet/detail-timesheet.component';
import { TestComponent } from '../timesheet/components/test/test.component';
import { ActivationComponent } from "../auth/pages/activation/activation.component";
import { AuthService } from "../auth/services/auth.service";

const routes: Routes = [
  {
    path: "dashboard",
    component: LayoutComponent,
    loadChildren: () =>
      import('../dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: "users",
    component: LayoutComponent,
    loadChildren: () =>
      import("../dashboard/dashboard.module").then((m) => m.DashboardModule),
  },
  {
    path: "works",
    component: LayoutComponent,
    loadChildren: () =>
      import("../dashboard/dashboard.module").then((m) => m.DashboardModule),
  },
  {
    path: "timesheets",
    component: LayoutComponent,
    children: [
      { path: 'create', component: TestComponent },
      // { path: 'create', component: CreateTimesheetComponent },
      { path: 'list', component: ListTimesheetComponent },
      { path: 'view/:id', component: DetailTimesheetComponent },
      { path: 'update/:id', component: UpdateTimesheetComponent },
    ],
  },
  {
    path: 'approvals',
    component: LayoutComponent,
    loadChildren: () => import('../approval/approval.module').then((m) => m.ApprovalModule),
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'error/404' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
