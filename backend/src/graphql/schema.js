import { gql } from "apollo-server-express";

export default gql`
  scalar Date

  type User {
    _id: ID!
    username: String!
    email: String!
    created_at: Date
    updated_at: Date
  }

  type AuthPayload {
    message: String!
    token: String
    user: User
  }

  type Employee {
    _id: ID!
    first_name: String!
    last_name: String!
    email: String!
    gender: String!
    designation: String!
    salary: Float!
    date_of_joining: Date!
    department: String!
    employee_photo: String
    created_at: Date
    updated_at: Date
  }

  input SignupInput {
    username: String!
    email: String!
    password: String!
  }

  input LoginInput {
    usernameOrEmail: String!
    password: String!
  }

  input AddEmployeeInput {
    first_name: String!
    last_name: String!
    email: String!
    gender: String!
    designation: String!
    salary: Float!
    date_of_joining: Date!
    department: String!
    employee_photo_base64: String
  }

  input UpdateEmployeeInput {
    first_name: String
    last_name: String
    email: String
    gender: String
    designation: String
    salary: Float
    date_of_joining: Date
    department: String
    employee_photo_base64: String
  }

  type Query {
    login(input: LoginInput!): AuthPayload!
    getAllEmployees: [Employee!]!
    searchEmployeeByEid(eid: ID!): Employee!
    searchEmployeesByDesignationOrDepartment(
      designation: String
      department: String
    ): [Employee!]!
  }

  type Mutation {
    signup(input: SignupInput!): AuthPayload!
    addEmployee(input: AddEmployeeInput!): Employee!
    updateEmployeeByEid(eid: ID!, input: UpdateEmployeeInput!): Employee!
    deleteEmployeeByEid(eid: ID!): String!
  }
`;