import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs';
import {
  GET_ALL_EMPLOYEES,
  SEARCH_EMPLOYEE_BY_ID,
  SEARCH_EMPLOYEES,
  ADD_EMPLOYEE,
  UPDATE_EMPLOYEE,
  DELETE_EMPLOYEE
} from '../../graphql/operations';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  constructor(private apollo: Apollo) {}

  getAllEmployees() {
    return this.apollo.query({
      query: GET_ALL_EMPLOYEES,
      fetchPolicy: 'network-only',
      errorPolicy: 'all'
    }).pipe(
      map((result: any) => {
        if (result.errors?.length) {
          throw new Error(result.errors[0].message);
        }
        return result.data?.getAllEmployees || [];
      })
    );
  }

  getEmployeeById(eid: string) {
    return this.apollo.query({
      query: SEARCH_EMPLOYEE_BY_ID,
      variables: { eid },
      fetchPolicy: 'network-only',
      errorPolicy: 'all'
    }).pipe(
      map((result: any) => {
        if (result.errors?.length) {
          throw new Error(result.errors[0].message);
        }
        return result.data?.searchEmployeeByEid || null;
      })
    );
  }

  searchEmployees(designation?: string, department?: string) {
    return this.apollo.query({
      query: SEARCH_EMPLOYEES,
      variables: { designation, department },
      fetchPolicy: 'network-only',
      errorPolicy: 'all'
    }).pipe(
      map((result: any) => {
        if (result.errors?.length) {
          throw new Error(result.errors[0].message);
        }
        return result.data?.searchEmployeesByDesignationOrDepartment || [];
      })
    );
  }

  addEmployee(input: any) {
    return this.apollo.mutate({
      mutation: ADD_EMPLOYEE,
      variables: { input },
      errorPolicy: 'all'
    }).pipe(
      map((result: any) => {
        if (result.errors?.length) {
          throw new Error(result.errors[0].message);
        }
        return result.data?.addEmployee;
      })
    );
  }

  updateEmployee(eid: string, input: any) {
    return this.apollo.mutate({
      mutation: UPDATE_EMPLOYEE,
      variables: { eid, input },
      errorPolicy: 'all'
    }).pipe(
      map((result: any) => {
        if (result.errors?.length) {
          throw new Error(result.errors[0].message);
        }
        return result.data?.updateEmployeeByEid;
      })
    );
  }

  deleteEmployee(eid: string) {
    return this.apollo.mutate({
      mutation: DELETE_EMPLOYEE,
      variables: { eid },
      errorPolicy: 'all'
    }).pipe(
      map((result: any) => {
        if (result.errors?.length) {
          throw new Error(result.errors[0].message);
        }
        return result.data?.deleteEmployeeByEid;
      })
    );
  }
}
