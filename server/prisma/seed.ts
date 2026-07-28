import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando sembrado de datos en la base de datos (Seed)...');

  // 1. Create Default Staff Users
  const hashedPasswordAdmin = await bcrypt.hash('admin123', 10);
  const hashedPasswordStaff = await bcrypt.hash('staff123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@plateos.com' },
    update: {},
    create: {
      name: 'Samuel Guance (Admin)',
      email: 'admin@plateos.com',
      password: hashedPasswordAdmin,
      pinCode: '1234',
      role: 'ADMIN',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
  });

  const waiter = await prisma.user.upsert({
    where: { email: 'mesero@plateos.com' },
    update: {},
    create: {
      name: 'Carlos Mendoza (Mesero Star)',
      email: 'mesero@plateos.com',
      password: hashedPasswordStaff,
      pinCode: '5678',
      role: 'WAITER',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
  });

  const chef = await prisma.user.upsert({
    where: { email: 'cocina@plateos.com' },
    update: {},
    create: {
      name: 'Chef María López (Chef Ejecutivo)',
      email: 'cocina@plateos.com',
      password: hashedPasswordStaff,
      pinCode: '9999',
      role: 'KITCHEN',
      avatarUrl: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150',
    },
  });

  const cashier = await prisma.user.upsert({
    where: { email: 'caja@plateos.com' },
    update: {},
    create: {
      name: 'Ana Rivas (Cajera Principal)',
      email: 'caja@plateos.com',
      password: hashedPasswordStaff,
      pinCode: '4321',
      role: 'CASHIER',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
  });

  console.log('✅ Usuarios creados/verificados:', { admin: admin.email, waiter: waiter.email, chef: chef.email, cashier: cashier.email });

  // 2. Create 3D Restaurant Floor Plan Tables
  const defaultTables = [
    { number: 1, name: 'Mesa 1', capacity: 2, positionX: -6, positionY: 0, positionZ: -6, rotationY: 0, shape: 'ROUND', status: 'AVAILABLE' },
    { number: 2, name: 'Mesa 2', capacity: 4, positionX: 0, positionY: 0, positionZ: -6, rotationY: 0, shape: 'SQUARE', status: 'OCCUPIED' },
    { number: 3, name: 'Mesa 3', capacity: 4, positionX: 6, positionY: 0, positionZ: -6, rotationY: 0, shape: 'ROUND', status: 'ORDER_PENDING' },
    { number: 4, name: 'Mesa 4', capacity: 6, positionX: -6, positionY: 0, positionZ: 0, rotationY: 0, shape: 'RECTANGLE', status: 'EATING' },
    { number: 5, name: 'Mesa 5', capacity: 4, positionX: 0, positionY: 0, positionZ: 0, rotationY: 0, shape: 'SQUARE', status: 'BILL_REQUESTED' },
    { number: 6, name: 'Mesa 6', capacity: 2, positionX: 6, positionY: 0, positionZ: 0, rotationY: 0, shape: 'ROUND', status: 'CLEANING' },
    { number: 7, name: 'Mesa VIP 7', capacity: 8, positionX: -4, positionY: 0, positionZ: 6, rotationY: 0, shape: 'RECTANGLE', status: 'AVAILABLE' },
    { number: 8, name: 'Mesa VIP 8', capacity: 4, positionX: 4, positionY: 0, positionZ: 6, rotationY: 0, shape: 'SQUARE', status: 'AVAILABLE' },
  ];

  for (const t of defaultTables) {
    await prisma.table.upsert({
      where: { number: t.number },
      update: { positionX: t.positionX, positionZ: t.positionZ, shape: t.shape, capacity: t.capacity },
      create: t as any,
    });
  }
  console.log('✅ Mesas 3D del salón configuradas.');

  // 3. Create Categories & Menu Items
  const catEntradas = await prisma.category.create({
    data: {
      name: '🥗 Entradas & Entremeses',
      icon: 'Utensils',
      displayOrder: 1,
      items: {
        create: [
          { name: 'Carpaccio de Res Trufado', description: 'Finas láminas de lomo de res con aceite de trufa, alcaparras y parmesano.', price: 18.50, prepTimeMinutes: 10, imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500' },
          { name: 'Empanaditas de Mariscos (4ud)', description: 'Crujientes empanadillas rellenas de camarones y calamares al ajillo.', price: 14.00, prepTimeMinutes: 12, imageUrl: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=500' },
        ],
      },
    },
  });

  const catFuertes = await prisma.category.create({
    data: {
      name: '🥩 Platos Fuertes & Cortes',
      icon: 'Flame',
      displayOrder: 2,
      items: {
        create: [
          { name: 'Ribeye Prime 16oz a la Parrilla', description: 'Corte de res Angus madurado 30 días, acompañado de papas rústicas.', price: 42.00, prepTimeMinutes: 25, imageUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?w=500' },
          { name: 'Salmón Glaseado al Maracuyá', description: 'Filete de salmón salvaje en cama de risotto de espárragos.', price: 29.50, prepTimeMinutes: 20, imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500' },
          { name: 'Pasta Fettuccine Frutti di Mare', description: 'Pasta fresca hecha en casa con camarones, pulpo y salsa pomodoro.', price: 26.00, prepTimeMinutes: 18, imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500' },
        ],
      },
    },
  });

  const catBebidas = await prisma.category.create({
    data: {
      name: '🍹 Coctelería & Bebidas',
      icon: 'Wine',
      displayOrder: 3,
      items: {
        create: [
          { name: 'Smoked Old Fashioned', description: 'Bourbon premium, bitter ahumado con madera de cerezo y piel de naranja.', price: 16.00, prepTimeMinutes: 5, imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=500' },
          { name: 'Mojito Maracuyá Artesanal', description: 'Ron blanco, hierbabuena fresca, maracuyá orgánico y soda.', price: 12.50, prepTimeMinutes: 5, imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500' },
        ],
      },
    },
  });

  console.log('✅ Categorías y Platillos gourmet sembrados exitosamente.');

  // 4. Create Initial Today's Goal
  const todayStr = new Date().toISOString().split('T')[0];
  await prisma.dailyGoal.upsert({
    where: { date: todayStr },
    update: {},
    create: {
      date: todayStr,
      targetSales: 5000,
      targetOrders: 100,
      achievedSales: 1850,
      achievedOrders: 28,
    },
  });

  console.log('🚀 Sembrado de datos completado.');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
