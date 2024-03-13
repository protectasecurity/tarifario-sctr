import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { MaterialModule } from 'app/shared/modules/material.module';
import { FileExportService } from "../../shared/services/file.export.service";
import { FeeService } from './../fee/fee.service';
import { ManageChannelAgentTkComponent } from "./components/manage-channel-agent/manage-channel-agent-tk.component";
import { ManageChannelAgentComponent } from './components/manage-channel-agent/manage-channel-agent.component';
import { ManageChannelCreateDetailComponent } from './components/manage-channel-create-detail/manage-channel-create-detail.component';
import { ManageChannelCreatePopupDetailTkComponent } from "./components/manage-channel-create-popup-detail/manage-channel-create-popup-detail-tk.component";
import { ManageChannelCreatePopupDetailComponent } from './components/manage-channel-create-popup-detail/manage-channel-create-popup-detail.component';
import { ManageChannelListComponent } from './components/manage-channel-list/manage-channel-list.component';
import { ManageChannelCreatePopupComponent } from './container/manage-channel-create-popup/manage-channel-create-popup.component';
import { ManageChannelCreatePopupTkComponent } from "./container/manage-channel-create-popup/manage-channel-create-popup.tk.component";
import { ManageChannelCreateComponent } from './container/manage-channel-create/manage-channel-create.component';

import { ClassInMemoryProvider } from '../../shared/inmemory-db/class-in-memory.provider';
import { ClassService } from '../../shared/services/class/class.service';
import { UseService } from '../../shared/services/use/use.service';
import { ManageChannelComponent } from './container/manage-channel/manage-channel.component';
import { ManageChannelRoutes } from './manage-channel.routing';
import { AgentKtVisible } from "./services/agent.kt.visible";
import { AgentService } from './services/agent.service';
import { ChannelService } from './services/channel.service';
import { ChannelEffects } from './state/effects/channel.effects';
import { reducers } from './state/reducers';





@NgModule({
	declarations: [
		ManageChannelComponent,
		ManageChannelListComponent,
		ManageChannelCreateComponent,
		ManageChannelCreatePopupComponent,
		ManageChannelCreatePopupTkComponent,
		ManageChannelCreatePopupDetailComponent,
		ManageChannelCreatePopupDetailTkComponent,
		ManageChannelAgentComponent,
		ManageChannelAgentTkComponent,
		ManageChannelCreateDetailComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MaterialModule,
		FlexLayoutModule,
		RouterModule.forChild(ManageChannelRoutes),
		StoreModule.forFeature('channel', reducers),
		EffectsModule.forFeature([ChannelEffects])
	],
	providers: [UseService, ClassService, ClassInMemoryProvider, ChannelService, FeeService, AgentService, AgentKtVisible, FileExportService],
	entryComponents: [ManageChannelCreatePopupComponent, ManageChannelCreatePopupTkComponent]
})
export class ManageChannelModule { }
