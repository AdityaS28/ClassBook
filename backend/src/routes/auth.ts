import { Router } from "express";
import { prisma } from "../prisma";
import bcrypt from "bcryptjs";
import { signAccess, signRefresh } from "../utils/jwt";

const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({
        error: { code: "BAD_REQUEST", message: "Email and password required" },
      });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user)
    return res
      .status(401)
      .json({
        error: { code: "UNAUTHORIZED", message: "Invalid credentials" },
      });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid)
    return res
      .status(401)
      .json({
        error: { code: "UNAUTHORIZED", message: "Invalid credentials" },
      });

  const accessToken = signAccess({ userId: user.id, role: user.role });
  const refreshToken = signRefresh({ userId: user.id, role: user.role });

  return res.json({
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
    accessToken,
    refreshToken,
  });

});

export default router;
