import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  imports: [FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})
export class Contact {
  form = { name: '', email: '', subject: '', message: '' };
  submitted = false;

  onSubmit(): void {
    this.submitted = true;
    this.form = { name: '', email: '', subject: '', message: '' };
  }
}
