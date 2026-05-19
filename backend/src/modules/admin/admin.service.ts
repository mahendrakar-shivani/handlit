import prisma from "../../utils/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ================= LOGIN =================

export const loginAdmin = async (
  email: string,
  password: string
) => {
  const admin = await prisma.user.findFirst({
    where: {
      email,
      role: "ADMIN",
    },
  });

  if (!admin) {
    throw new Error("Invalid credentials");
  }

  const passwordMatch = await bcrypt.compare(
    password,
    admin.password
  );

  if (!passwordMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    {
      id: admin.id,
      role: admin.role,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "7d",
    }
  );

  return {
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
    token,
  };
};

// ================= DASHBOARD =================

export const getDashboardStats = async () => {

  const users = await prisma.user.count();

  const providers = await prisma.provider.count();

  const bookings = await prisma.booking.count();

  return {
    users,
    providers,
    bookings,
  };
};

// ================= USERS =================

export const getAllUsers = async () => {

  return prisma.user.findMany({
    orderBy: {
      name: "asc",
    },
  });
};

// ================= PROVIDERS =================

export const getAllProviders = async () => {

  return prisma.provider.findMany({
    orderBy: {
      name: "asc",
    },
  });
};

export const verifyProvider = async (
  id: string
) => {

  return prisma.provider.update({
    where: {
      id,
    },
    data: {
      isVerified: true,
    },
  });
};

// ================= BAN USER =================

export const banUser = async (
  id: string
) => {

  return prisma.user.delete({
    where: {
      id,
    },
  });
};

// ================= BOOKINGS =================

export const getAllBookingsAdmin = async () => {

  return prisma.booking.findMany({
    include: {
      user: true,
      provider: true,
      service: true,
    },
  });
};