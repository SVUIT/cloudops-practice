const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$connect();
    console.log('Kết nối thành công!');
  } catch (error) {
    console.error('Kết nối thất bại:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();