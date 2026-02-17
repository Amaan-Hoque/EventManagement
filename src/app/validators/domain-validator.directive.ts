import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[appDomainValidator]',
  standalone: true,
  providers: [{ provide: NG_VALIDATORS, useExisting: DomainValidatorDirective, multi: true }],
})
export class DomainValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null;
    }
    //for @test.com domain
    if (!value.toLowerCase().endsWith('@test.com')) {
      return { domainInvalid: true };
    }
    return null;
  }
}
