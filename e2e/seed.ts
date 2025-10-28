import { PrismaPg } from '@prisma/adapter-pg';
import { defaultKeyHasher } from 'better-auth/plugins';
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
  const key = 'uga_40731d7e2bdfba119869463612b0c606a98ae0d72ca13820e757081a1d08b6c8';
  const hashedKey = await defaultKeyHasher(key); // -> PIthMM33rWnogdZE2JIXkVCLmSBCUTTi0aw3rZ0ARuE

  const apiKey = await prisma.apikey.create({
    data: {
      id: nanoid(),
      name: 'Test API Key',
      start: 'uga_40',
      prefix: 'uga_',
      key: hashedKey,
      userId: user.id,
      enabled: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      permissions: JSON.stringify({
        sdk: ['read', 'write'],
      }),
      expiresAt: null,
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
