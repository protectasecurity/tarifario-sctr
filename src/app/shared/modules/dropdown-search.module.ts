import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DropDownSearchComponent } from '../components/dropdown-search/dropdown-search.component';
import { MaterialModule } from './material.module';

@NgModule({
	imports: [CommonModule, MaterialModule],
	declarations: [DropDownSearchComponent],
	exports: [DropDownSearchComponent]
})
export class DropDownSearchModule {}
