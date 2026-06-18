import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Seed admin users
  const hash1 = await bcrypt.hash('johndoe123', 12);
  await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: { email: 'john@doe.com', name: 'Admin', password: hash1, role: 'admin' },
  });

  const hash2 = await bcrypt.hash('admin123', 12);
  await prisma.user.upsert({
    where: { email: 'admin@hibiscus.com' },
    update: {},
    create: { email: 'admin@hibiscus.com', name: 'Admin Hibiscus', password: hash2, role: 'admin' },
  });

  // Categories
  const categories = [
    { slug: 'sanduiches', namePt: 'Sanduíches', nameEn: 'Sandwiches', nameEs: 'Sándwiches', descPt: 'Todos acompanham fritas', descEn: 'All served with fries', descEs: 'Todos acompañados de papas fritas', iconUrl: '/icons/sandwich.svg', sortOrder: 1 },
    { slug: 'massas-risotos', namePt: 'Massas & Risotos', nameEn: 'Pasta & Risottos', nameEs: 'Pastas & Risottos', descPt: null, descEn: null, descEs: null, iconUrl: '/icons/pasta.svg', sortOrder: 2 },
    { slug: 'pizzas', namePt: 'Pizzas Individuais', nameEn: 'Individual Pizzas', nameEs: 'Pizzas Individuales', descPt: null, descEn: null, descEs: null, iconUrl: '/icons/pizza.svg', sortOrder: 3 },
    { slug: 'entradas-sopas', namePt: 'Entradas & Sopas', nameEn: 'Starters & Soups', nameEs: 'Entradas & Sopas', descPt: null, descEn: null, descEs: null, iconUrl: '/icons/soup.svg', sortOrder: 4 },
    { slug: 'saladas', namePt: 'Saladas', nameEn: 'Salads', nameEs: 'Ensaladas', descPt: null, descEn: null, descEs: null, iconUrl: '/icons/salad.svg', sortOrder: 5 },
    { slug: 'pratos-principais', namePt: 'Pratos Principais', nameEn: 'Main Courses', nameEs: 'Platos Principales', descPt: null, descEn: null, descEs: null, iconUrl: '/icons/main-dish.svg', sortOrder: 6 },
    { slug: 'sobremesas', namePt: 'Sobremesas', nameEn: 'Desserts', nameEs: 'Postres', descPt: null, descEn: null, descEs: null, iconUrl: '/icons/dessert.svg', sortOrder: 7 },
    { slug: 'cafes-chas-chocolates', namePt: 'Cafés, Chás e Chocolates', nameEn: 'Coffee, Tea & Chocolate', nameEs: 'Cafés, Tés y Chocolates', descPt: null, descEn: null, descEs: null, iconUrl: '/icons/coffee.svg', sortOrder: 8 },
    { slug: 'aguas-refri-sucos', namePt: 'Águas, Refrigerantes e Sucos', nameEn: 'Water, Soft Drinks & Juices', nameEs: 'Aguas, Refrescos y Jugos', descPt: null, descEn: null, descEs: null, iconUrl: '/icons/water.svg', sortOrder: 9 },
    { slug: 'cervejas', namePt: 'Cervejas', nameEn: 'Beers', nameEs: 'Cervezas', descPt: null, descEn: null, descEs: null, iconUrl: '/icons/beer.svg', sortOrder: 10 },
    { slug: 'coqueteis', namePt: 'Coquetéis', nameEn: 'Cocktails', nameEs: 'Cócteles', descPt: null, descEn: null, descEs: null, iconUrl: '/icons/cocktail.svg', sortOrder: 11 },
    { slug: 'aperitivos-destilados', namePt: 'Aperitivos & Destilados', nameEn: 'Aperitifs & Spirits', nameEs: 'Aperitivos & Destilados', descPt: null, descEn: null, descEs: null, iconUrl: '/icons/wine.svg', sortOrder: 12 },
    { slug: 'whisky', namePt: 'Whisky', nameEn: 'Whisky', nameEs: 'Whisky', descPt: null, descEn: null, descEs: null, iconUrl: '/icons/whisky.svg', sortOrder: 13 },
  ];

  const catMap: Record<string, string> = {};
  for (const cat of categories) {
    const c = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { namePt: cat.namePt, nameEn: cat.nameEn, nameEs: cat.nameEs, descPt: cat.descPt, descEn: cat.descEn, descEs: cat.descEs, iconUrl: cat.iconUrl, sortOrder: cat.sortOrder },
      create: cat,
    });
    catMap[cat.slug] = c.id;
  }

  // Menu Items - using upsert by unique combination
  const items: { catSlug: string; namePt: string; nameEn: string; nameEs: string; descPt: string; descEn: string; descEs: string; price: number; sortOrder: number }[] = [
    // Sanduíches
    { catSlug: 'sanduiches', namePt: 'Cheese Salada', nameEn: 'Cheese Salad Burger', nameEs: 'Cheese Salada', descPt: 'Hambúrguer de fraldinha, queijo, alface, tomate e maionese especial', descEn: 'Flank steak burger, cheese, lettuce, tomato and special mayo', descEs: 'Hamburguesa de vacío, queso, lechuga, tomate y mayonesa especial', price: 59, sortOrder: 1 },
    { catSlug: 'sanduiches', namePt: 'Panamby Burguer', nameEn: 'Panamby Burger', nameEs: 'Panamby Burger', descPt: 'Cheddar, bacon, cebola caramelizada e molho barbecue', descEn: 'Cheddar, bacon, caramelized onion and BBQ sauce', descEs: 'Cheddar, bacon, cebolla caramelizada y salsa barbacoa', price: 62, sortOrder: 2 },
    { catSlug: 'sanduiches', namePt: 'Parmegiana no Pão', nameEn: 'Parmigiana Sandwich', nameEs: 'Parmegiana en Pan', descPt: 'Filé mignon à parmegiana com rúcula no pão ciabatta', descEn: 'Filet mignon parmigiana with arugula on ciabatta bread', descEs: 'Filete mignon a la parmesana con rúcula en pan ciabatta', price: 64, sortOrder: 3 },
    { catSlug: 'sanduiches', namePt: 'Chicken Burger', nameEn: 'Chicken Burger', nameEs: 'Chicken Burger', descPt: 'Frango grelhado, maionese de ervas, alface e tomate', descEn: 'Grilled chicken, herb mayo, lettuce and tomato', descEs: 'Pollo a la parrilla, mayonesa de hierbas, lechuga y tomate', price: 56, sortOrder: 4 },
    { catSlug: 'sanduiches', namePt: 'Club Sandwich', nameEn: 'Club Sandwich', nameEs: 'Club Sandwich', descPt: 'Frango, bacon, ovo, alface, tomate e maionese no pão de forma', descEn: 'Chicken, bacon, egg, lettuce, tomato and mayo on toast', descEs: 'Pollo, bacon, huevo, lechuga, tomate y mayonesa en pan de molde', price: 58, sortOrder: 5 },
    { catSlug: 'sanduiches', namePt: 'Wrap Vegetariano', nameEn: 'Vegetarian Wrap', nameEs: 'Wrap Vegetariano', descPt: 'Legumes grelhados, cream cheese, rúcula e tomate seco', descEn: 'Grilled vegetables, cream cheese, arugula and sun-dried tomato', descEs: 'Verduras a la parrilla, queso crema, rúcula y tomate seco', price: 52, sortOrder: 6 },
    // Massas & Risotos
    { catSlug: 'massas-risotos', namePt: 'Fettuccine à Carbonara', nameEn: 'Fettuccine Carbonara', nameEs: 'Fettuccine a la Carbonara', descPt: 'Fettuccine com molho cremoso de bacon, gema e parmesão', descEn: 'Fettuccine with creamy bacon, egg yolk and parmesan sauce', descEs: 'Fettuccine con salsa cremosa de bacon, yema y parmesano', price: 90, sortOrder: 1 },
    { catSlug: 'massas-risotos', namePt: 'Espaguete à Bolonhesa', nameEn: 'Spaghetti Bolognese', nameEs: 'Espagueti a la Boloñesa', descPt: 'Espaguete com ragu de carne e molho de tomate', descEn: 'Spaghetti with meat ragù and tomato sauce', descEs: 'Espagueti con ragú de carne y salsa de tomate', price: 86, sortOrder: 2 },
    { catSlug: 'massas-risotos', namePt: 'Penne ao Molho Rosé', nameEn: 'Penne Rosé Sauce', nameEs: 'Penne al Salsa Rosé', descPt: 'Penne com molho rosé, presunto e cogumelos', descEn: 'Penne with rosé sauce, ham and mushrooms', descEs: 'Penne con salsa rosé, jamón y champiñones', price: 82, sortOrder: 3 },
    { catSlug: 'massas-risotos', namePt: 'Risoto de Funghi', nameEn: 'Mushroom Risotto', nameEs: 'Risotto de Hongos', descPt: 'Arroz arbóreo com mix de cogumelos e parmesão', descEn: 'Arborio rice with mixed mushrooms and parmesan', descEs: 'Arroz arbóreo con mix de hongos y parmesano', price: 96, sortOrder: 4 },
    { catSlug: 'massas-risotos', namePt: 'Risoto de Camarão', nameEn: 'Shrimp Risotto', nameEs: 'Risotto de Camarones', descPt: 'Arroz arbóreo com camarões, tomate e manjericão', descEn: 'Arborio rice with shrimp, tomato and basil', descEs: 'Arroz arbóreo con camarones, tomate y albahaca', price: 110, sortOrder: 5 },
    { catSlug: 'massas-risotos', namePt: 'Lasanha Bolonhesa', nameEn: 'Bolognese Lasagna', nameEs: 'Lasaña Boloñesa', descPt: 'Camadas de massa, ragu de carne, bechamel e queijo gratinado', descEn: 'Layers of pasta, meat ragù, béchamel and gratin cheese', descEs: 'Capas de pasta, ragú de carne, bechamel y queso gratinado', price: 88, sortOrder: 6 },
    // Pizzas Individuais
    { catSlug: 'pizzas', namePt: 'Margherita', nameEn: 'Margherita', nameEs: 'Margherita', descPt: 'Molho de tomate, mussarela de búfala e manjericão fresco', descEn: 'Tomato sauce, buffalo mozzarella and fresh basil', descEs: 'Salsa de tomate, mozzarella de búfala y albahaca fresca', price: 68, sortOrder: 1 },
    { catSlug: 'pizzas', namePt: 'Pepperoni', nameEn: 'Pepperoni', nameEs: 'Pepperoni', descPt: 'Molho de tomate, mussarela e pepperoni', descEn: 'Tomato sauce, mozzarella and pepperoni', descEs: 'Salsa de tomate, mozzarella y pepperoni', price: 72, sortOrder: 2 },
    { catSlug: 'pizzas', namePt: 'Quatro Queijos', nameEn: 'Four Cheese', nameEs: 'Cuatro Quesos', descPt: 'Mussarela, gorgonzola, parmesão e catupiry', descEn: 'Mozzarella, gorgonzola, parmesan and catupiry', descEs: 'Mozzarella, gorgonzola, parmesano y catupiry', price: 74, sortOrder: 3 },
    { catSlug: 'pizzas', namePt: 'Portuguesa', nameEn: 'Portuguese', nameEs: 'Portuguesa', descPt: 'Presunto, ovo, cebola, azeitona e mussarela', descEn: 'Ham, egg, onion, olive and mozzarella', descEs: 'Jamón, huevo, cebolla, aceituna y mozzarella', price: 70, sortOrder: 4 },
    { catSlug: 'pizzas', namePt: 'Frango com Catupiry', nameEn: 'Chicken with Catupiry', nameEs: 'Pollo con Catupiry', descPt: 'Frango desfiado com catupiry e milho', descEn: 'Shredded chicken with catupiry cheese and corn', descEs: 'Pollo deshilachado con catupiry y maíz', price: 72, sortOrder: 5 },
    // Entradas & Sopas
    { catSlug: 'entradas-sopas', namePt: 'Sopa de Cebola Gratinada', nameEn: 'French Onion Soup', nameEs: 'Sopa de Cebolla Gratinada', descPt: 'Sopa cremosa de cebola com croutons e queijo gruyère gratinado', descEn: 'Creamy onion soup with croutons and gratin gruyère cheese', descEs: 'Sopa cremosa de cebolla con crutones y queso gruyère gratinado', price: 48, sortOrder: 1 },
    { catSlug: 'entradas-sopas', namePt: 'Carpaccio de Filé Mignon', nameEn: 'Filet Mignon Carpaccio', nameEs: 'Carpaccio de Filete Mignon', descPt: 'Lâminas de filé mignon com rúcula, parmesão e alcaparras', descEn: 'Thin slices of filet mignon with arugula, parmesan and capers', descEs: 'Láminas de filete mignon con rúcula, parmesano y alcaparras', price: 62, sortOrder: 2 },
    { catSlug: 'entradas-sopas', namePt: 'Bruschetta de Tomate', nameEn: 'Tomato Bruschetta', nameEs: 'Bruschetta de Tomate', descPt: 'Pão italiano tostado com tomate, manjericão e azeite extra virgem', descEn: 'Toasted Italian bread with tomato, basil and extra virgin olive oil', descEs: 'Pan italiano tostado con tomate, albahaca y aceite de oliva extra virgen', price: 42, sortOrder: 3 },
    { catSlug: 'entradas-sopas', namePt: 'Creme de Abóbora', nameEn: 'Pumpkin Cream Soup', nameEs: 'Crema de Calabaza', descPt: 'Creme de abóbora com gengibre e croutons', descEn: 'Pumpkin cream with ginger and croutons', descEs: 'Crema de calabaza con jengibre y crutones', price: 44, sortOrder: 4 },
    { catSlug: 'entradas-sopas', namePt: 'Camarão Empanado', nameEn: 'Breaded Shrimp', nameEs: 'Camarones Empanizados', descPt: 'Camarões crocantes com molho tártaro', descEn: 'Crispy shrimp with tartar sauce', descEs: 'Camarones crujientes con salsa tártara', price: 68, sortOrder: 5 },
    // Saladas
    { catSlug: 'saladas', namePt: 'Caesar Salad', nameEn: 'Caesar Salad', nameEs: 'Ensalada César', descPt: 'Alface romana, croutons, parmesão e molho caesar com frango grelhado', descEn: 'Romaine lettuce, croutons, parmesan and caesar dressing with grilled chicken', descEs: 'Lechuga romana, crutones, parmesano y aderezo césar con pollo a la parrilla', price: 56, sortOrder: 1 },
    { catSlug: 'saladas', namePt: 'Salada Caprese', nameEn: 'Caprese Salad', nameEs: 'Ensalada Caprese', descPt: 'Tomate, mussarela de búfala, manjericão e redução de balsâmico', descEn: 'Tomato, buffalo mozzarella, basil and balsamic reduction', descEs: 'Tomate, mozzarella de búfala, albahaca y reducción de balsámico', price: 52, sortOrder: 2 },
    { catSlug: 'saladas', namePt: 'Salada Tropical', nameEn: 'Tropical Salad', nameEs: 'Ensalada Tropical', descPt: 'Mix de folhas, manga, palmito e molho de maracujá', descEn: 'Mixed greens, mango, palm heart and passion fruit dressing', descEs: 'Mix de hojas, mango, palmito y aderezo de maracuyá', price: 48, sortOrder: 3 },
    { catSlug: 'saladas', namePt: 'Salada Mediterrânea', nameEn: 'Mediterranean Salad', nameEs: 'Ensalada Mediterránea', descPt: 'Folhas verdes, tomate cereja, azeitonas, pepino e queijo feta', descEn: 'Green leaves, cherry tomato, olives, cucumber and feta cheese', descEs: 'Hojas verdes, tomate cherry, aceitunas, pepino y queso feta', price: 50, sortOrder: 4 },
    // Pratos Principais
    { catSlug: 'pratos-principais', namePt: 'Filé Mignon ao Molho Madeira', nameEn: 'Filet Mignon Madeira Sauce', nameEs: 'Filete Mignon al Madeira', descPt: 'Filé mignon grelhado com molho madeira, arroz e legumes', descEn: 'Grilled filet mignon with Madeira sauce, rice and vegetables', descEs: 'Filete mignon a la parrilla con salsa Madeira, arroz y verduras', price: 120, sortOrder: 1 },
    { catSlug: 'pratos-principais', namePt: 'Salmão Grelhado', nameEn: 'Grilled Salmon', nameEs: 'Salmón a la Parrilla', descPt: 'Salmão grelhado com risoto de limão siciliano e aspargos', descEn: 'Grilled salmon with Sicilian lemon risotto and asparagus', descEs: 'Salmón a la parrilla con risotto de limón siciliano y espárragos', price: 115, sortOrder: 2 },
    { catSlug: 'pratos-principais', namePt: 'Picanha na Brasa', nameEn: 'Grilled Picanha', nameEs: 'Picaña a la Brasa', descPt: 'Picanha grelhada com farofa, vinagrete e arroz', descEn: 'Grilled top sirloin cap with cassava flour, vinaigrette and rice', descEs: 'Picaña a la parrilla con farofa, vinagreta y arroz', price: 130, sortOrder: 3 },
    { catSlug: 'pratos-principais', namePt: 'Frango à Parmegiana', nameEn: 'Chicken Parmigiana', nameEs: 'Pollo a la Parmesana', descPt: 'Peito de frango empanado com molho de tomate e queijo gratinado', descEn: 'Breaded chicken breast with tomato sauce and gratin cheese', descEs: 'Pechuga de pollo empanizada con salsa de tomate y queso gratinado', price: 78, sortOrder: 4 },
    { catSlug: 'pratos-principais', namePt: 'Costela no Bafo', nameEn: 'Slow-Cooked Ribs', nameEs: 'Costilla al Horno', descPt: 'Costela bovina cozida lentamente com mandioca e molho especial', descEn: 'Slow-cooked beef ribs with cassava and special sauce', descEs: 'Costilla de res cocida lentamente con yuca y salsa especial', price: 98, sortOrder: 5 },
    { catSlug: 'pratos-principais', namePt: 'Bacalhau à Brás', nameEn: 'Bacalhau à Brás', nameEs: 'Bacalao a la Brás', descPt: 'Bacalhau desfiado com batata palha, ovos e azeitonas', descEn: 'Shredded cod with shoestring potatoes, eggs and olives', descEs: 'Bacalao deshilachado con papas paja, huevos y aceitunas', price: 125, sortOrder: 6 },
    // Sobremesas
    { catSlug: 'sobremesas', namePt: 'Petit Gâteau', nameEn: 'Petit Gâteau', nameEs: 'Petit Gâteau', descPt: 'Bolo quente de chocolate com sorvete de baunilha', descEn: 'Warm chocolate cake with vanilla ice cream', descEs: 'Pastel caliente de chocolate con helado de vainilla', price: 48, sortOrder: 1 },
    { catSlug: 'sobremesas', namePt: 'Cheesecake de Frutas Vermelhas', nameEn: 'Berry Cheesecake', nameEs: 'Cheesecake de Frutos Rojos', descPt: 'Cheesecake cremoso com calda de frutas vermelhas', descEn: 'Creamy cheesecake with berry coulis', descEs: 'Cheesecake cremoso con coulis de frutos rojos', price: 44, sortOrder: 2 },
    { catSlug: 'sobremesas', namePt: 'Crème Brûlée', nameEn: 'Crème Brûlée', nameEs: 'Crème Brûlée', descPt: 'Creme de baunilha com açúcar caramelizado', descEn: 'Vanilla custard with caramelized sugar', descEs: 'Crema de vainilla con azúcar caramelizado', price: 42, sortOrder: 3 },
    { catSlug: 'sobremesas', namePt: 'Tiramisù', nameEn: 'Tiramisù', nameEs: 'Tiramisú', descPt: 'Clássico italiano com café, mascarpone e cacau', descEn: 'Italian classic with coffee, mascarpone and cocoa', descEs: 'Clásico italiano con café, mascarpone y cacao', price: 46, sortOrder: 4 },
    { catSlug: 'sobremesas', namePt: 'Brownie com Sorvete', nameEn: 'Brownie with Ice Cream', nameEs: 'Brownie con Helado', descPt: 'Brownie de chocolate com sorvete de creme e calda quente', descEn: 'Chocolate brownie with cream ice cream and hot fudge', descEs: 'Brownie de chocolate con helado de crema y salsa caliente', price: 40, sortOrder: 5 },
    // Cafés, Chás e Chocolates
    { catSlug: 'cafes-chas-chocolates', namePt: 'Espresso', nameEn: 'Espresso', nameEs: 'Espresso', descPt: 'Café espresso tradicional', descEn: 'Traditional espresso coffee', descEs: 'Café espresso tradicional', price: 12, sortOrder: 1 },
    { catSlug: 'cafes-chas-chocolates', namePt: 'Cappuccino', nameEn: 'Cappuccino', nameEs: 'Cappuccino', descPt: 'Espresso com leite vaporizado e espuma cremosa', descEn: 'Espresso with steamed milk and creamy foam', descEs: 'Espresso con leche vaporizada y espuma cremosa', price: 18, sortOrder: 2 },
    { catSlug: 'cafes-chas-chocolates', namePt: 'Café Latte', nameEn: 'Café Latte', nameEs: 'Café Latte', descPt: 'Espresso com leite vaporizado', descEn: 'Espresso with steamed milk', descEs: 'Espresso con leche vaporizada', price: 16, sortOrder: 3 },
    { catSlug: 'cafes-chas-chocolates', namePt: 'Chá (diversas opções)', nameEn: 'Tea (various options)', nameEs: 'Té (varias opciones)', descPt: 'Camomila, hortelã, verde, preto ou frutas vermelhas', descEn: 'Chamomile, mint, green, black or berry', descEs: 'Manzanilla, menta, verde, negro o frutos rojos', price: 14, sortOrder: 4 },
    { catSlug: 'cafes-chas-chocolates', namePt: 'Chocolate Quente', nameEn: 'Hot Chocolate', nameEs: 'Chocolate Caliente', descPt: 'Chocolate cremoso com chantilly', descEn: 'Creamy chocolate with whipped cream', descEs: 'Chocolate cremoso con crema batida', price: 20, sortOrder: 5 },
    { catSlug: 'cafes-chas-chocolates', namePt: 'Mocha', nameEn: 'Mocha', nameEs: 'Mocha', descPt: 'Espresso com chocolate e leite vaporizado', descEn: 'Espresso with chocolate and steamed milk', descEs: 'Espresso con chocolate y leche vaporizada', price: 20, sortOrder: 6 },
    // Águas, Refrigerantes e Sucos
    { catSlug: 'aguas-refri-sucos', namePt: 'Água Mineral sem Gás', nameEn: 'Still Water', nameEs: 'Agua Mineral sin Gas', descPt: '500ml', descEn: '500ml', descEs: '500ml', price: 8, sortOrder: 1 },
    { catSlug: 'aguas-refri-sucos', namePt: 'Água Mineral com Gás', nameEn: 'Sparkling Water', nameEs: 'Agua Mineral con Gas', descPt: '500ml', descEn: '500ml', descEs: '500ml', price: 9, sortOrder: 2 },
    { catSlug: 'aguas-refri-sucos', namePt: 'Refrigerante (lata)', nameEn: 'Soft Drink (can)', nameEs: 'Refresco (lata)', descPt: 'Coca-Cola, Guaraná, Sprite ou Fanta', descEn: 'Coca-Cola, Guaraná, Sprite or Fanta', descEs: 'Coca-Cola, Guaraná, Sprite o Fanta', price: 12, sortOrder: 3 },
    { catSlug: 'aguas-refri-sucos', namePt: 'Suco Natural', nameEn: 'Fresh Juice', nameEs: 'Jugo Natural', descPt: 'Laranja, abacaxi, maracujá, limão ou melancia', descEn: 'Orange, pineapple, passion fruit, lemon or watermelon', descEs: 'Naranja, piña, maracuyá, limón o sandía', price: 18, sortOrder: 4 },
    { catSlug: 'aguas-refri-sucos', namePt: 'Água de Coco', nameEn: 'Coconut Water', nameEs: 'Agua de Coco', descPt: 'Água de coco natural', descEn: 'Natural coconut water', descEs: 'Agua de coco natural', price: 14, sortOrder: 5 },
    // Cervejas
    { catSlug: 'cervejas', namePt: 'Brahma Chopp 600ml', nameEn: 'Brahma Draft 600ml', nameEs: 'Brahma Chopp 600ml', descPt: 'Cerveja pilsen', descEn: 'Pilsen beer', descEs: 'Cerveza pilsen', price: 22, sortOrder: 1 },
    { catSlug: 'cervejas', namePt: 'Heineken Long Neck', nameEn: 'Heineken Long Neck', nameEs: 'Heineken Long Neck', descPt: 'Cerveja premium lager 330ml', descEn: 'Premium lager beer 330ml', descEs: 'Cerveza premium lager 330ml', price: 20, sortOrder: 2 },
    { catSlug: 'cervejas', namePt: 'Stella Artois', nameEn: 'Stella Artois', nameEs: 'Stella Artois', descPt: 'Cerveja premium lager 275ml', descEn: 'Premium lager beer 275ml', descEs: 'Cerveza premium lager 275ml', price: 18, sortOrder: 3 },
    { catSlug: 'cervejas', namePt: 'Corona Extra', nameEn: 'Corona Extra', nameEs: 'Corona Extra', descPt: 'Cerveja mexicana 330ml', descEn: 'Mexican beer 330ml', descEs: 'Cerveza mexicana 330ml', price: 22, sortOrder: 4 },
    { catSlug: 'cervejas', namePt: 'Budweiser Long Neck', nameEn: 'Budweiser Long Neck', nameEs: 'Budweiser Long Neck', descPt: 'Cerveja americana 330ml', descEn: 'American beer 330ml', descEs: 'Cerveza americana 330ml', price: 18, sortOrder: 5 },
    { catSlug: 'cervejas', namePt: 'Cerveja Artesanal IPA', nameEn: 'Craft IPA Beer', nameEs: 'Cerveza Artesanal IPA', descPt: 'IPA artesanal da casa 500ml', descEn: 'House craft IPA 500ml', descEs: 'IPA artesanal de la casa 500ml', price: 32, sortOrder: 6 },
    // Coquetéis
    { catSlug: 'coqueteis', namePt: 'Caipirinha', nameEn: 'Caipirinha', nameEs: 'Caipirinha', descPt: 'Cachaça, limão, açúcar e gelo', descEn: 'Cachaça, lime, sugar and ice', descEs: 'Cachaça, limón, azúcar y hielo', price: 32, sortOrder: 1 },
    { catSlug: 'coqueteis', namePt: 'Mojito', nameEn: 'Mojito', nameEs: 'Mojito', descPt: 'Rum, hortelã, limão, açúcar e água com gás', descEn: 'Rum, mint, lime, sugar and soda', descEs: 'Ron, menta, limón, azúcar y agua con gas', price: 38, sortOrder: 2 },
    { catSlug: 'coqueteis', namePt: 'Gin Tônica', nameEn: 'Gin & Tonic', nameEs: 'Gin Tonic', descPt: 'Gin, água tônica, limão e especiarias', descEn: 'Gin, tonic water, lime and spices', descEs: 'Gin, agua tónica, limón y especias', price: 40, sortOrder: 3 },
    { catSlug: 'coqueteis', namePt: 'Aperol Spritz', nameEn: 'Aperol Spritz', nameEs: 'Aperol Spritz', descPt: 'Aperol, prosecco e água com gás', descEn: 'Aperol, prosecco and soda', descEs: 'Aperol, prosecco y agua con gas', price: 42, sortOrder: 4 },
    { catSlug: 'coqueteis', namePt: 'Margarita', nameEn: 'Margarita', nameEs: 'Margarita', descPt: 'Tequila, triple sec, suco de limão e sal', descEn: 'Tequila, triple sec, lime juice and salt', descEs: 'Tequila, triple sec, jugo de limón y sal', price: 38, sortOrder: 5 },
    { catSlug: 'coqueteis', namePt: 'Cosmopolitan', nameEn: 'Cosmopolitan', nameEs: 'Cosmopolitan', descPt: 'Vodka, triple sec, suco de cranberry e limão', descEn: 'Vodka, triple sec, cranberry juice and lime', descEs: 'Vodka, triple sec, jugo de arándano y limón', price: 40, sortOrder: 6 },
    // Aperitivos & Destilados
    { catSlug: 'aperitivos-destilados', namePt: 'Campari', nameEn: 'Campari', nameEs: 'Campari', descPt: 'Dose 50ml', descEn: '50ml shot', descEs: 'Dosis 50ml', price: 24, sortOrder: 1 },
    { catSlug: 'aperitivos-destilados', namePt: 'Aperol', nameEn: 'Aperol', nameEs: 'Aperol', descPt: 'Dose 50ml', descEn: '50ml shot', descEs: 'Dosis 50ml', price: 22, sortOrder: 2 },
    { catSlug: 'aperitivos-destilados', namePt: 'Vodka Absolut', nameEn: 'Absolut Vodka', nameEs: 'Vodka Absolut', descPt: 'Dose 50ml', descEn: '50ml shot', descEs: 'Dosis 50ml', price: 26, sortOrder: 3 },
    { catSlug: 'aperitivos-destilados', namePt: 'Gin Tanqueray', nameEn: 'Tanqueray Gin', nameEs: 'Gin Tanqueray', descPt: 'Dose 50ml', descEn: '50ml shot', descEs: 'Dosis 50ml', price: 30, sortOrder: 4 },
    { catSlug: 'aperitivos-destilados', namePt: 'Rum Bacardi', nameEn: 'Bacardi Rum', nameEs: 'Ron Bacardi', descPt: 'Dose 50ml', descEn: '50ml shot', descEs: 'Dosis 50ml', price: 24, sortOrder: 5 },
    { catSlug: 'aperitivos-destilados', namePt: 'Tequila José Cuervo', nameEn: 'José Cuervo Tequila', nameEs: 'Tequila José Cuervo', descPt: 'Dose 50ml', descEn: '50ml shot', descEs: 'Dosis 50ml', price: 28, sortOrder: 6 },
    // Whisky
    { catSlug: 'whisky', namePt: 'Johnnie Walker Red Label', nameEn: 'Johnnie Walker Red Label', nameEs: 'Johnnie Walker Red Label', descPt: 'Dose 50ml', descEn: '50ml shot', descEs: 'Dosis 50ml', price: 28, sortOrder: 1 },
    { catSlug: 'whisky', namePt: 'Johnnie Walker Black Label', nameEn: 'Johnnie Walker Black Label', nameEs: 'Johnnie Walker Black Label', descPt: 'Dose 50ml', descEn: '50ml shot', descEs: 'Dosis 50ml', price: 38, sortOrder: 2 },
    { catSlug: 'whisky', namePt: 'Jack Daniel\'s', nameEn: 'Jack Daniel\'s', nameEs: 'Jack Daniel\'s', descPt: 'Dose 50ml', descEn: '50ml shot', descEs: 'Dosis 50ml', price: 32, sortOrder: 3 },
    { catSlug: 'whisky', namePt: 'Chivas Regal 12 anos', nameEn: 'Chivas Regal 12 Year', nameEs: 'Chivas Regal 12 años', descPt: 'Dose 50ml', descEn: '50ml shot', descEs: 'Dosis 50ml', price: 42, sortOrder: 4 },
    { catSlug: 'whisky', namePt: 'Glenfiddich 12 anos', nameEn: 'Glenfiddich 12 Year', nameEs: 'Glenfiddich 12 años', descPt: 'Single malt, dose 50ml', descEn: 'Single malt, 50ml shot', descEs: 'Single malt, dosis 50ml', price: 52, sortOrder: 5 },
    { catSlug: 'whisky', namePt: 'Macallan 12 anos', nameEn: 'Macallan 12 Year', nameEs: 'Macallan 12 años', descPt: 'Single malt, dose 50ml', descEn: 'Single malt, 50ml shot', descEs: 'Single malt, dosis 50ml', price: 65, sortOrder: 6 },
  ];

  for (const item of items) {
    const catId = catMap[item.catSlug];
    if (!catId) continue;
    // Use namePt + categoryId as unique identifier for upsert
    const existing = await prisma.menuItem.findFirst({
      where: { namePt: item.namePt, categoryId: catId },
    });
    if (existing) {
      await prisma.menuItem.update({
        where: { id: existing.id },
        data: {
          nameEn: item.nameEn, nameEs: item.nameEs,
          descPt: item.descPt, descEn: item.descEn, descEs: item.descEs,
          price: item.price, sortOrder: item.sortOrder,
        },
      });
    } else {
      await prisma.menuItem.create({
        data: {
          categoryId: catId,
          namePt: item.namePt, nameEn: item.nameEn, nameEs: item.nameEs,
          descPt: item.descPt, descEn: item.descEn, descEs: item.descEs,
          price: item.price, sortOrder: item.sortOrder,
        },
      });
    }
  }

  // Site settings - default hero background
  await prisma.siteSetting.upsert({
    where: { key: 'heroImageUrl' },
    update: {},
    create: { key: 'heroImageUrl', value: '/hero-bg.jpg' },
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
