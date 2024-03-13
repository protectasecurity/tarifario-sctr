import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ClassInMemoryProvider } from '../../shared/inmemory-db/class-in-memory.provider';
import { MaterialModule } from '../../shared/modules/material.module';
import { ClassService } from '../../shared/services/class/class.service';
import { FileExportService } from '../../shared/services/file.export.service';
import { TypeTokenServices } from '../../shared/services/typeToken.services';
import { UseClassService } from "../../shared/services/use-class/use-class.service";
import { UseService } from '../../shared/services/use/use.service';
import { ChannelRestrictionRoutes } from './channel-restriction.routing';
import { ChannelAgentComponent } from './components/channel/channel-agent/channel-agent.component';
import { CreateChannelDialogComponent } from './components/channel/create-channel-dialog/create-channel-dialog.component';
import { ListChannelComponent } from './components/channel/list-channel/list-channel.component';
import { ClassComponent } from './components/restriction/class/class.component';
import { CreateRestrictionDialogComponent } from './components/restriction/create-restriction-dialog/create-restriction-dialog.component';
import { EditRestrictionDialogComponent } from './components/restriction/edit-restriction-dialog/edit-restriction-dialog.component';
import { ListRestrictionComponent } from './components/restriction/list-restriction/list-restriction.component';
import { UseComponent } from './components/restriction/use/use.component';
import { ManageRestrictionComponent } from './container/manage-restriction/manage-restriction.component';
import { ManageSingleChannelComponent } from './container/manage-single-channel/manage-single-channel.component';
import { AgentService } from './services/agent.service';
import { RestrictionService } from './services/restriction.service';
import { ChannelRestrictionEffects } from './state/effects/channel.restriction.effects';
import { reducers } from './state/reducers/index';

@NgModule({
	declarations: [
		ChannelAgentComponent,
		CreateChannelDialogComponent,
		CreateRestrictionDialogComponent,
		EditRestrictionDialogComponent,
		ListChannelComponent,
		ListRestrictionComponent,
		ManageSingleChannelComponent,
		ManageRestrictionComponent,
		ClassComponent,
		UseComponent,
		ManageSingleChannelComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MaterialModule,
		FlexLayoutModule,
		RouterModule.forChild(ChannelRestrictionRoutes),
		StoreModule.forFeature('channel-restriction', reducers),
		EffectsModule.forFeature([ChannelRestrictionEffects])
	],
	providers: [AgentService, RestrictionService, UseService, ClassService, ClassInMemoryProvider, FileExportService, TypeTokenServices, UseClassService],
	entryComponents: [CreateChannelDialogComponent, CreateRestrictionDialogComponent, EditRestrictionDialogComponent]
})
export class ChannelRestrictionModule { }
