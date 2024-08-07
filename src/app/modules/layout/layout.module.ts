import {
    provideHttpClient,
    withFetch,
    withInterceptors,
    withInterceptorsFromDi,
} from "@angular/common/http";
import { NgModule } from "@angular/core";
import { AngularSvgIconModule } from "angular-svg-icon";

import { LayoutRoutingModule } from "./layout-routing.module";
import { AuthService } from "../auth/services/auth.service";
import { DashboardGuardService } from "../../core/guards/dashboard-guard.service";
@NgModule({
  imports: [LayoutRoutingModule, AngularSvgIconModule.forRoot()],
  providers: [provideHttpClient(withFetch(), withInterceptorsFromDi()), AuthService, DashboardGuardService],

})
export class LayoutModule {}
