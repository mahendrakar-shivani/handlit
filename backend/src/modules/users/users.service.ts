import prisma from '../../utils/prisma';

export const getAllUsers = async (filters: any) => {
  const { role, search, page = 1, limit = 10 } = filters;
  const where: any = { deletedAt: null };
  if (role) where.role = role;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }
  const users = await prisma.user.findMany({
    where,
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
    select: {
      id: true, name: true, email: true,
      phone: true, role: true, createdAt: true,
    },
  });
  const total = await prisma.user.count({ where });
  return { users, total, page: Number(page), limit: Number(limit) };
};

export const getUserById = async (id: string) => {
  const user = await prisma.user.findFirst({
    where: { id, deletedAt: null },
    select: {
      id: true, name: true, email: true,
      phone: true, role: true, createdAt: true,
    },
  });
  if (!user) throw new Error('User not found');
  return user;
};

export const updateUser = async (id: string, data: any) => {
  const user = await prisma.user.findFirst({ where: { id, deletedAt: null } });
  if (!user) throw new Error('User not found');
  return prisma.user.update({
    where: { id },
    data,
    select: {
      id: true, name: true, email: true,
      phone: true, role: true, createdAt: true,
    },
  });
};

export const softDeleteUser = async (id: string) => {
  const user = await prisma.user.findFirst({ where: { id, deletedAt: null } });
  if (!user) throw new Error('User not found');
  return prisma.user.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};