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
  error = false;
  loading = false;

  async onSubmit(): Promise<void> {
    this.loading = true;
    this.error = false;

    try {
      const response = await fetch('https://formspree.io/f/xaqvkvgp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name: this.form.name,
          email: this.form.email,
          subject: this.form.subject,
          message: this.form.message
        })
      });

      if (response.ok) {
        this.submitted = true;
        this.form = { name: '', email: '', subject: '', message: '' };
      } else {
        this.error = true;
      }
    } catch {
      this.error = true;
    }

    this.loading = false;
  }
}
