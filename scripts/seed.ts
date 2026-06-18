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

  /* Categories */
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
    { slug: 'vinhos', namePt: 'Vinhos', nameEn: 'Wines', nameEs: 'Vinos', descPt: 'Carta de vinhos', descEn: 'Wine list', descEs: 'Carta de vinos', iconUrl: '/icons/wine.svg', sortOrder: 14 },
  ];


  /* SubCategories */
  const subCategories = [
    { catSlug: 'vinhos', slug: 'argentina', namePt: 'Argentina', nameEn: 'Argentina', nameEs: 'Argentina', sortOrder: 1 },
    { catSlug: 'vinhos', slug: 'chile', namePt: 'Chile', nameEn: 'Chile', nameEs: 'Chile', sortOrder: 2 },
    { catSlug: 'vinhos', slug: 'espanha', namePt: 'Espanha', nameEn: 'Spain', nameEs: 'España', sortOrder: 3 },
    { catSlug: 'vinhos', slug: 'franca', namePt: 'França', nameEn: 'France', nameEs: 'Francia', sortOrder: 4 },
    { catSlug: 'vinhos', slug: 'portugal', namePt: 'Portugal', nameEn: 'Portugal', nameEs: 'Portugal', sortOrder: 5 },
    { catSlug: 'vinhos', slug: 'brasil', namePt: 'Brasil', nameEn: 'Brazil', nameEs: 'Brasil', sortOrder: 6 },
    { catSlug: 'vinhos', slug: 'italia', namePt: 'Itália', nameEn: 'Italy', nameEs: 'Italia', sortOrder: 7 },
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

  const subCatMap: Record<string, string> = {};
  for (const sub of subCategories) {
    const categoryId = catMap[sub.catSlug];

    const subCategory = await prisma.subCategory.upsert({
      where: {
        categoryId_slug: {
          categoryId,
          slug: sub.slug,
        },
      },
      update: {
        namePt: sub.namePt,
        nameEn: sub.nameEn,
        nameEs: sub.nameEs,
        sortOrder: sub.sortOrder,
      },
      create: {
        categoryId,
        slug: sub.slug,
        namePt: sub.namePt,
        nameEn: sub.nameEn,
        nameEs: sub.nameEs,
        sortOrder: sub.sortOrder,
        active: true,
      },
    });

    subCatMap[sub.slug] = subCategory.id;
  }

  // Menu Items - using upsert by unique combination
  const items: { catSlug: string; subCategorySlug?: string; wineType?: string; namePt: string; nameEn: string; nameEs: string; descPt: string; descEn: string; descEs: string; price: number; sortOrder: number }[] = [
    // Sandwiches
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
    // Vinhos
    { catSlug: 'vinhos', subCategorySlug: 'argentina', wineType: 'Branco', namePt: 'Pirkko Pedro Gimenez', nameEn: 'Pirkko Pedro Gimenez', nameEs: 'Pirkko Pedro Gimenez', descPt: 'É um vinho fresco e jovem, que pode ser apreciado nos primeiros anos após sua colheita. É um varietal 100%, regido de Mendoza. Com aromas cítricos.', descEn: 'É um vinho fresco e jovem, que pode ser apreciado nos primeiros anos após sua colheita. É um varietal 100%, regido de Mendoza. Com aromas cítricos.', descEs: 'É um vinho fresco e jovem, que pode ser apreciado nos primeiros anos após sua colheita. É um varietal 100%, regido de Mendoza. Com aromas cítricos.', price: 90, sortOrder: 1 },
    { catSlug: 'vinhos', subCategorySlug: 'argentina', wineType: 'Tinto', namePt: 'Pirkko Malbec', nameEn: 'Pirkko Malbec', nameEs: 'Pirkko Malbec', descPt: 'É um vinho fresco e jovem, que pode ser apreciado nos primeiros anos após sua colheita. É um varietal 100% vinificado apenas com a uva Malbec de Perdriel em Luján de Cuyo, a primeira região de Mendoza. Aromas de frutas vermelhas.', descEn: 'É um vinho fresco e jovem, que pode ser apreciado nos primeiros anos após sua colheita. É um varietal 100% vinificado apenas com a uva Malbec de Perdriel em Luján de Cuyo, a primeira região de Mendoza. Aromas de frutas vermelhas.', descEs: 'É um vinho fresco e jovem, que pode ser apreciado nos primeiros anos após sua colheita. É um varietal 100% vinificado apenas com a uva Malbec de Perdriel em Luján de Cuyo, a primeira região de Mendoza. Aromas de frutas vermelhas.', price: 90, sortOrder: 2 },
    { catSlug: 'vinhos', subCategorySlug: 'argentina', wineType: 'Tinto', namePt: 'Pirkko Cabernet Sauvignon', nameEn: 'Pirkko Cabernet Sauvignon', nameEs: 'Pirkko Cabernet Sauvignon', descPt: 'Vinho de cor granada, com aromas de frutas vermelhas. É 100% varietal de Cabernet Sauvignon e representa toda a tipicidade desta uva.', descEn: 'Vinho de cor granada, com aromas de frutas vermelhas. É 100% varietal de Cabernet Sauvignon e representa toda a tipicidade desta uva.', descEs: 'Vinho de cor granada, com aromas de frutas vermelhas. É 100% varietal de Cabernet Sauvignon e representa toda a tipicidade desta uva.', price: 90, sortOrder: 3 },
    { catSlug: 'vinhos', subCategorySlug: 'argentina', wineType: 'Tinto', namePt: 'Canal Flores Malbec', nameEn: 'Canal Flores Malbec', nameEs: 'Canal Flores Malbec', descPt: 'Intensidade profunda na cor vermelha com tons violáceos. Aromas elegantes e frescos de matices e frutas negras.', descEn: 'Intensidade profunda na cor vermelha com tons violáceos. Aromas elegantes e frescos de matices e frutas negras.', descEs: 'Intensidade profunda na cor vermelha com tons violáceos. Aromas elegantes e frescos de matices e frutas negras.', price: 143, sortOrder: 4 },
    { catSlug: 'vinhos', subCategorySlug: 'espanha', wineType: 'Espumante', namePt: 'Champanhe Codorniu', nameEn: 'Codorniu Sparkling Wine', nameEs: 'Espumante Codorniu', descPt: 'Aroma pálido claro e vivo, com delicado perlage. Aromas frutados provenientes da assemblage de diferentes variedades e do envelhecimento na garrafa. Equilibrado, fresco e agradável livre de açúcar.', descEn: 'Aroma pálido claro e vivo, com delicado perlage. Aromas frutados provenientes da assemblage de diferentes variedades e do envelhecimento na garrafa. Equilibrado, fresco e agradável livre de açúcar.', descEs: 'Aroma pálido claro e vivo, com delicado perlage. Aromas frutados provenientes da assemblage de diferentes variedades e do envelhecimento na garrafa. Equilibrado, fresco e agradável livre de açúcar.', price: 104, sortOrder: 5 },
    { catSlug: 'vinhos', subCategorySlug: 'brasil', wineType: 'Espumante', namePt: 'Champanhe Salton Moscatel', nameEn: 'Salton Moscatel Sparkling Wine', nameEs: 'Espumante Salton Moscatel', descPt: 'Acidez de espumante equilibrada, com doçura e cremosidade. O paladar deixa uma agradável sensação frutada na boca, com aromas essencialmente frutados e florais. Ideal para acompanhar doces e frutas.', descEn: 'Acidez de espumante equilibrada, com doçura e cremosidade. O paladar deixa uma agradável sensação frutada na boca, com aromas essencialmente frutados e florais. Ideal para acompanhar doces e frutas.', descEs: 'Acidez de espumante equilibrada, com doçura e cremosidade. O paladar deixa uma agradável sensação frutada na boca, com aromas essencialmente frutados e florais. Ideal para acompanhar doces e frutas.', price: 44, sortOrder: 6 },
    { catSlug: 'vinhos', subCategorySlug: 'espanha', wineType: 'Tinto', namePt: 'Posadas Viejas Tempranillo IGP - Cosecheros y Criadores', nameEn: 'Posadas Viejas Tempranillo IGP - Cosecheros y Criadores', nameEs: 'Posadas Viejas Tempranillo IGP - Cosecheros y Criadores', descPt: 'Na contramão dos vinhos espanhóis modernos e encorpados, o Posadas Viejas remete aos vinhos de antigamente, com boa acidez e notas balsâmicas.', descEn: 'Na contramão dos vinhos espanhóis modernos e encorpados, o Posadas Viejas remete aos vinhos de antigamente, com boa acidez e notas balsâmicas.', descEs: 'Na contramão dos vinhos espanhóis modernos e encorpados, o Posadas Viejas remete aos vinhos de antigamente, com boa acidez e notas balsâmicas.', price: 108, sortOrder: 7 },
    { catSlug: 'vinhos', subCategorySlug: 'argentina', wineType: 'Tinto', namePt: 'Alamos Malbec 375ml - Alamos', nameEn: 'Alamos Malbec 375ml - Alamos', nameEs: 'Alamos Malbec 375ml - Alamos', descPt: 'Meia garrafa 375ml. Alamos Malbec - Alamos/Argentina.', descEn: 'Meia garrafa 375ml. Alamos Malbec - Alamos/Argentina.', descEs: 'Meia garrafa 375ml. Alamos Malbec - Alamos/Argentina.', price: 116, sortOrder: 8 },
    { catSlug: 'vinhos', subCategorySlug: 'argentina', wineType: 'Tinto', namePt: 'Catena Malbec 375ml - Catena Zapata', nameEn: 'Catena Malbec 375ml - Catena Zapata', nameEs: 'Catena Malbec 375ml - Catena Zapata', descPt: 'Meia garrafa 375ml. Catena Malbec - Catena Zapata/Argentina.', descEn: 'Meia garrafa 375ml. Catena Malbec - Catena Zapata/Argentina.', descEs: 'Meia garrafa 375ml. Catena Malbec - Catena Zapata/Argentina.', price: 164, sortOrder: 9 },
    { catSlug: 'vinhos', subCategorySlug: 'chile', wineType: 'Tinto', namePt: 'Carmen Insigne Carmenère 375ml - Viña Carmen', nameEn: 'Carmen Insigne Carmenère 375ml - Viña Carmen', nameEs: 'Carmen Insigne Carmenère 375ml - Viña Carmen', descPt: 'Meia garrafa 375ml. Carmen Insigne Carmenère - Viña Carmen/Chile.', descEn: 'Meia garrafa 375ml. Carmen Insigne Carmenère - Viña Carmen/Chile.', descEs: 'Meia garrafa 375ml. Carmen Insigne Carmenère - Viña Carmen/Chile.', price: 84, sortOrder: 10 },
    { catSlug: 'vinhos', subCategorySlug: 'chile', wineType: 'Branco', namePt: 'Carmen Insigne Sauvignon Blanc 375ml - Viña Carmen', nameEn: 'Carmen Insigne Sauvignon Blanc 375ml - Viña Carmen', nameEs: 'Carmen Insigne Sauvignon Blanc 375ml - Viña Carmen', descPt: 'Meia garrafa 375ml. Carmen Insigne Sauvignon Blanc - Viña Carmen/Chile.', descEn: 'Meia garrafa 375ml. Carmen Insigne Sauvignon Blanc - Viña Carmen/Chile.', descEs: 'Meia garrafa 375ml. Carmen Insigne Sauvignon Blanc - Viña Carmen/Chile.', price: 84, sortOrder: 11 },
    { catSlug: 'vinhos', subCategorySlug: 'chile', wineType: 'Tinto', namePt: 'Carmen Cabernet Sauvignon 375ml - Viña Carmen', nameEn: 'Carmen Cabernet Sauvignon 375ml - Viña Carmen', nameEs: 'Carmen Cabernet Sauvignon 375ml - Viña Carmen', descPt: 'Meia garrafa 375ml. Carmen Cabernet Sauvignon - Viña Carmen/Chile.', descEn: 'Meia garrafa 375ml. Carmen Cabernet Sauvignon - Viña Carmen/Chile.', descEs: 'Meia garrafa 375ml. Carmen Cabernet Sauvignon - Viña Carmen/Chile.', price: 84, sortOrder: 12 },
    { catSlug: 'vinhos', subCategorySlug: 'franca', wineType: 'Rose', namePt: 'Rosé Le Temps des Vendanges Malbec Rosé', nameEn: 'Rosé Le Temps des Vendanges Malbec Rosé', nameEs: 'Rosé Le Temps des Vendanges Malbec Rosé', descPt: 'Elaborado com uma uva Malbec, combina aromas de frutas do bosque com um palato fresco e convidativo.', descEn: 'Elaborado com uma uva Malbec, combina aromas de frutas do bosque com um palato fresco e convidativo.', descEs: 'Elaborado com uma uva Malbec, combina aromas de frutas do bosque com um palato fresco e convidativo.', price: 191, sortOrder: 13 },
    { catSlug: 'vinhos', subCategorySlug: 'portugal', wineType: 'Tinto', namePt: 'Luis Pato Baga Touriga Nacional IGP - Luis Pato', nameEn: 'Luis Pato Baga Touriga Nacional IGP - Luis Pato', nameEs: 'Luis Pato Baga Touriga Nacional IGP - Luis Pato', descPt: 'Muito aromático, saboroso e com taninos marcantes, mas redondos.', descEn: 'Muito aromático, saboroso e com taninos marcantes, mas redondos.', descEs: 'Muito aromático, saboroso e com taninos marcantes, mas redondos.', price: 231, sortOrder: 14 },
    { catSlug: 'vinhos', subCategorySlug: 'brasil', wineType: 'Espumante', namePt: 'Vallontano Espumante Moscatel - Vallontano', nameEn: 'Vallontano Moscatel Sparkling Wine - Vallontano', nameEs: 'Espumante Moscatel Vallontano - Vallontano', descPt: 'Elaborado com a uva Moscatel, é delicadamente adocicado, sendo perfeito para acompanhar bolos e sobremesas leves, ou para aperitivos.', descEn: 'Elaborado com a uva Moscatel, é delicadamente adocicado, sendo perfeito para acompanhar bolos e sobremesas leves, ou para aperitivos.', descEs: 'Elaborado com a uva Moscatel, é delicadamente adocicado, sendo perfeito para acompanhar bolos e sobremesas leves, ou para aperitivos.', price: 165, sortOrder: 15 },
    { catSlug: 'vinhos', subCategorySlug: 'brasil', wineType: 'Espumante', namePt: 'Talise Espumante Brut - Talise', nameEn: 'Talise Brut Sparkling Wine - Talise', nameEs: 'Espumante Brut Talise - Talise', descPt: 'Com caráter leve e convidativo, repleto de notas frescas aromáticas.', descEn: 'Com caráter leve e convidativo, repleto de notas frescas aromáticas.', descEs: 'Com caráter leve e convidativo, repleto de notas frescas aromáticas.', price: 153, sortOrder: 16 },
    { catSlug: 'vinhos', subCategorySlug: 'brasil', wineType: 'Rose', namePt: 'Vallontano Espumante Rosé Brut - Vallontano', nameEn: 'Vallontano Rosé Brut Sparkling Wine - Vallontano', nameEs: 'Espumante Rosé Brut Vallontano - Vallontano', descPt: 'Sedutores aromas de frutas vermelhas e ótima presença no palato. É um vinho versátil, de minúscula produção, que combina com uma infinidade de pratos.', descEn: 'Sedutores aromas de frutas vermelhas e ótima presença no palato. É um vinho versátil, de minúscula produção, que combina com uma infinidade de pratos.', descEs: 'Sedutores aromas de frutas vermelhas e ótima presença no palato. É um vinho versátil, de minúscula produção, que combina com uma infinidade de pratos.', price: 175, sortOrder: 17 },
    { catSlug: 'vinhos', subCategorySlug: 'chile', wineType: 'Branco', namePt: 'Los Vascos Chardonnay - Los Vascos (Rothschild-Lafite)', nameEn: 'Los Vascos Chardonnay - Los Vascos (Rothschild-Lafite)', nameEs: 'Los Vascos Chardonnay - Los Vascos (Rothschild-Lafite)', descPt: 'Um Chardonnay saboroso e versátil, para ter sempre em casa.', descEn: 'Um Chardonnay saboroso e versátil, para ter sempre em casa.', descEs: 'Um Chardonnay saboroso e versátil, para ter sempre em casa.', price: 222, sortOrder: 18 },
    { catSlug: 'vinhos', subCategorySlug: 'chile', wineType: 'Branco', namePt: 'Carmen Insigne Sauvignon Blanc - Viña Carmen', nameEn: 'Carmen Insigne Sauvignon Blanc - Viña Carmen', nameEs: 'Carmen Insigne Sauvignon Blanc - Viña Carmen', descPt: 'Um branco saboroso, cheio de charme e frescor.', descEn: 'Um branco saboroso, cheio de charme e frescor.', descEs: 'Um branco saboroso, cheio de charme e frescor.', price: 124, sortOrder: 19 },
    { catSlug: 'vinhos', subCategorySlug: 'chile', wineType: 'Rose', namePt: 'Carmen Aperitif Cabernet Sauvignon - Viña Carmen', nameEn: 'Carmen Aperitif Cabernet Sauvignon - Viña Carmen', nameEs: 'Carmen Aperitif Cabernet Sauvignon - Viña Carmen', descPt: 'Inspirado nos rosados da Provence, o Aperitif é fresco, leve e delicado.', descEn: 'Inspirado nos rosados da Provence, o Aperitif é fresco, leve e delicado.', descEs: 'Inspirado nos rosados da Provence, o Aperitif é fresco, leve e delicado.', price: 124, sortOrder: 20 },
    { catSlug: 'vinhos', subCategorySlug: 'chile', wineType: 'Tinto', namePt: 'Carmen Premier Pinot Noir - Viña Carmen', nameEn: 'Carmen Premier Pinot Noir - Viña Carmen', nameEs: 'Carmen Premier Pinot Noir - Viña Carmen', descPt: 'Combina exuberantes notas de frutas maduras com uma textura sedosa no palato.', descEn: 'Combina exuberantes notas de frutas maduras com uma textura sedosa no palato.', descEs: 'Combina exuberantes notas de frutas maduras com uma textura sedosa no palato.', price: 183, sortOrder: 21 },
    { catSlug: 'vinhos', subCategorySlug: 'chile', wineType: 'Tinto', namePt: 'Carmen Insigne Carmenère - Viña Carmen', nameEn: 'Carmen Insigne Carmenère - Viña Carmen', nameEs: 'Carmen Insigne Carmenère - Viña Carmen', descPt: 'É parcialmente barricado, para manter toda a exuberância da fruta. O bouquet é bastante complexo e cativante. Na boca mostra taninos suaves e macios, com sabor de geleia de frutas vermelhas, notas de menta e especiarias.', descEn: 'É parcialmente barricado, para manter toda a exuberância da fruta. O bouquet é bastante complexo e cativante. Na boca mostra taninos suaves e macios, com sabor de geleia de frutas vermelhas, notas de menta e especiarias.', descEs: 'É parcialmente barricado, para manter toda a exuberância da fruta. O bouquet é bastante complexo e cativante. Na boca mostra taninos suaves e macios, com sabor de geleia de frutas vermelhas, notas de menta e especiarias.', price: 124, sortOrder: 22 },
    { catSlug: 'vinhos', subCategorySlug: 'chile', wineType: 'Tinto', namePt: 'Carmen Insigne Cabernet Sauvignon - Viña Carmen', nameEn: 'Carmen Insigne Cabernet Sauvignon - Viña Carmen', nameEs: 'Carmen Insigne Cabernet Sauvignon - Viña Carmen', descPt: 'Mostra boa tipicidade em um conjunto muito equilibrado e agradável, fácil de gostar.', descEn: 'Mostra boa tipicidade em um conjunto muito equilibrado e agradável, fácil de gostar.', descEs: 'Mostra boa tipicidade em um conjunto muito equilibrado e agradável, fácil de gostar.', price: 124, sortOrder: 23 },
    { catSlug: 'vinhos', subCategorySlug: 'chile', wineType: 'Tinto', namePt: 'Carmen Insigne Merlot Central D.O. - Viña Carmen', nameEn: 'Carmen Insigne Merlot Central D.O. - Viña Carmen', nameEs: 'Carmen Insigne Merlot Central D.O. - Viña Carmen', descPt: 'Insigne Merlot é saboroso, macio e cheio de fruta, lembrando um ótimo petit château de Bordeaux.', descEn: 'Insigne Merlot é saboroso, macio e cheio de fruta, lembrando um ótimo petit château de Bordeaux.', descEs: 'Insigne Merlot é saboroso, macio e cheio de fruta, lembrando um ótimo petit château de Bordeaux.', price: 124, sortOrder: 24 },
    { catSlug: 'vinhos', subCategorySlug: 'chile', wineType: 'Tinto', namePt: 'Carmen Gran Reserva Merlot - Viña Carmen', nameEn: 'Carmen Gran Reserva Merlot - Viña Carmen', nameEs: 'Carmen Gran Reserva Merlot - Viña Carmen', descPt: 'É um tinto rico e sedoso, com cativantes notas de frutas maduras e diversas camadas de sabores no palato.', descEn: 'É um tinto rico e sedoso, com cativantes notas de frutas maduras e diversas camadas de sabores no palato.', descEs: 'É um tinto rico e sedoso, com cativantes notas de frutas maduras e diversas camadas de sabores no palato.', price: 319, sortOrder: 25 },
    { catSlug: 'vinhos', subCategorySlug: 'italia', wineType: 'Espumante', namePt: 'Prosecco Di Valdobbiadene - Le Colture', nameEn: 'Prosecco Di Valdobbiadene - Le Colture', nameEs: 'Prosecco Di Valdobbiadene - Le Colture', descPt: 'Feito com uvas de variedade glera, colhidas manualmente entre os meses de setembro e outubro.', descEn: 'Feito com uvas de variedade glera, colhidas manualmente entre os meses de setembro e outubro.', descEs: 'Feito com uvas de variedade glera, colhidas manualmente entre os meses de setembro e outubro.', price: 243, sortOrder: 26 },
    { catSlug: 'vinhos', subCategorySlug: 'italia', wineType: 'Tinto', namePt: 'Montepulciano d’Abruzzo - Bonacchi', nameEn: 'Montepulciano d’Abruzzo - Bonacchi', nameEs: 'Montepulciano d’Abruzzo - Bonacchi', descPt: 'Tinto elaborado com 85% de Montepulciano e 15% de outras cepas escuras, na região do Abruzzo. Apresenta um odor vinoso e um sabor seco e macio.', descEn: 'Tinto elaborado com 85% de Montepulciano e 15% de outras cepas escuras, na região do Abruzzo. Apresenta um odor vinoso e um sabor seco e macio.', descEs: 'Tinto elaborado com 85% de Montepulciano e 15% de outras cepas escuras, na região do Abruzzo. Apresenta um odor vinoso e um sabor seco e macio.', price: 132, sortOrder: 27 },
    { catSlug: 'vinhos', subCategorySlug: 'italia', wineType: 'Tinto', namePt: 'Chianti Gentilesco DOCG - Bonacchi', nameEn: 'Chianti Gentilesco DOCG - Bonacchi', nameEs: 'Chianti Gentilesco DOCG - Bonacchi', descPt: 'Um Chianti frutado e com boa acidez, perfeito para combinar com comida.', descEn: 'Um Chianti frutado e com boa acidez, perfeito para combinar com comida.', descEs: 'Um Chianti frutado e com boa acidez, perfeito para combinar com comida.', price: 207, sortOrder: 28 },
    { catSlug: 'vinhos', subCategorySlug: 'argentina', wineType: 'Branco', namePt: 'Catena Chardonnay - Catena Zapata', nameEn: 'Catena Chardonnay - Catena Zapata', nameEs: 'Catena Chardonnay - Catena Zapata', descPt: 'Excelente branco barricado em madeira francesa, feito apenas com uvas Chardonnay. Tem um bouquet cativante com aromas de frutas brancas e nota mineral.', descEn: 'Excelente branco barricado em madeira francesa, feito apenas com uvas Chardonnay. Tem um bouquet cativante com aromas de frutas brancas e nota mineral.', descEs: 'Excelente branco barricado em madeira francesa, feito apenas com uvas Chardonnay. Tem um bouquet cativante com aromas de frutas brancas e nota mineral.', price: 271, sortOrder: 29 },
    { catSlug: 'vinhos', subCategorySlug: 'argentina', wineType: 'Branco', namePt: 'Alamos Chardonnay - Alamos', nameEn: 'Alamos Chardonnay - Alamos', nameEs: 'Alamos Chardonnay - Alamos', descPt: 'Para Robert Parker, é um maravilhoso value. Indicado como Best Buy pela Wine Spectator pelo quinto ano consecutivo e, segundo Jancis Robinson, uma incrível barganha.', descEn: 'Para Robert Parker, é um maravilhoso value. Indicado como Best Buy pela Wine Spectator pelo quinto ano consecutivo e, segundo Jancis Robinson, uma incrível barganha.', descEs: 'Para Robert Parker, é um maravilhoso value. Indicado como Best Buy pela Wine Spectator pelo quinto ano consecutivo e, segundo Jancis Robinson, uma incrível barganha.', price: 164, sortOrder: 30 },
    { catSlug: 'vinhos', subCategorySlug: 'argentina', wineType: 'Branco', namePt: 'Uxmal Chardonnay - Bodegas Uxmal', nameEn: 'Uxmal Chardonnay - Bodegas Uxmal', nameEs: 'Uxmal Chardonnay - Bodegas Uxmal', descPt: 'É um vinho elegante e saboroso, mostrando notas de frutas tropicais e um discreto e refinado toque de carvalho francês, em um conjunto muito fino e equilibrado.', descEn: 'É um vinho elegante e saboroso, mostrando notas de frutas tropicais e um discreto e refinado toque de carvalho francês, em um conjunto muito fino e equilibrado.', descEs: 'É um vinho elegante e saboroso, mostrando notas de frutas tropicais e um discreto e refinado toque de carvalho francês, em um conjunto muito fino e equilibrado.', price: 143, sortOrder: 31 },
    { catSlug: 'vinhos', subCategorySlug: 'argentina', wineType: 'Branco', namePt: 'Alamos Viognier - Alamos (Catena Zapata)', nameEn: 'Alamos Viognier - Alamos (Catena Zapata)', nameEs: 'Alamos Viognier - Alamos (Catena Zapata)', descPt: 'Na boca apresenta bom corpo, acidez refrescante e um delicioso final mineral.', descEn: 'Na boca apresenta bom corpo, acidez refrescante e um delicioso final mineral.', descEs: 'Na boca apresenta bom corpo, acidez refrescante e um delicioso final mineral.', price: 164, sortOrder: 32 },
    { catSlug: 'vinhos', subCategorySlug: 'argentina', wineType: 'Tinto', namePt: 'Uxmal Malbec - Bodegas Uxmal', nameEn: 'Uxmal Malbec - Bodegas Uxmal', nameEs: 'Uxmal Malbec - Bodegas Uxmal', descPt: 'É um excelente corte, cheio de fruta e com delicioso toque de carvalho. Na boca é rico, concentrado e macio. Super redondo e agradável.', descEn: 'É um excelente corte, cheio de fruta e com delicioso toque de carvalho. Na boca é rico, concentrado e macio. Super redondo e agradável.', descEs: 'É um excelente corte, cheio de fruta e com delicioso toque de carvalho. Na boca é rico, concentrado e macio. Super redondo e agradável.', price: 151, sortOrder: 33 },
    { catSlug: 'vinhos', subCategorySlug: 'argentina', wineType: 'Tinto', namePt: 'Alamos Malbec - Alamos', nameEn: 'Alamos Malbec - Alamos', nameEs: 'Alamos Malbec - Alamos', descPt: 'Ele tem um estilo elegante e sofisticado, bem francês para Jancis Robinson, é sempre um Best Value para a Wine Spectator e é considerado um excellent value por Parker.', descEn: 'Ele tem um estilo elegante e sofisticado, bem francês para Jancis Robinson, é sempre um Best Value para a Wine Spectator e é considerado um excellent value por Parker.', descEs: 'Ele tem um estilo elegante e sofisticado, bem francês para Jancis Robinson, é sempre um Best Value para a Wine Spectator e é considerado um excellent value por Parker.', price: 164, sortOrder: 34 },
    { catSlug: 'vinhos', subCategorySlug: 'argentina', wineType: 'Tinto', namePt: 'Alamos Cabernet Sauvignon - Alamos', nameEn: 'Alamos Cabernet Sauvignon - Alamos', nameEs: 'Alamos Cabernet Sauvignon - Alamos', descPt: 'Classificado como outstanding por Robert Parker, para quem é um vinho com um estilo de Velho Mundo, com maravilhoso toque terroso e um classicismo no final de boca que lembra um Bordeaux. Um vinho excelente.', descEn: 'Classificado como outstanding por Robert Parker, para quem é um vinho com um estilo de Velho Mundo, com maravilhoso toque terroso e um classicismo no final de boca que lembra um Bordeaux. Um vinho excelente.', descEs: 'Classificado como outstanding por Robert Parker, para quem é um vinho com um estilo de Velho Mundo, com maravilhoso toque terroso e um classicismo no final de boca que lembra um Bordeaux. Um vinho excelente.', price: 164, sortOrder: 35 },
    { catSlug: 'vinhos', subCategorySlug: 'argentina', wineType: 'Tinto', namePt: 'Alamos Tempranillo - Alamos', nameEn: 'Alamos Tempranillo - Alamos', nameEs: 'Alamos Tempranillo - Alamos', descPt: 'Celebrada casta espanhola se adaptou muito bem a este microclima argentino. Rico, cheio de fruta madura e muito saboroso, mostrando elegantes notas de carvalho, é um tinto cativante.', descEn: 'Celebrada casta espanhola se adaptou muito bem a este microclima argentino. Rico, cheio de fruta madura e muito saboroso, mostrando elegantes notas de carvalho, é um tinto cativante.', descEs: 'Celebrada casta espanhola se adaptou muito bem a este microclima argentino. Rico, cheio de fruta madura e muito saboroso, mostrando elegantes notas de carvalho, é um tinto cativante.', price: 159, sortOrder: 36 },
    { catSlug: 'vinhos', subCategorySlug: 'argentina', wineType: 'Tinto', namePt: 'Alamos Red Blend - Alamos', nameEn: 'Alamos Red Blend - Alamos', nameEs: 'Alamos Red Blend - Alamos', descPt: 'Concentrado, redondo, frutado, aveludado e com aromas de frutas maduras, especiarias, notas terrosas e madeira bem integrada.', descEn: 'Concentrado, redondo, frutado, aveludado e com aromas de frutas maduras, especiarias, notas terrosas e madeira bem integrada.', descEs: 'Concentrado, redondo, frutado, aveludado e com aromas de frutas maduras, especiarias, notas terrosas e madeira bem integrada.', price: 164, sortOrder: 37 },
    { catSlug: 'vinhos', subCategorySlug: 'argentina', wineType: 'Tinto', namePt: 'Catena Malbec - Catena Zapata', nameEn: 'Catena Malbec - Catena Zapata', nameEs: 'Catena Malbec - Catena Zapata', descPt: 'Trata-se de um tinto encantador, com concentração e intensidade, mas também charme e muito caráter. Segundo Jancis Robinson, tem a estrutura de um Bordeaux, oferece mais do que o esperado, e é tão bom.', descEn: 'Trata-se de um tinto encantador, com concentração e intensidade, mas também charme e muito caráter. Segundo Jancis Robinson, tem a estrutura de um Bordeaux, oferece mais do que o esperado, e é tão bom.', descEs: 'Trata-se de um tinto encantador, com concentração e intensidade, mas também charme e muito caráter. Segundo Jancis Robinson, tem a estrutura de um Bordeaux, oferece mais do que o esperado, e é tão bom.', price: 284, sortOrder: 38 },
    { catSlug: 'vinhos', subCategorySlug: 'argentina', wineType: 'Tinto', namePt: 'Alma Negra Tinto - Tikal (Ernesto Catena)', nameEn: 'Alma Negra Tinto - Tikal (Ernesto Catena)', nameEs: 'Alma Negra Tinto - Tikal (Ernesto Catena)', descPt: 'Alma Negra é um delicioso corte secreto de Tikal, que não revela quais uvas ou qual a proporção que entra neste intrigante blend.', descEn: 'Alma Negra é um delicioso corte secreto de Tikal, que não revela quais uvas ou qual a proporção que entra neste intrigante blend.', descEs: 'Alma Negra é um delicioso corte secreto de Tikal, que não revela quais uvas ou qual a proporção que entra neste intrigante blend.', price: 355, sortOrder: 39 },
    { catSlug: 'vinhos', subCategorySlug: 'argentina', wineType: 'Tinto', namePt: 'DV Catena Syrah-Syrah - Catena Zapata', nameEn: 'DV Catena Syrah-Syrah - Catena Zapata', nameEs: 'DV Catena Syrah-Syrah - Catena Zapata', descPt: 'Rico e profundo, com ótima complexidade, mostra um bouquet complexo e convidativo, cheio de nuances.', descEn: 'Rico e profundo, com ótima complexidade, mostra um bouquet complexo e convidativo, cheio de nuances.', descEs: 'Rico e profundo, com ótima complexidade, mostra um bouquet complexo e convidativo, cheio de nuances.', price: 332, sortOrder: 40 },
  ];

  for (const item of items) {
    const catId = catMap[item.catSlug];

    if (!catId) continue;

    const subCategoryId = item.subCategorySlug
      ? subCatMap[item.subCategorySlug]
      : null;

    const existing = await prisma.menuItem.findFirst({
      where: { namePt: item.namePt, categoryId: catId },
    });

    if (existing) {
      await prisma.menuItem.update({
        where: { id: existing.id },
        data: {
          nameEn: item.nameEn,
          nameEs: item.nameEs,
          descPt: item.descPt,
          descEn: item.descEn,
          descEs: item.descEs,
          price: item.price,
          sortOrder: item.sortOrder,
          subCategoryId,
          wineType: item.wineType ?? null,
        },
      });
    } else {
      await prisma.menuItem.create({
        data: {
          categoryId: catId,
          subCategoryId,
          wineType: item.wineType ?? null,
          namePt: item.namePt,
          nameEn: item.nameEn,
          nameEs: item.nameEs,
          descPt: item.descPt,
          descEn: item.descEn,
          descEs: item.descEs,
          price: item.price,
          sortOrder: item.sortOrder,
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