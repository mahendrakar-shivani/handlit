import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

declare const process: { exit(code?: number): void };

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({ where: { name: 'Cleaning' },    update: {}, create: { name: 'Cleaning' } }),
    prisma.category.upsert({ where: { name: 'Plumbing' },    update: {}, create: { name: 'Plumbing' } }),
    prisma.category.upsert({ where: { name: 'Electrical' },  update: {}, create: { name: 'Electrical' } }),
    prisma.category.upsert({ where: { name: 'Carpentry' },   update: {}, create: { name: 'Carpentry' } }),
    prisma.category.upsert({ where: { name: 'Painting' },    update: {}, create: { name: 'Painting' } }),
    prisma.category.upsert({ where: { name: 'Pest Control'}, update: {}, create: { name: 'Pest Control' } }),
  ]);

  const [cleaning, plumbing, electrical, carpentry, painting, pest] = categories;
  console.log('✅ Categories created');

  // Services
  const services = await Promise.all([
    // Cleaning
    prisma.service.upsert({ where: { id: 'svc-001' }, update: {}, create: { id: 'svc-001', name: 'Deep Cleaning',        description: 'Full home deep cleaning',          categoryId: cleaning.id,   basePrice: 999  } }),
    prisma.service.upsert({ where: { id: 'svc-002' }, update: {}, create: { id: 'svc-002', name: 'Bathroom Cleaning',     description: 'Bathroom sanitization service',    categoryId: cleaning.id,   basePrice: 399  } }),
    prisma.service.upsert({ where: { id: 'svc-003' }, update: {}, create: { id: 'svc-003', name: 'Sofa Cleaning',         description: 'Professional sofa cleaning',       categoryId: cleaning.id,   basePrice: 599  } }),
    // Plumbing
    prisma.service.upsert({ where: { id: 'svc-004' }, update: {}, create: { id: 'svc-004', name: 'Pipe Repair',           description: 'Fix leaking pipes and taps',       categoryId: plumbing.id,   basePrice: 299  } }),
    prisma.service.upsert({ where: { id: 'svc-005' }, update: {}, create: { id: 'svc-005', name: 'Tap Installation',      description: 'New tap fitting and installation', categoryId: plumbing.id,   basePrice: 199  } }),
    prisma.service.upsert({ where: { id: 'svc-006' }, update: {}, create: { id: 'svc-006', name: 'Drain Cleaning',        description: 'Blocked drain cleaning service',   categoryId: plumbing.id,   basePrice: 349  } }),
    // Electrical
    prisma.service.upsert({ where: { id: 'svc-007' }, update: {}, create: { id: 'svc-007', name: 'Fan Installation',      description: 'Ceiling fan fitting service',      categoryId: electrical.id, basePrice: 249  } }),
    prisma.service.upsert({ where: { id: 'svc-008' }, update: {}, create: { id: 'svc-008', name: 'Wiring & Switches',     description: 'Electrical wiring and switches',   categoryId: electrical.id, basePrice: 399  } }),
    // Carpentry
    prisma.service.upsert({ where: { id: 'svc-009' }, update: {}, create: { id: 'svc-009', name: 'Furniture Assembly',    description: 'Flat-pack furniture assembly',     categoryId: carpentry.id,  basePrice: 499  } }),
    prisma.service.upsert({ where: { id: 'svc-010' }, update: {}, create: { id: 'svc-010', name: 'Door Repair',           description: 'Fix door hinges and locks',        categoryId: carpentry.id,  basePrice: 299  } }),
    // Painting
    prisma.service.upsert({ where: { id: 'svc-011' }, update: {}, create: { id: 'svc-011', name: 'Room Painting',         description: 'Full room painting service',       categoryId: painting.id,   basePrice: 2999 } }),
    prisma.service.upsert({ where: { id: 'svc-012' }, update: {}, create: { id: 'svc-012', name: 'Wall Texture',          description: 'Decorative wall texture design',   categoryId: painting.id,   basePrice: 1999 } }),
    // Pest Control
    prisma.service.upsert({ where: { id: 'svc-013' }, update: {}, create: { id: 'svc-013', name: 'Cockroach Treatment',   description: 'Full home cockroach control',      categoryId: pest.id,       basePrice: 699  } }),
    prisma.service.upsert({ where: { id: 'svc-014' }, update: {}, create: { id: 'svc-014', name: 'Termite Treatment',     description: 'Anti-termite spray treatment',     categoryId: pest.id,       basePrice: 1499 } }),
  ]);
  console.log('✅ Services created');

  // Providers
  const hashedPassword = await bcrypt.hash('Provider@1234', 12);

  const providers = await Promise.all([
    prisma.provider.upsert({
      where: { email: 'raju@handlit.com' }, update: {},
      create: { name: 'Raju Cleaning Services', email: 'raju@handlit.com',    password: hashedPassword, phone: '9876543210', bio: 'Professional cleaning expert with 5 years experience', isVerified: true },
    }),
    prisma.provider.upsert({
      where: { email: 'kumar@handlit.com' }, update: {},
      create: { name: 'Kumar Plumbing',         email: 'kumar@handlit.com',   password: hashedPassword, phone: '9876543211', bio: '10 years of plumbing experience in Hyderabad',          isVerified: true },
    }),
    prisma.provider.upsert({
      where: { email: 'suresh@handlit.com' }, update: {},
      create: { name: 'Suresh Electricals',     email: 'suresh@handlit.com',  password: hashedPassword, phone: '9876543212', bio: 'Licensed electrician with 8 years experience',           isVerified: true },
    }),
    prisma.provider.upsert({
      where: { email: 'ramesh@handlit.com' }, update: {},
      create: { name: 'Ramesh Carpentry',       email: 'ramesh@handlit.com',  password: hashedPassword, phone: '9876543213', bio: 'Expert carpenter for furniture and doors',               isVerified: true },
    }),
    prisma.provider.upsert({
      where: { email: 'vijay@handlit.com' }, update: {},
      create: { name: 'Vijay Painters',         email: 'vijay@handlit.com',   password: hashedPassword, phone: '9876543214', bio: 'Premium painting services for homes and offices',        isVerified: true },
    }),
    prisma.provider.upsert({
      where: { email: 'pest@handlit.com' }, update: {},
      create: { name: 'Safe Pest Control',      email: 'pest@handlit.com',    password: hashedPassword, phone: '9876543215', bio: 'Certified pest control with eco-friendly products',      isVerified: true },
    }),
  ]);
  console.log('✅ Providers created');

  // Link services to providers
  const [raju, kumar, suresh, ramesh, vijay, pestCtrl] = providers;
  const [s1,s2,s3,s4,s5,s6,s7,s8,s9,s10,s11,s12,s13,s14] = services;

  await Promise.all([
    // Raju — Cleaning
    prisma.providerService.upsert({ where: { providerId_serviceId: { providerId: raju.id,     serviceId: s1.id  } }, update: {}, create: { providerId: raju.id,     serviceId: s1.id,  price: 899  } }),
    prisma.providerService.upsert({ where: { providerId_serviceId: { providerId: raju.id,     serviceId: s2.id  } }, update: {}, create: { providerId: raju.id,     serviceId: s2.id,  price: 349  } }),
    prisma.providerService.upsert({ where: { providerId_serviceId: { providerId: raju.id,     serviceId: s3.id  } }, update: {}, create: { providerId: raju.id,     serviceId: s3.id,  price: 549  } }),
    // Kumar — Plumbing
    prisma.providerService.upsert({ where: { providerId_serviceId: { providerId: kumar.id,    serviceId: s4.id  } }, update: {}, create: { providerId: kumar.id,    serviceId: s4.id,  price: 279  } }),
    prisma.providerService.upsert({ where: { providerId_serviceId: { providerId: kumar.id,    serviceId: s5.id  } }, update: {}, create: { providerId: kumar.id,    serviceId: s5.id,  price: 179  } }),
    prisma.providerService.upsert({ where: { providerId_serviceId: { providerId: kumar.id,    serviceId: s6.id  } }, update: {}, create: { providerId: kumar.id,    serviceId: s6.id,  price: 319  } }),
    // Suresh — Electrical
    prisma.providerService.upsert({ where: { providerId_serviceId: { providerId: suresh.id,   serviceId: s7.id  } }, update: {}, create: { providerId: suresh.id,   serviceId: s7.id,  price: 229  } }),
    prisma.providerService.upsert({ where: { providerId_serviceId: { providerId: suresh.id,   serviceId: s8.id  } }, update: {}, create: { providerId: suresh.id,   serviceId: s8.id,  price: 379  } }),
    // Ramesh — Carpentry
    prisma.providerService.upsert({ where: { providerId_serviceId: { providerId: ramesh.id,   serviceId: s9.id  } }, update: {}, create: { providerId: ramesh.id,   serviceId: s9.id,  price: 449  } }),
    prisma.providerService.upsert({ where: { providerId_serviceId: { providerId: ramesh.id,   serviceId: s10.id } }, update: {}, create: { providerId: ramesh.id,   serviceId: s10.id, price: 279  } }),
    // Vijay — Painting
    prisma.providerService.upsert({ where: { providerId_serviceId: { providerId: vijay.id,    serviceId: s11.id } }, update: {}, create: { providerId: vijay.id,    serviceId: s11.id, price: 2799 } }),
    prisma.providerService.upsert({ where: { providerId_serviceId: { providerId: vijay.id,    serviceId: s12.id } }, update: {}, create: { providerId: vijay.id,    serviceId: s12.id, price: 1799 } }),
    // Pest Control
    prisma.providerService.upsert({ where: { providerId_serviceId: { providerId: pestCtrl.id, serviceId: s13.id } }, update: {}, create: { providerId: pestCtrl.id, serviceId: s13.id, price: 649  } }),
    prisma.providerService.upsert({ where: { providerId_serviceId: { providerId: pestCtrl.id, serviceId: s14.id } }, update: {}, create: { providerId: pestCtrl.id, serviceId: s14.id, price: 1399 } }),
  ]);
  console.log('✅ Provider services linked');

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });