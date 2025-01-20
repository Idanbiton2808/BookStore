import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorsService {
  required = Validators.required;
  pattern = Validators.pattern;
  email = Validators.email;

  constructor() { }

  invalidUsernameMessage(form: FormGroup) {
    if(form.get('username')?.errors?.['required'])
      return "You must enter a username.";
    return null;
  }

  invalidPasswordMessage(form: FormGroup) {
    if(form.get('password')?.errors?.['required'])
      return "You must enter a password.";
    if(form.get('password')?.errors?.['pattern'])
      return "Password must contain at least 8 characters, including 1 big character, 1 digit and 1 special character.";
    return null;
  }

  invalidEmailMessage(form: FormGroup) {
    if(form.get('email')?.errors?.['required'])
      return "You must enter an email.";
    if(form.get('email')?.errors?.['email'])
      return "You must enter a valid email.";
    return null;
  }

  invalidNameMessage(form: FormGroup) {
    if(form.get('name')?.errors?.['required'])
      return "You must enter a name.";
    return null;
  }

  passwordMismatchMessage(form: FormGroup) {
    if(form.get('repeatPassword')?.errors?.['required'])
      return 'You must repeat the password.'
    if(form.get('password')?.value !== form.get('repeatPassword')?.value)
      return 'The two passwords must be identical.';
    return null;
  }

  invalidTitleMessage(form: FormGroup) {
    if(form.get('title')?.errors?.['required'])
      return "You must enter a title.";
    return null;
  }

  invalidImageMessage(form: FormGroup) {
    if(form.get('image')?.errors?.['required'])
      return "You must enter an image url.";
    return null;
  }

  invalidAuthorMessage(form: FormGroup) {
    if(form.get('author')?.errors?.['required'])
      return "You must enter an author.";
    return null;
  }

  invalidDescriptionMessage(form: FormGroup) {
    if(form.get('description')?.errors?.['required'])
      return "You must enter a description.";
    return null;
  }

  invalidPriceMessage(form: FormGroup) {
    if(form.get('price')?.errors?.['required'])
      return "You must enter a price.";
    return null;
  }
}
