"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const prisma_1 = require("../prisma");
const audit_1 = require("../services/audit");
const booking_1 = require("../schemas/booking");
const validate_1 = require("../middleware/validate");
const router = (0, express_1.Router)();
router.get("/sessions/:sessionId/bookings", auth_1.authenticate, async (req, res) => {
    const sessionId = Number(req.params.sessionId);
    const bookings = await prisma_1.prisma.booking.findMany({
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
});
// Book a session
router.post("/sessions/:sessionId/book", auth_1.authenticate, (0, validate_1.validate)(booking_1.sessionIdParamSchema), async (req, res) => {
    const userId = req.user.userId;
    const sessionId = Number(req.params.sessionId);
    // Check if already booked
    const existing = await prisma_1.prisma.booking.findUnique({
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
    const session = await prisma_1.prisma.session.findUnique({
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
    const booking = await prisma_1.prisma.booking.create({
        data: { userId, sessionId },
    });
    // Write AuditLog
    await (0, audit_1.logAudit)(userId, "BOOK", `Booked session ${sessionId}`);
    res.json(booking);
});
// Cancel a booking
router.delete("/sessions/:sessionId/cancel", auth_1.authenticate, (0, validate_1.validate)(booking_1.sessionIdParamSchema), async (req, res) => {
    const userId = req.user.userId;
    const sessionId = Number(req.params.sessionId);
    // Find existing booking
    const booking = await prisma_1.prisma.booking.findUnique({
        where: { userId_sessionId: { userId, sessionId } },
    });
    if (!booking)
        return res.status(404).json({
            error: { code: "NOT_FOUND", message: "Booking not found" },
        });
    // Delete booking
    await prisma_1.prisma.booking.delete({
        where: { id: booking.id },
    });
    // Write AuditLog
    await (0, audit_1.logAudit)(userId, "CANCEL", `Cancelled booking for session ${sessionId}`);
    res.json({ message: "Booking cancelled successfully" });
});
// View user’s own bookings
router.get("/bookings", auth_1.authenticate, async (req, res) => {
    const userId = req.user.userId;
    const bookings = await prisma_1.prisma.booking.findMany({
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
router.get("/sessions", auth_1.authenticate, async (req, res) => {
    const sessions = await prisma_1.prisma.session.findMany({
        include: { class: { select: { name: true } }, bookings: true },
        orderBy: { dateTime: "asc" },
    });
    const result = sessions.map((s) => ({
        id: s.id,
        className: s.class.name,
        dateTime: s.dateTime,
        capacity: s.capacity,
        booked: s.bookings.length,
    }));
    res.json(result);
});
exports.default = router;
//# sourceMappingURL=user.js.map