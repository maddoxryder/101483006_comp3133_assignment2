import { gql } from 'apollo-angular';

export const LOGIN_QUERY = gql`
  query Login($input: LoginInput!) {
    login(input: $input) {
      message
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

export const SIGNUP_MUTATION = gql`
  mutation Signup($input: SignupInput!) {
    signup(input: $input) {
      message
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

export const GET_ALL_EMPLOYEES = gql`
  query GetAllEmployees {
    getAllEmployees {
      _id
      first_name
      last_name
      email
      gender
      designation
      salary
      date_of_joining
      department
      employee_photo
    }
  }
`;

export const SEARCH_EMPLOYEE_BY_ID = gql`
  query SearchEmployeeByEid($eid: ID!) {
    searchEmployeeByEid(eid: $eid) {
      _id
      first_name
      last_name
      email
      gender
      designation
      salary
      date_of_joining
      department
      employee_photo
    }
  }
`;

export const SEARCH_EMPLOYEES = gql`
  query SearchEmployeesByDesignationOrDepartment($designation: String, $department: String) {
    searchEmployeesByDesignationOrDepartment(designation: $designation, department: $department) {
      _id
      first_name
      last_name
      email
      gender
      designation
      salary
      date_of_joining
      department
      employee_photo
    }
  }
`;

export const ADD_EMPLOYEE = gql`
  mutation AddEmployee($input: AddEmployeeInput!) {
    addEmployee(input: $input) {
      _id
      first_name
      last_name
      email
      designation
      department
      employee_photo
    }
  }
`;

export const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployeeByEid($eid: ID!, $input: UpdateEmployeeInput!) {
    updateEmployeeByEid(eid: $eid, input: $input) {
      _id
      first_name
      last_name
      email
      designation
      department
      employee_photo
    }
  }
`;

export const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployeeByEid($eid: ID!) {
    deleteEmployeeByEid(eid: $eid)
  }
`;
