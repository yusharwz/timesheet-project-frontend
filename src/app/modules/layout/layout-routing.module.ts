import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LayoutComponent } from "./layout.component";
import { ActivationComponent } from "../auth/pages/activation/activation.component";
import { AuthService } from "../auth/services/auth.service";
import { UserComponent } from "../user/user.component";

const routes: Routes = [
  {
    path: "dashboard",
    component: LayoutComponent,
    loadChildren: () =>
      import("../dashboard/dashboard.module").then((m) => m.DashboardModule),
  },
  {
    path: "users",
    component: LayoutComponent,
    children: [
      {
        path: "",
        component: UserComponent
      },
    ],
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
    loadChildren: () =>
      import("../dashboard/dashboard.module").then((m) => m.DashboardModule),
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
