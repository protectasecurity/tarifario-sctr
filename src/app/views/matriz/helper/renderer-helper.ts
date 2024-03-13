import * as Handsontable from 'handsontable';

function headerRenderer(instance, td, row, col, prop, value, cellProperties) {
	// tslint:disable-next-line:no-invalid-this
	Handsontable.renderers.TextRenderer.apply(this, arguments);
	td.style.fontWeight = 'bold';
	td.style.color = '#2b0d61';
	td.style.verticalAlign = 'middle';
	td.style.backgroundColor = '#F1F1F1';
}

function firstRowRenderer(instance, td, row, col, prop, value, cellProperties) {
	Handsontable.renderers.TextRenderer.apply(this, arguments);
	const col_count = instance.countCols();

	/* 	if (!value || value === '' || value == null) {
		for (let i = 0; i < col_count; i++) {
			//instance.setDataAtCell(0, i, 'new');
			if (row === 0 && col === i) {
				td.innerHTML = 'new';
			}
		}
	} */
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
	if (value < 0 ) {
		// add class "negative"
		td.style.color = '#f70c0c';
	}
	if (value > 0 ) {
		// add class "negative"
		td.style.color = '#2b0d61';
	}
	if (value === 0 ) {
		// add class "negative"
		td.style.color = '#E2E2E2';
	}
	/* td.innerHTML = '<button class="myBt bt-' + row + '" onclick="doIt()">' + value + '</button>'; */
	td.style.verticalAlign = 'middle';
	td.style.textAlign = 'right';
	//td.style.color = value > 0 ? '#2b0d61' : '#E2E2E2';

	/* 	if (/^\+?(0|[1-9]\d*)$/.test(value)) {
		td.style.color = 'ORANGE';
	} else {
		td.style.color = 'RED';
	} */

	td.style.backgroundColor = value != 0 ? '#ffffff' : '#E2E2E2';
}



export { headerRenderer, firstRowRenderer, percentRenderer };
