import prisma from '../../utils/prisma';

export const getAllServices = async (filters: any) => {
  const { categoryId, search, page = 1, limit = 10 } = filters;
  const where: any = { deletedAt: null };
  if (categoryId) where.categoryId = categoryId;
  if (search) where.name = { contains: search, mode: 'insensitive' };

  const services = await prisma.service.findMany({
    where,
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
    include: { category: true },
  });
  const total = await prisma.service.count({ where });
  return { services, total, page: Number(page), limit: Number(limit) };
};

export const getServiceById = async (id: string) => {
  const service = await prisma.service.findFirst({
    where: { id, deletedAt: null },
    include: {
      category: true,
      providers: { include: { provider: true } },
    },
  });
  if (!service) throw new Error('Service not found');
  return service;
};

export const createService = async (data: any) => {
  return prisma.service.create({
    data,
    include: { category: true },
  });
};

export const updateService = async (id: string, data: any) => {
  const service = await prisma.service.findFirst({ where: { id, deletedAt: null } });
  if (!service) throw new Error('Service not found');
  return prisma.service.update({
    where: { id },
    data,
    include: { category: true },
  });
};

export const softDeleteService = async (id: string) => {
  const service = await prisma.service.findFirst({ where: { id, deletedAt: null } });
  if (!service) throw new Error('Service not found');
  return prisma.service.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};

export const getAllCategories = async () => {
  return prisma.category.findMany({ orderBy: { name: 'asc' } });
};

export const createCategory = async (name: string) => {
  const exists = await prisma.category.findUnique({ where: { name } });
  if (exists) throw new Error('Category already exists');
  return prisma.category.create({ data: { name } });
};