import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[appPasswordMatch]',
  standalone: true,
  providers: [{ provide: NG_VALIDATORS, useExisting: PasswordMatchDirective, multi: true }],
})
export class PasswordMatchDirective implements Validator, OnChanges {
  @Input('appPasswordMatch') matchTo: string = '';

  private onChange: () => void = () => {};
  validate(control: AbstractControl): ValidationErrors | null {
    if (!control.value && !this.matchTo) {
      return null;
    }
    //if values do not match then return error
    return control.value === this.matchTo ? null : { passwordMismatch: true };
  }
  //register the callback function to call when validation is needed
  registerOnValidatorChange(fn: () => void): void {
    this.onChange = fn;
  }

  //this trigger re-validation when the input "matchTo"(the original password) changes
  ngOnChanges(changes: SimpleChanges): void {
    if ('matchTo' in changes) {
      this.onChange();
    }
  }
}
