import { prisma } from "../prisma";

export async function logAudit(
  userId: number,
  action: "BOOK" | "CANCEL" | "CREATE_CLASS" | "CREATE_SESSION",
  details: string
) {
  await prisma.auditLog.create({
    data: { userId, action, details },
  });
}
