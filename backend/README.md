# COMP3133 ASSIGNMENT 1
## Maddox Duggan
## 101483006

## Overview
This assignment creates a backend API that supports basic CRUD operations, as well as input validation
and JWT authentication. To create this assignment, I used the below tech stack:
- MongoDB Atlas
- NodeJS
- Express
- Apollo Server/GraphQL
- JWT
- Cloudinary (although it did not work for me)

# Collections:
- **users**
    - username (unique)
    - email (unique)
    - password (hashed)
    - created_at, updated_at
- **employees**
    - first_name, last_name, email, gender, designation
    - salary (min: 1000)
    - date_of_joining, department
    - employee_photo (Cloudinary URL)
    - created_at, updated_at