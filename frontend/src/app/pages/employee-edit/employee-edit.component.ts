import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../core/services/employee.service';

@Component({
  selector: 'app-employee-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-edit.component.html'
})
export class EmployeeEditComponent implements OnInit {
  employeeId = '';
  loading = false;
  errorMessage = '';
  selectedBase64: string | null = null;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['Male', Validators.required],
      designation: ['', Validators.required],
      salary: [1000, [Validators.required]],
      date_of_joining: ['', Validators.required],
      department: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.employeeId = this.route.snapshot.paramMap.get('id') || '';

    if (!this.employeeId) {
      this.errorMessage = 'No employee ID found in route.';
      this.loading = false;
      return;
    }

    this.loadEmployee();
  }

  loadEmployee() {
    this.loading = true;
    this.errorMessage = '';

    this.employeeService.getEmployeeById(this.employeeId).subscribe({
      next: (emp) => {
        if (!emp) {
          this.errorMessage = 'Employee not found.';
          this.loading = false;
          return;
        }

        this.form.patchValue({
          first_name: emp.first_name,
          last_name: emp.last_name,
          email: emp.email,
          gender: emp.gender,
          designation: emp.designation,
          salary: emp.salary,
          date_of_joining: this.formatDate(emp.date_of_joining),
          department: emp.department
        });

        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.message || 'Failed to load employee';
      }
    });
  }

  formatDate(dateValue: string) {
    const d = new Date(dateValue);
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  }

  onFileChange(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.selectedBase64 = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const input: any = {
      ...this.form.value,
      salary: Number(this.form.value.salary)
    };

    if (this.selectedBase64) {
      input.employee_photo_base64 = this.selectedBase64;
    }

    this.loading = true;
    this.errorMessage = '';

    this.employeeService.updateEmployee(this.employeeId, input).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/employees']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.message || 'Update failed';
      }
    });
  }
}
