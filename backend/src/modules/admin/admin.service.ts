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

  const totalUsers = await prisma.user.count();

  const totalProviders = await prisma.provider.count();

  const totalBookings = await prisma.booking.count();

  const bookings = await prisma.booking.findMany();

  const totalRevenue = bookings.reduce(
    (sum: number, booking: { totalAmount?: number }) =>
      sum + (booking.totalAmount ?? 0),
    0
  );

  const recentBookings = await prisma.booking.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: { name: true },
      },
      service: {
        select: { name: true },
      },
    },
  });

  const bookingsByStatus = await prisma.booking.groupBy({
    by: ["status"],
    _count: {
      status: true,
    },
  });

  return {
    totalUsers,
    totalProviders,
    totalBookings,
    totalRevenue,
    recentBookings,
    bookingsByStatus,
  };
};


// ================= USERS =================

export const getAllUsers = async () => {

  return await prisma.user.findMany({
    omit: {
      password: true,
      resetToken: true,
      resetExpiry: true,
    },
    orderBy: {
      name: "asc",
    },
  });

};


// ================= PROVIDERS =================

export const getAllProviders = async (
  page = 1,
  limit = 10
) => {

  const where = { deletedAt: null };

  const providers = await prisma.provider.findMany({
    where,
    omit: { password: true },
    orderBy: [
      { isVerified: "asc" },
      { createdAt: "desc" },
    ],
    skip: (page - 1) * limit,
    take: limit,
  });

  const total = await prisma.provider.count({ where });

  return { providers, total, page, limit };

};


export const removeProvider = async (
  id: string
) => {

  return await prisma.provider.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
    },
    omit: { password: true },
  });

};


export const verifyProvider = async (
  id: string
) => {

  return await prisma.provider.update({
    where: {
      id,
    },
    data: {
      isVerified: true,
    },
    omit: { password: true },
  });

};


// ================= BAN USER =================

export const banUser = async (
  id: string
) => {

  return await prisma.user.delete({
    where: {
      id,
    },
  });

};


// ================= BOOKINGS =================

export const getAllBookingsAdmin = async () => {

  return await prisma.booking.findMany({
    include: {
      user: true,
      provider: true,
      service: true,
    },
  });

};