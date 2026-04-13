import { badRequest } from "../utils/errors.js";

export function validateEmail(email) {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!ok) throw badRequest("Invalid email format", { field: "email" });
}

export function validatePassword(pw) {
    if (!pw || pw.length < 6) throw badRequest("Password must be at least 6 characters", { field: "password" });
}

export function validateGender(g) {
    const allowed = ["Male", "Female", "Other"];
    if (!allowed.includes(g)) throw badRequest("Gender must be Male, Female, or Other", { field: "gender" });
}

export function validateSalary(s) {
    if (typeof s !== "number" || s < 1000) throw badRequest("Salary must be a number >= 1000", { field: "salary" });
}
