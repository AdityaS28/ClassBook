"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const prisma_1 = require("../prisma");
const zod_1 = require("zod");
const audit_1 = require("../services/audit");
const router = (0, express_1.Router)();
// Zod schemas
const createClassSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Class name is required"),
});
const createSessionSchema = zod_1.z.object({
    dateTime: zod_1.z.string().datetime({ message: "Invalid dateTime format" }),
    capacity: zod_1.z
        .number()
        .int()
        .positive({ message: "Capacity must be a positive integer" }),
});
// Create a class
router.post("/classes", auth_1.authenticate, (0, auth_1.authorizeRoles)("ADMIN"), async (req, res) => {
    try {
        const validated = createClassSchema.parse(req.body);
        const newClass = await prisma_1.prisma.class.create({
            data: { name: validated.name },
        });
        // Audit log
        await (0, audit_1.logAudit)(req.user.userId, "CREATE_CLASS", `Created class "${validated.name}"`);
        res.json(newClass);
    }
    catch (err) {
        return res.status(400).json({
            error: {
                code: "BAD_REQUEST",
                message: err.errors?.[0]?.message || err.message,
            },
        });
    }
});
// Get all classes (with optional sessions)
router.get("/get_classes", auth_1.authenticate, (0, auth_1.authorizeRoles)("ADMIN"), // You can remove this if you want all users to see classes
async (req, res) => {
    try {
        const classes = await prisma_1.prisma.class.findMany({
            include: {
                sessions: {
                    select: {
                        id: true,
                        dateTime: true,
                        capacity: true,
                    },
                },
            },
        });
        res.json(classes);
    }
    catch (err) {
        return res.status(500).json({
            error: {
                code: "INTERNAL_SERVER_ERROR",
                message: err.message,
            },
        });
    }
});
// Create a session for a class
router.post("/sessions", // removed :classId
auth_1.authenticate, (0, auth_1.authorizeRoles)("ADMIN"), async (req, res) => {
    try {
        // Update schema to match your payload
        const createSessionSchema = zod_1.z.object({
            classId: zod_1.z.string().min(1, "Class ID is required"),
            date: zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), {
                message: "Invalid date format",
            }),
            time: zod_1.z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
                message: "Invalid time format (HH:mm)",
            }),
            capacity: zod_1.z
                .number()
                .int()
                .positive({ message: "Capacity must be positive" }),
            instructor: zod_1.z.string().min(1, "Instructor name is required"),
        });
        const validated = createSessionSchema.parse(req.body);
        // Combine date and time into a single Date object
        const dateTime = new Date(`${validated.date}T${validated.time}:00`);
        const session = await prisma_1.prisma.session.create({
            data: {
                classId: Number(validated.classId),
                dateTime,
                capacity: validated.capacity,
            },
        });
        // Audit log
        await (0, audit_1.logAudit)(req.user.userId, "CREATE_SESSION", `Created session for class ${validated.classId} at ${dateTime.toISOString()}`);
        res.json(session);
    }
    catch (err) {
        return res.status(400).json({
            error: {
                code: "BAD_REQUEST",
                message: err.errors?.[0]?.message || err.message,
            },
        });
    }
});
// View all bookings (admin only)
router.get("/bookings", auth_1.authenticate, (0, auth_1.authorizeRoles)("ADMIN"), async (req, res) => {
    const bookings = await prisma_1.prisma.booking.findMany({
        include: {
            user: { select: { id: true, email: true } },
            session: {
                select: {
                    id: true,
                    dateTime: true,
                    class: { select: { name: true } },
                },
            },
        },
    });
    res.json(bookings);
});
exports.default = router;
//# sourceMappingURL=admin.js.map