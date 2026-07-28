import prisma from '../config/prisma.js';

const mockCategories = [
  {
    id: 'cat-1',
    name: '🥗 Entradas & Entremeses',
    icon: 'Utensils',
    displayOrder: 1,
    items: [
      { id: 'dish-1', name: 'Carpaccio de Res Trufado', description: 'Finas láminas de Lomo con aceite de trufa, alcaparras y parmesano.', price: 18.50, categoryId: 'cat-1', isAvailable: true, prepTimeMinutes: 10, imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500' },
      { id: 'dish-2', name: 'Empanaditas de Mariscos (4ud)', description: 'Crujientes empanadillas rellenas de camarones y calamares al ajillo.', price: 14.00, categoryId: 'cat-1', isAvailable: true, prepTimeMinutes: 12, imageUrl: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=500' },
    ],
  },
  {
    id: 'cat-2',
    name: '🥩 Platos Fuertes & Cortes',
    icon: 'Flame',
    displayOrder: 2,
    items: [
      { id: 'dish-3', name: 'Ribeye Prime 16oz a la Parrilla', description: 'Corte de res Angus madurado 30 días, acompañado de papas rústicas.', price: 42.00, categoryId: 'cat-2', isAvailable: true, prepTimeMinutes: 25, imageUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?w=500' },
      { id: 'dish-4', name: 'Salmón Glaseado al Maracuyá', description: 'Filete de salmón salvaje en cama de risotto de espárragos.', price: 29.50, categoryId: 'cat-2', isAvailable: true, prepTimeMinutes: 20, imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500' },
      { id: 'dish-5', name: 'Pasta Fettuccine Frutti di Mare', description: 'Pasta fresca hecha en casa con camarones, pulpo y salsa pomodoro.', price: 26.00, categoryId: 'cat-2', isAvailable: true, prepTimeMinutes: 18, imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500' },
    ],
  },
  {
    id: 'cat-3',
    name: '🍹 Coctelería & Bebidas',
    icon: 'Wine',
    displayOrder: 3,
    items: [
      { id: 'dish-6', name: 'Smoked Old Fashioned', description: 'Bourbon premium, bitter ahumado con madera de cerezo y piel de naranja.', price: 16.00, categoryId: 'cat-3', isAvailable: true, prepTimeMinutes: 5, imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=500' },
      { id: 'dish-7', name: 'Mojito Maracuyá Artesanal', description: 'Ron blanco, hierbabuena fresca, maracuyá orgánico y soda.', price: 12.50, categoryId: 'cat-3', isAvailable: true, prepTimeMinutes: 5, imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500' },
    ],
  },
];

export class MenuService {
  static async getCategoriesWithItems() {
    try {
      return await prisma.category.findMany({
        orderBy: { displayOrder: 'asc' },
        include: { items: { orderBy: { name: 'asc' } } },
      });
    } catch (error) {
      return mockCategories;
    }
  }
}
