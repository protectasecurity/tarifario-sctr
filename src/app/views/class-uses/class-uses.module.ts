import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { FileUploadModule } from "ng2-file-upload/ng2-file-upload";
import { ClassInMemoryProvider } from "../../shared/inmemory-db/class-in-memory.provider";
import { MaterialModule } from "../../shared/modules/material.module";
import { AppConfirmService } from "../../shared/services/app-confirm/app-confirm.service";
import { ClassService } from "../../shared/services/class/class.service";
import { FileExportService } from "../../shared/services/file.export.service";
import { UseClassService } from "../../shared/services/use-class/use-class.service";
import { UseService } from "../../shared/services/use/use.service";
import { UsesClaseEffect } from "./_state/effects/uses.clases.effects";
import { reducers } from "./_state/reducers";
import { ClassUsesRoutes } from "./class-uses.routing";
import { UseClassDetailComponent } from "./components/use-class-detail/use-class-detail.component";
import { UsesListComponent } from "./components/uses-list/uses-list-component";
import { ClassUsesComponent } from "./container/tab-uses-class/class-uses.component";
import { UseClassContainerComponent } from "./container/use-class-container/use-class-container.component";

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		FlexLayoutModule,
		NgxDatatableModule,
		FileUploadModule,
		MaterialModule,
		NgxDatatableModule,
		RouterModule.forChild(ClassUsesRoutes),
		StoreModule.forFeature('class-uses', reducers),
		EffectsModule.forFeature([UsesClaseEffect]),
	],
	providers: [UseService, ClassService, UseClassService, ClassInMemoryProvider, AppConfirmService, FileExportService],
	declarations: [ClassUsesComponent, UsesListComponent, UseClassContainerComponent, UseClassDetailComponent],
	entryComponents: [UseClassDetailComponent]
})
export class ClassUsesModule { }
