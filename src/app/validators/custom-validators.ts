import { AbstractControl, ValidationErrors } from '@angular/forms';

export function futureDateValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // input[type="date"] returns YYYY-MM-DD
  const [year, month, day] = control.value.split('-').map(Number);
  const selectedDate = new Date(year, month - 1, day);
  return selectedDate < today ? { pastDate: true } : null;
}

export function futureDateTimeValidator(group: AbstractControl): ValidationErrors | null {
  const dateControl = group.get('date');
  const timeControl = group.get('time');

  if (!dateControl || !timeControl || !dateControl.value || !timeControl.value) {
    return null;
  }

  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  const [year, month, day] = dateControl.value.split('-').map(Number);
  const selectedDate = new Date(year, month - 1, day);

  //check if date is today
  if (selectedDate.getTime() === todayDate.getTime()) {
    const now = new Date();
    const [hours, minutes] = timeControl.value.split(':').map(Number);

    const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();
    const selectedTotalMinutes = hours * 60 + minutes;

    if (selectedTotalMinutes < currentTotalMinutes) {
      return { pastTime: true };
    }
  }

  return null;
}

export function expiryDateValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }

  const match = control.value.match(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/);
  if (!match) {
    return null;
  }

  const month = parseInt(match[1], 10);
  const year = parseInt(match[2], 10);

  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;

  if (year < currentYear) {
    return { pastExpiryDate: true };
  }

  if (year === currentYear && month < currentMonth) {
    return { pastExpiryDate: true };
  }

  return null;
}

export function noAlphabetsValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }
  const hasAlphabets = /[a-zA-Z]/.test(control.value);
  return hasAlphabets ? { containsAlphabets: true } : null;
}
