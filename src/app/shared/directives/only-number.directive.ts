import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
	selector: '[OnlyNumber]'
})
export class OnlyNumberDirective {
	private regex: RegExp = new RegExp(/^[0-9]\d*$/);
	private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-'];
	constructor(private el: ElementRef) { }

	@HostListener('keydown', ['$event'])
	onKeyDown(event) {
		if (this.specialKeys.indexOf(event.key) !== -1) {
			return;
		}
		const current: string = this.el.nativeElement.value;
		const next: string = current.concat(event.key);
		if (next && !String(next).match(this.regex)) {
			event.preventDefault();
		}
	}
}
