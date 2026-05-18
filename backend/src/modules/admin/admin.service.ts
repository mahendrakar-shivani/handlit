import prisma from "../../utils/prisma";

export const getDashboardStats = async () => {
  try {
    const totalUsers = await prisma.user.count({ where: { deletedAt: null } });
    console.log("✅ totalUsers:", totalUsers);

    const totalProviders = await prisma.provider.count({
      where: { deletedAt: null },
    });
    console.log("✅ totalProviders:", totalProviders);

    const totalBookings = await prisma.booking.count();
    console.log("✅ totalBookings:", totalBookings);

    const recentBookings = await prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        provider: { select: { name: true } },
        service: { select: { name: true } },
      },
    });
    console.log("✅ recentBookings fetched");

    const bookingsByStatus = await prisma.booking.groupBy({
      by: ["status"],
      _count: { status: true },
    });
    console.log("✅ bookingsByStatus:", bookingsByStatus);

    return {
      totalUsers,
      totalProviders,
      totalBookings,
      totalRevenue: 0,
      recentBookings,
      bookingsByStatus,
    };
  } catch (err) {
    console.error("❌ getDashboardStats error:", err);
    throw err;
  }
};
export const getAllUsers = async (page = 1, limit = 10) => {
  const where = { deletedAt: null };
  const users = await prisma.user.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
  const total = await prisma.user.count({ where });
  return { users, total };
};

export const getAllProviders = async (page = 1, limit = 10) => {
  const where = { deletedAt: null };
  const providers = await prisma.provider.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      rating: true,
      isVerified: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
  const total = await prisma.provider.count({ where });
  return { providers, total };
};

export const verifyProvider = async (id: string) => {
  return prisma.provider.update({
    where: { id },
    data: { isVerified: true },
  });
};

export const banUser = async (id: string) => {
  return prisma.user.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};

export const getAllBookingsAdmin = async (page = 1, limit = 10) => {
  const bookings = await prisma.booking.findMany({
    skip: (page - 1) * limit,
    take: limit,
    include: {
      user: { select: { name: true, email: true } },
      provider: { select: { name: true } },
      service: { select: { name: true } },
      // payment include removed
    },
    orderBy: { createdAt: "desc" },
  });
  const total = await prisma.booking.count();
  return { bookings, total };
};
