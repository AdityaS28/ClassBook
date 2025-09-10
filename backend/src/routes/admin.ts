import { Router } from "express";
import { authenticate, authorizeRoles, AuthRequest } from "../middleware/auth";
import { prisma } from "../prisma";
import { z } from "zod";
import { logAudit } from "../services/audit";

const router = Router();

// Zod schemas
const createClassSchema = z.object({
  name: z.string().min(1, "Class name is required"),
});

const createSessionSchema = z.object({
  dateTime: z.string().datetime({ message: "Invalid dateTime format" }),
  capacity: z
    .number()
    .int()
    .positive({ message: "Capacity must be a positive integer" }),
});

// Create a class
router.post(
  "/classes",
  authenticate,
  authorizeRoles("ADMIN"),
  async (req: AuthRequest, res) => {
    try {
      const validated = createClassSchema.parse(req.body);
      const newClass = await prisma.class.create({
        data: { name: validated.name },
      });

      // Audit log
      await logAudit(
        req.user!.userId,
        "CREATE_CLASS",
        `Created class "${validated.name}"`
      );

      res.json(newClass);
    } catch (err: any) {
      return res.status(400).json({
        error: {
          code: "BAD_REQUEST",
          message: err.errors?.[0]?.message || err.message,
        },
      });
    }
  }
);


// Get all classes (with optional sessions)
router.get(
  "/get_classes",
  authenticate,
  authorizeRoles("ADMIN"), // You can remove this if you want all users to see classes
  async (req: AuthRequest, res) => {
    try {
      const classes = await prisma.class.findMany({
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
    } catch (err: any) {
      return res.status(500).json({
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: err.message,
        },
      });
    }
  }
);


// Create a session for a class
router.post(
  "/sessions", // removed :classId
  authenticate,
  authorizeRoles("ADMIN"),
  async (req: AuthRequest, res) => {
    try {
      // Update schema to match your payload
      const createSessionSchema = z.object({
        classId: z.string().min(1, "Class ID is required"),
        date: z.string().refine((val) => !isNaN(Date.parse(val)), {
          message: "Invalid date format",
        }),
        time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
          message: "Invalid time format (HH:mm)",
        }),
        capacity: z
          .number()
          .int()
          .positive({ message: "Capacity must be positive" }),
        instructor: z.string().min(1, "Instructor name is required"),
      });

      const validated = createSessionSchema.parse(req.body);

      // Combine date and time into a single Date object
      const dateTime = new Date(`${validated.date}T${validated.time}:00`);

      const session = await prisma.session.create({
        data: {
          classId: Number(validated.classId),
          dateTime,
          capacity: validated.capacity,
        },
      });

      // Audit log
      await logAudit(
        req.user!.userId,
        "CREATE_SESSION",
        `Created session for class ${
          validated.classId
        } at ${dateTime.toISOString()}`
      );

      res.json(session);
    } catch (err: any) {
      return res.status(400).json({
        error: {
          code: "BAD_REQUEST",
          message: err.errors?.[0]?.message || err.message,
        },
      });
    }
  }
);

// View all bookings (admin only)
router.get(
  "/bookings",
  authenticate,
  authorizeRoles("ADMIN"),
  async (req: AuthRequest, res) => {
    const bookings = await prisma.booking.findMany({
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
  }
);

export default router;
