import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EmployeeService } from '../../core/services/employee.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './employee-list.component.html'
})
export class EmployeeListComponent implements OnInit {
  employees: any[] = [];
  loading = false;
  errorMessage = '';

  designation = '';
  department = '';

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees() {
    this.loading = true;
    this.errorMessage = '';

    this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
        this.employees = data || [];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.employees = [];
        this.errorMessage = err?.message || 'Failed to load employees';
      }
    });
  }

  searchEmployees() {
    if (!this.designation && !this.department) {
      this.loadEmployees();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.employeeService.searchEmployees(
      this.designation || undefined,
      this.department || undefined
    ).subscribe({
      next: (data) => {
        this.employees = data || [];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.employees = [];
        this.errorMessage = err?.message || 'Search failed';
      }
    });
  }

  resetSearch() {
    this.designation = '';
    this.department = '';
    this.loadEmployees();
  }

  deleteEmployee(id: string) {
    const ok = confirm('Are you sure you want to delete this employee?');
    if (!ok) return;

    this.employeeService.deleteEmployee(id).subscribe({
      next: () => this.loadEmployees(),
      error: (err) => {
        alert(err?.message || 'Delete failed');
      }
    });
  }
}
