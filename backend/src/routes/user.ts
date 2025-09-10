import { Router } from "express";
import { authenticate, AuthRequest } from "../middleware/auth";
import { prisma } from "../prisma";
import { logAudit } from "../services/audit";
import { sessionIdParamSchema } from "../schemas/booking";
import { validate } from "../middleware/validate";

const router = Router();

router.get(
  "/sessions/:sessionId/bookings",
  authenticate,
  async (req: AuthRequest, res) => {
    const sessionId = Number(req.params.sessionId);

    const bookings = await prisma.booking.findMany({
      where: { sessionId },
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

// Book a session
router.post(
  "/sessions/:sessionId/book",
  authenticate,
  validate(sessionIdParamSchema),
  async (req: AuthRequest, res) => {
    const userId = req.user!.userId;
    const sessionId = Number(req.params.sessionId);

    // Check if already booked
    const existing = await prisma.booking.findUnique({
      where: { userId_sessionId: { userId, sessionId } },
    });
    if (existing)
      return res.status(400).json({
        error: {
          code: "ALREADY_BOOKED",
          message: "User already booked this session",
        },
      });

    // Check capacity
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { bookings: true },
    });
    if (!session)
      return res
        .status(404)
        .json({ error: { code: "NOT_FOUND", message: "Session not found" } });
    if (session.bookings.length >= session.capacity)
      return res.status(400).json({
        error: { code: "FULL", message: "Session is at full capacity" },
      });

    // Create booking
    const booking = await prisma.booking.create({
      data: { userId, sessionId },
    });

    // Write AuditLog
    await logAudit(userId, "BOOK", `Booked session ${sessionId}`);

    res.json(booking);
  }
);

// Cancel a booking
router.delete(
  "/sessions/:sessionId/cancel",
  authenticate,
  validate(sessionIdParamSchema),
  async (req: AuthRequest, res) => {
    const userId = req.user!.userId;
    const sessionId = Number(req.params.sessionId);

    // Find existing booking
    const booking = await prisma.booking.findUnique({
      where: { userId_sessionId: { userId, sessionId } },
    });

    if (!booking)
      return res.status(404).json({
        error: { code: "NOT_FOUND", message: "Booking not found" },
      });

    // Delete booking
    await prisma.booking.delete({
      where: { id: booking.id },
    });

    // Write AuditLog
    await logAudit(
      userId,
      "CANCEL",
      `Cancelled booking for session ${sessionId}`
    );

    res.json({ message: "Booking cancelled successfully" });
  }
);

// View user’s own bookings
router.get("/bookings", authenticate, async (req: AuthRequest, res) => {
  const userId = req.user!.userId;

  const bookings = await prisma.booking.findMany({
    where: { userId },
    include: {
      session: {
        select: { id: true, dateTime: true, class: { select: { name: true } } },
      },
    },
  });

  res.json(bookings);
});

// View upcoming sessions
router.get("/sessions", authenticate, async (req: AuthRequest, res) => {
  const sessions = await prisma.session.findMany({
    include: { class: { select: { name: true } }, bookings: true },
    orderBy: { dateTime: "asc" },
  });

  const result = sessions.map(
    (s: {
      id: number;
      dateTime: Date;
      capacity: number;
      bookings: { id: number }[];
      class: { name: string };
    }) => ({
      id: s.id,
      className: s.class.name,
      dateTime: s.dateTime,
      capacity: s.capacity,
      booked: s.bookings.length,
    })
  );

  res.json(result);
});

export default router;
