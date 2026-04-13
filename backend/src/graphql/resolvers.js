import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";

import User from "../models/User.js";
import Employee from "../models/Employee.js";

import { badRequest, notFound, unauthorized } from "../utils/errors.js";
import {
    validateEmail,
    validatePassword,
    validateGender,
    validateSalary
} from "./validators.js";

async function uploadBase64ToCloudinary(base64, folder = "comp3133_employees") {
    if (!base64) return null;

    if (!base64.startsWith("data:image/")) {
        throw badRequest("employee_photo_base64 must be a valid base64 image data URL", {
            example: "data:image/png;base64,iVBORw0KGgoAAA..."
        });
    }

    const res = await cloudinary.uploader.upload(base64, {
        folder,
        resource_type: "image"
    });

    return res.secure_url;
}

function requireAuth(ctx) {
    if (!ctx.user) {
        throw unauthorized("JWT missing/invalid. Please login and send Authorization: Bearer <token>.");
    }
}

export default {
    Query: {
        async login(_, { input }) {
            const { usernameOrEmail, password } = input;

            if (!usernameOrEmail || !password) {
                throw badRequest("usernameOrEmail and password are required");
            }

            const user =
                (await User.findOne({ username: usernameOrEmail })) ||
                (await User.findOne({ email: usernameOrEmail }));

            if (!user) throw unauthorized("Invalid credentials");

            const ok = await bcrypt.compare(password, user.password);
            if (!ok) throw unauthorized("Invalid credentials");

            const token = jwt.sign(
                {
                    userId: user._id.toString(),
                    username: user.username,
                    email: user.email
                },
                process.env.JWT_SECRET,
                { expiresIn: "2h" }
            );

            return {
                message: "Login successful",
                token,
                user
            };
        },

        async getAllEmployees(_, __, ctx) {
            requireAuth(ctx);
            return Employee.find().sort({ created_at: -1 });
        },

        async searchEmployeeByEid(_, { eid }, ctx) {
            requireAuth(ctx);

            const emp = await Employee.findById(eid);
            if (!emp) throw notFound("Employee not found for given eid");

            return emp;
        },

        async searchEmployeesByDesignationOrDepartment(_, { designation, department }, ctx) {
            requireAuth(ctx);

            if (!designation && !department) {
                throw badRequest("Provide designation or department (at least one)");
            }

            const filter = {};

            if (designation) {
                filter.designation = { $regex: designation, $options: "i" };
            }

            if (department) {
                filter.department = { $regex: department, $options: "i" };
            }

            return Employee.find(filter).sort({ created_at: -1 });
        }
    },

    Mutation: {
        async signup(_, { input }) {
            const { username, email, password } = input;

            if (!username) throw badRequest("username is required");
            validateEmail(email);
            validatePassword(password);

            const existingUser = await User.findOne({
                $or: [{ username }, { email }]
            });

            if (existingUser) {
                throw badRequest("Username or email already exists");
            }

            const hashed = await bcrypt.hash(password, 10);

            const user = await User.create({
                username,
                email,
                password: hashed
            });

            const token = jwt.sign(
                {
                    userId: user._id.toString(),
                    username: user.username,
                    email: user.email
                },
                process.env.JWT_SECRET,
                { expiresIn: "2h" }
            );

            return {
                message: "Signup successful",
                token,
                user
            };
        },

        async addEmployee(_, { input }, ctx) {
            requireAuth(ctx);

            validateEmail(input.email);
            validateGender(input.gender);
            validateSalary(input.salary);

            const exists = await Employee.findOne({ email: input.email });
            if (exists) throw badRequest("Employee email already exists");

            const photoUrl = await uploadBase64ToCloudinary(input.employee_photo_base64);

            const emp = await Employee.create({
                first_name: input.first_name,
                last_name: input.last_name,
                email: input.email,
                gender: input.gender,
                designation: input.designation,
                salary: input.salary,
                date_of_joining: input.date_of_joining,
                department: input.department,
                employee_photo: photoUrl
            });

            return emp;
        },

        async updateEmployeeByEid(_, { eid, input }, ctx) {
            requireAuth(ctx);

            const emp = await Employee.findById(eid);
            if (!emp) throw notFound("Employee not found for given eid");

            if (input.email) validateEmail(input.email);
            if (input.gender) validateGender(input.gender);
            if (typeof input.salary === "number") validateSalary(input.salary);

            if (input.employee_photo_base64) {
                const photoUrl = await uploadBase64ToCloudinary(input.employee_photo_base64);
                emp.employee_photo = photoUrl;
            }

            const fields = [
                "first_name",
                "last_name",
                "email",
                "gender",
                "designation",
                "salary",
                "date_of_joining",
                "department"
            ];

            for (const f of fields) {
                if (input[f] !== undefined && input[f] !== null) {
                    emp[f] = input[f];
                }
            }

            await emp.save();
            return emp;
        },

        async deleteEmployeeByEid(_, { eid }, ctx) {
            requireAuth(ctx);

            const emp = await Employee.findById(eid);
            if (!emp) throw notFound("Employee not found for given eid");

            await Employee.deleteOne({ _id: eid });
            return "Employee deleted successfully";
        }
    }
};