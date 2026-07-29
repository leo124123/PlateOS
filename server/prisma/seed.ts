import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando sembrado de datos en la base de datos (Seed)...');

  // 1. Create Default Users for Restaurant Staff
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const staffPassword = await bcrypt.hash('staff123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@plateos.com' },
    update: {},
    create: {
      name: 'Samuel (Administrador)',
      email: 'admin@plateos.com',
      password: hashedPassword,
      pinCode: '1234',
      role: 'ADMIN',
    },
  });

  const mesero = await prisma.user.upsert({ 
    where: { email: 'mesero2@plateos.com' },
    update: { pinCode: '8091', name: 'Leonardo Luis (Mesero)' },
    create: {
      name: 'Leonardo Luis (Mesero)',
      email: 'mesero2@plateos.com',
      password: staffPassword,
      pinCode: '8091',
      role: 'WAITER',
    },
  });

  const waiter = await prisma.user.upsert({
    where: { email: 'mesero@plateos.com' },
    update: {},
    create: {
      name: 'Carlos Mendoza (Mesero)',
      email: 'mesero@plateos.com',
      password: staffPassword,
      pinCode: '5678',
      role: 'WAITER',
    },
  });

  const chef = await prisma.user.upsert({
    where: { email: 'cocina@plateos.com' },
    update: {},
    create: {
      name: 'Chef Ramón (Cocina)',
      email: 'cocina@plateos.com',
      password: staffPassword,
      pinCode: '9999',
      role: 'KITCHEN',
    },
  });

  const cashier = await prisma.user.upsert({
    where: { email: 'caja@plateos.com' },
    update: {},
    create: {
      name: 'Laura Fernández (Cajera)',
      email: 'caja@plateos.com',
      password: staffPassword,
      pinCode: '4321',
      role: 'CASHIER',
    },
  });

  console.log('✅ Usuarios creados/verificados:', {
    admin: admin.email,
    waiter: waiter.email,
    chef: chef.email,
    cashier: cashier.email,
  });

  // 2. Create 3D Tables — Single Comedor Layout (4 rows of 4 = 16 tables)
  const defaultTables = [
    { number: 1,  name: 'Mesa 1',  capacity: 4, positionX: -10,  positionY: 0, positionZ: -8, rotationY: 0, shape: 'ROUND',     status: 'AVAILABLE' },
    { number: 2,  name: 'Mesa 2',  capacity: 2, positionX: -3.5, positionY: 0, positionZ: -8, rotationY: 0, shape: 'SQUARE',    status: 'ORDER_PENDING' },
    { number: 3,  name: 'Mesa 3',  capacity: 6, positionX: 3.5,  positionY: 0, positionZ: -8, rotationY: 0, shape: 'RECTANGLE', status: 'OCCUPIED' },
    { number: 4,  name: 'Mesa 4',  capacity: 4, positionX: 10,   positionY: 0, positionZ: -8, rotationY: 0, shape: 'SQUARE',    status: 'BILL_REQUESTED' },

    { number: 5,  name: 'Mesa 5',  capacity: 2, positionX: -10,  positionY: 0, positionZ: -2, rotationY: 0, shape: 'ROUND',     status: 'EATING' },
    { number: 6,  name: 'Mesa 6',  capacity: 4, positionX: -3.5, positionY: 0, positionZ: -2, rotationY: 0, shape: 'SQUARE',    status: 'AVAILABLE' },
    { number: 7,  name: 'Mesa 7',  capacity: 8, positionX: 3.5,  positionY: 0, positionZ: -2, rotationY: 0, shape: 'RECTANGLE', status: 'CLEANING' },
    { number: 8,  name: 'Mesa 8',  capacity: 4, positionX: 10,   positionY: 0, positionZ: -2, rotationY: 0, shape: 'ROUND',     status: 'AVAILABLE' },

    { number: 9,  name: 'Mesa 9',  capacity: 4, positionX: -10,  positionY: 0, positionZ: 4,  rotationY: 0, shape: 'SQUARE',    status: 'AVAILABLE' },
    { number: 10, name: 'Mesa 10', capacity: 2, positionX: -3.5, positionY: 0, positionZ: 4,  rotationY: 0, shape: 'ROUND',     status: 'OCCUPIED' },
    { number: 11, name: 'Mesa 11', capacity: 6, positionX: 3.5,  positionY: 0, positionZ: 4,  rotationY: 0, shape: 'RECTANGLE', status: 'ORDER_PENDING' },
    { number: 12, name: 'Mesa 12', capacity: 4, positionX: 10,   positionY: 0, positionZ: 4,  rotationY: 0, shape: 'SQUARE',    status: 'AVAILABLE' },

    { number: 13, name: 'Mesa 13', capacity: 2, positionX: -10,  positionY: 0, positionZ: 9,  rotationY: 0, shape: 'ROUND',     status: 'AVAILABLE' },
    { number: 14, name: 'Mesa 14', capacity: 4, positionX: -3.5, positionY: 0, positionZ: 9,  rotationY: 0, shape: 'SQUARE',    status: 'CLEANING' },
    { number: 15, name: 'Mesa 15', capacity: 4, positionX: 3.5,  positionY: 0, positionZ: 9,  rotationY: 0, shape: 'SQUARE',    status: 'EATING' },
    { number: 16, name: 'Mesa 16', capacity: 6, positionX: 10,   positionY: 0, positionZ: 9,  rotationY: 0, shape: 'RECTANGLE', status: 'AVAILABLE' },
  ];

  for (const tbl of defaultTables) {
    await prisma.table.upsert({
      where: { number: tbl.number },
      update: {
        positionX: tbl.positionX,
        positionY: tbl.positionY,
        positionZ: tbl.positionZ,
      },
      create: {
        number: tbl.number,
        name: tbl.name,
        capacity: tbl.capacity,
        positionX: tbl.positionX,
        positionY: tbl.positionY,
        positionZ: tbl.positionZ,
        rotationY: tbl.rotationY,
        shape: tbl.shape,
        status: tbl.status as any,
      },
    });
  }
  console.log('✅ Mesas 3D del salón configuradas.');

  // 3. Create Categories and Gourmet Menu Items
  const catEntradas = await prisma.category.upsert({
    where: { id: 'cat-entradas' },
    update: {},
    create: { id: 'cat-entradas', name: 'Entradas Gourmet', icon: 'salad', displayOrder: 1 },
  });

  const catFuertes = await prisma.category.upsert({
    where: { id: 'cat-fuertes' },
    update: {},
    create: { id: 'cat-fuertes', name: 'Platos Fuertes', icon: 'beef', displayOrder: 2 },
  });

  const catPostres = await prisma.category.upsert({
    where: { id: 'cat-postres' },
    update: {},
    create: { id: 'cat-postres', name: 'Postres & Cafés', icon: 'cake', displayOrder: 3 },
  });

  const catBebidas = await prisma.category.upsert({
    where: { id: 'cat-bebidas' },
    update: {},
    create: { id: 'cat-bebidas', name: 'Coctelería & Bebidas', icon: 'wine', displayOrder: 4 },
  });

  const dishes = [
    { id: 'dish-1', name: 'Carpaccio de Res Trufado', price: 18.5, categoryId: catEntradas.id, prepTimeMinutes: 12 },
    { id: 'dish-2', name: 'Ceviche de Pulpo al Olivo', price: 21.0, categoryId: catEntradas.id, prepTimeMinutes: 15 },
    { id: 'dish-3', name: 'Ribeye Steak Prime 400g', price: 42.0, categoryId: catFuertes.id, prepTimeMinutes: 25 },
    { id: 'dish-4', name: 'Salmón Glaseado al Maracuyá', price: 34.5, categoryId: catFuertes.id, prepTimeMinutes: 20 },
    { id: 'dish-5', name: 'Risotto de Hongos Porcini', price: 28.0, categoryId: catFuertes.id, prepTimeMinutes: 18 },
    { id: 'dish-6', name: 'Volcán de Chocolate con Helado', price: 12.0, categoryId: catPostres.id, prepTimeMinutes: 10 },
    { id: 'dish-7', name: 'Cheesecake de Frutos Rojos', price: 10.5, categoryId: catPostres.id, prepTimeMinutes: 8 },
    { id: 'dish-8', name: 'Cocktail Smoked Old Fashioned', price: 16.0, categoryId: catBebidas.id, prepTimeMinutes: 5 },
    { id: 'dish-9', name: 'Copa de Vino Tinto Reserva', price: 14.0, categoryId: catBebidas.id, prepTimeMinutes: 3 },
  ];

  for (const d of dishes) {
    await prisma.menuItem.upsert({
      where: { id: d.id },
      update: { name: d.name, price: d.price },
      create: {
        id: d.id,
        name: d.name,
        price: d.price,
        categoryId: d.categoryId,
        prepTimeMinutes: d.prepTimeMinutes,
        isAvailable: true,
      },
    });
  }

  console.log('✅ Categorías y Platillos gourmet sembrados exitosamente.');

  // 4. Create Today's Goal Record
  const todayStr = new Date().toISOString().split('T')[0];
  await prisma.dailyGoal.upsert({
    where: { date: todayStr },
    update: {},
    create: {
      date: todayStr,
      targetSales: 5000.0,
      targetOrders: 100,
      achievedSales: 1850.0,
      achievedOrders: 32,
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
