import { PrismaPg } from '@prisma/adapter-pg';
import { nanoid } from 'nanoid';

import { PrismaClient } from '@/prisma/client';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function seed() {
  console.log('🌿 Seeding database...');

  // Clean up existing data
  await prisma.user.deleteMany({});

  // Create a test user
  const user = await prisma.user.create({
    data: {
      id: nanoid(),
      name: 'Test User',
      email: 'test@example.com',
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  console.log('✅ Created user:', user.email);

  // full api key for the encoded value: uga_bmmjfrPamjosBnOvpKIMsYOmdYRWqkgaNdLDxEktbJFDizQAcpkFTAAxYVMFJUnU
  const apiKey = await prisma.apikey.create({
    data: {
      id: nanoid(),
      name: 'Test API Key',
      start: 'uga_bm',
      prefix: 'uga_',
      key: '4dKUP1rd4HadiIZ4rcCrMbEA4v9r_iQ40_89n-swRG0', // encoded
      userId: user.id,
      enabled: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      permissions: JSON.stringify({
        sdk: ['read', 'write'],
      }),
    },
  });

  console.log('✅ Created API key:', apiKey.name, 'with key:', apiKey.key);
  console.log('✅ Seeding completed successfully!');
}

seed()
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
