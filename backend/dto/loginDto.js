const { z } = require('zod');

/**
 * Zod Runtime Type-Contract Schemas for Authentication Controllers
 * Defense-in-Depth for CWE-943 (NoSQL Operator Query Injection)
 * Enforces strict primitive types, rejecting any nested query selector objects (e.g., {"$gt": ""})
 */

const adminLoginSchema = z.object({
    email: z
        .string({
            required_error: 'Email is required',
            invalid_type_error: 'Email must be a string',
        })
        .trim()
        .min(1, 'Email cannot be empty'),
    password: z
        .string({
            required_error: 'Password is required',
            invalid_type_error: 'Password must be a string',
        })
        .min(1, 'Password cannot be empty'),
});

const studentLoginSchema = z.object({
    studentName: z
        .string({
            required_error: 'Student name is required',
            invalid_type_error: 'Student name must be a string',
        })
        .trim()
        .min(1, 'Student name cannot be empty'),
    rollNum: z.union(
        [
            z
                .number({ invalid_type_error: 'Roll number must be a number' })
                .int('Roll number must be an integer')
                .positive('Roll number must be a positive integer')
                .finite('Roll number must be a finite number'),
            z
                .string({ invalid_type_error: 'Roll number must be a number' })
                .trim()
                .regex(/^[1-9]\d*$/, 'Roll number must be a positive integer')
                .transform((val) => Number(val))
                .pipe(
                    z
                        .number({ invalid_type_error: 'Roll number must be a number' })
                        .int('Roll number must be an integer')
                        .positive('Roll number must be a positive integer')
                        .finite('Roll number must be a finite number')
                ),
        ],
        {
            required_error: 'Roll number is required',
            invalid_type_error: 'Roll number must be a valid number',
        }
    ),
    password: z
        .string({
            required_error: 'Password is required',
            invalid_type_error: 'Password must be a string',
        })
        .min(1, 'Password cannot be empty'),
});

const teacherLoginSchema = z.object({
    email: z
        .string({
            required_error: 'Email is required',
            invalid_type_error: 'Email must be a string',
        })
        .trim()
        .min(1, 'Email cannot be empty'),
    password: z
        .string({
            required_error: 'Password is required',
            invalid_type_error: 'Password must be a string',
        })
        .min(1, 'Password cannot be empty'),
});

/**
 * Validate incoming request body against a Zod schema.
 * Sends a standardized 400 Bad Request if validation fails.
 * @returns {object|null} Validated data if successful, null if failed.
 */
const validateLoginBody = (schema, body, res) => {
    const result = schema.safeParse(body);
    if (!result.success) {
        const firstIssue = result.error.issues[0];
        const errorMessage = firstIssue
            ? `${firstIssue.path.join('.') || 'Payload'}: ${firstIssue.message}`
            : 'Invalid login credentials payload';
        res.status(400).json({
            message: errorMessage,
            code: 'VALIDATION_ERROR',
            errors: result.error.flatten().fieldErrors,
        });
        return null;
    }
    return result.data;
};

module.exports = {
    adminLoginSchema,
    studentLoginSchema,
    teacherLoginSchema,
    validateLoginBody,
};
