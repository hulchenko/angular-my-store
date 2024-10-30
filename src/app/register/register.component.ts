import { Component, inject } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { first, timer } from "rxjs";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrl: "./register.component.css",
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  auth = inject(AuthService);
  router = inject(Router);

  form = this.fb.nonNullable.group({
    email: ["", Validators.required],
    password: ["", Validators.required],
  });
  formError: string | null = null;

  onSubmit() {
    const { email, password } = this.form.getRawValue();
    this.auth.userRegister(email, password).subscribe({
      next: () =>
        timer(200)
          .pipe(first())
          .subscribe(() => this.router.navigateByUrl("/products")),
      error: (err) => (this.formError = err.code),
    });
  }
}
