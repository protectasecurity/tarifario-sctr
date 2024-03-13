import { SubGroups } from 'app/shared/models/class.model';
import { RiskGroupDetailComponent } from 'app/views/risk-group/components/risk-group-detail/risk-group-detail.component';
import * as Handsontable from 'handsontable';

function headerRenderer(instance, td, row, col, prop, value, cellProperties) {
	Handsontable.renderers.TextRenderer.apply(this, arguments);
	td.style.fontWeight = 'bold';
	td.style.color = '#2b0d61';
	td.style.verticalAlign = 'middle';
	td.style.backgroundColor = '#F1F1F1';

	if (cellProperties.prop === 'description') {
		// td.innerHTML = value.description;
		td.innerHTML = '<div title="' + value.fullDescription + '">' + value.description + '</div>';
	}
}

function firstRowRenderer(instance, td, row, col, prop, value, cellProperties) {
	Handsontable.renderers.TextRenderer.apply(this, arguments);
	const col_count = instance.countCols();
	td.style.fontWeight = 'bold';
	td.style.color = '#000000';
	td.style.background = 'YELLOW';
}

function percentRenderer(instance, td, row, col, prop, value, cellProperties) {
	Handsontable.renderers.NumericRenderer.apply(this, arguments);
	if (!value || value === '') {
		td.innerHTML = '0.00';
		value = 0;
	}
	td.style.verticalAlign = 'middle';
	td.style.textAlign = 'right';
	td.style.color = value > 0 ? '#2b0d61' : '#E2E2E2';
	td.style.backgroundColor = value > 0 ? '#ffffff' : '#E2E2E2';
}

export { headerRenderer, firstRowRenderer, percentRenderer };
