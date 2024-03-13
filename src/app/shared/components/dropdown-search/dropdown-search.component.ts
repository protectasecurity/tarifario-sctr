import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	EventEmitter,
	forwardRef,
	Inject,
	Input,
	OnDestroy,
	OnInit,
	QueryList,
	ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatOption, MatSelect } from '@angular/material';
import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

@Component({
	selector: 'mat-dropdown-search',
	templateUrl: './dropdown-search.component.html',
	styleUrls: ['./dropdown-search.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => DropDownSearchComponent),
			multi: true
		}
	],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropDownSearchComponent implements OnInit, OnDestroy, AfterViewInit, ControlValueAccessor {
	public _options: QueryList<MatOption>;
	private previousSelectedValues: any[];
	private overlayClassSet = false;
	private change = new EventEmitter<string>();
	private _onDestroy = new Subject<void>();

	@Input() placeholderLabel = '>> Buscar';
	@Input() noEntriesFoundLabel = 'No se encontró coincidencias';

	@ViewChild('searchSelectInput', { read: ElementRef }) searchSelectInput: ElementRef;

	get value(): string {
		return this._value;
	}
	private _value: string;

	onChange: Function = (_: any) => {};
	onTouched: Function = (_: any) => {};

	constructor(@Inject(MatSelect) public matSelect: MatSelect, private changeDetectorRef: ChangeDetectorRef) {}

	ngOnInit() {
		const panelClass = 'mat-select-search-panel';
		if (this.matSelect.panelClass) {
			if (Array.isArray(this.matSelect.panelClass)) {
				this.matSelect.panelClass.push(panelClass);
			} else if (typeof this.matSelect.panelClass === 'string') {
				this.matSelect.panelClass = [this.matSelect.panelClass, panelClass];
			} else if (typeof this.matSelect.panelClass === 'object') {
				this.matSelect.panelClass[panelClass] = true;
			}
		} else {
			this.matSelect.panelClass = panelClass;
		}

		this.matSelect.openedChange.pipe(takeUntil(this._onDestroy)).subscribe(opened => {
			if (opened) {
				this._focus();
			} else {
				this._reset();
			}
		});

		this.matSelect.openedChange
			.pipe(take(1))
			.pipe(takeUntil(this._onDestroy))
			.subscribe(() => {
				this._options = this.matSelect.options;
				this._options.changes.pipe(takeUntil(this._onDestroy)).subscribe(() => {
					const keyManager = this.matSelect._keyManager;
					if (keyManager && this.matSelect.panelOpen) {
						setTimeout(() => {
							keyManager.setFirstItemActive();
						});
					}
				});
			});
		this.change.pipe(takeUntil(this._onDestroy)).subscribe(() => {
			this.changeDetectorRef.detectChanges();
		});
		this.initMultipleHandling();
	}

	ngOnDestroy() {
		this._onDestroy.next();
		this._onDestroy.complete();
	}

	ngAfterViewInit() {
		this.setOverlayClass();
	}

	_handleKeydown(event: KeyboardEvent) {
		if (event.keyCode === 32) {
			event.stopPropagation();
		}
	}

	writeValue(value: string) {
		const valueChanged = value !== this._value;
		if (valueChanged) {
			this._value = value;
			this.change.emit(value);
		}
	}

	onInputChange(value) {
		const valueChanged = value !== this._value;
		if (valueChanged) {
			this._value = value;
			this.onChange(value);
			this.change.emit(value);
		}
	}

	onBlur(value: string) {
		this.writeValue(value);
		this.onTouched();
	}

	registerOnChange(fn: Function) {
		this.onChange = fn;
	}

	registerOnTouched(fn: Function) {
		this.onTouched = fn;
	}

	public _focus() {
		if (!this.searchSelectInput) {
			return;
		}
		const panel = this.matSelect.panel.nativeElement;
		const scrollTop = panel.scrollTop;
		this.searchSelectInput.nativeElement.focus();
		panel.scrollTop = scrollTop;
	}

	public _reset(focus?: boolean) {
		if (!this.searchSelectInput) {
			return;
		}
		this.searchSelectInput.nativeElement.value = '';
		this.onInputChange('');
		if (focus) {
			this._focus();
		}
	}

	private setOverlayClass() {
		if (this.overlayClassSet) {
			return;
		}
		const overlayClass = 'cdk-overlay-pane-select-search';
		this.matSelect.overlayDir.attach.pipe(takeUntil(this._onDestroy)).subscribe(() => {
			this.searchSelectInput.nativeElement.parentElement.parentElement.parentElement.parentElement.parentElement.classList.add(overlayClass);
		});

		this.overlayClassSet = true;
	}

	private initMultipleHandling() {
		this.matSelect.valueChange.pipe(takeUntil(this._onDestroy)).subscribe(values => {
			if (this.matSelect.multiple) {
				let restoreSelectedValues = false;
				if (this._value && this._value.length && this.previousSelectedValues && Array.isArray(this.previousSelectedValues)) {
					if (!values || !Array.isArray(values)) {
						values = [];
					}
					const optionValues = this.matSelect.options.map(option => option.value);
					this.previousSelectedValues.forEach(previousValue => {
						if (values.indexOf(previousValue) === -1 && optionValues.indexOf(previousValue) === -1) {
							values.push(previousValue);
							restoreSelectedValues = true;
						}
					});
				}

				if (restoreSelectedValues) {
					this.matSelect._onChange(values);
				}

				this.previousSelectedValues = values;
			}
		});
	}
}
