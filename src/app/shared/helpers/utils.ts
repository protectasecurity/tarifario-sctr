function getIndexBy(array: Array<{}>, { name, value }): number {
	for (let i = 0; i < array.length; i++) {
		if (array[i][name] === value) {
			return i;
		}
	}
	return -1;
}

function sortArray(array, property, direction) {
	array.sort(function compare(a, b) {
		let comparison = 0;
		if (a[property] > b[property]) {
			comparison = 1 * direction;
		} else if (a[property] < b[property]) {
			comparison = -1 * direction;
		}
		return comparison;
	});
	return array; // Chainable
}

function arrayMove(arr, fromIndex, toIndex) {
	const element = arr[fromIndex];
	arr.splice(fromIndex, 1);
	arr.splice(toIndex, 0, element);
}

function sortArrayByProperty(prop, arr) {
	prop = prop.split('.');
	const len = prop.length;

	arr.sort(function (a, b) {
		let i = 0;
		let key;

		while (i < len) {
			key = prop[i];

			if (!a.hasOwnProperty(key)) {
				return 1;
			}
			if (!b.hasOwnProperty(key)) {
				return -1;
			}

			a = a[key];
			b = b[key];
			i++;
		}
		if (a < b) {
			return -1;
		} else if (a > b) {
			return 1;
		} else {
			return 0;
		}
	});
	return arr;
}

export { getIndexBy, arrayMove, sortArrayByProperty, sortArray };
