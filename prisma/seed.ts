import { prisma } from "../src/lib/db";
import { hashPassword } from "../src/lib/auth";

async function main() {
  await prisma.revokedToken.deleteMany();
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.promotion.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await hashPassword("Admin123!");
  const userPassword = await hashPassword("User123!");

  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@coffee.com",
      passwordHash: adminPassword,
      role: "admin",
      phone: "555-0000",
      addresses: [{ line1: "1 Admin Way", city: "Brewville", zip: "12345" }],
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: "Jamie Customer",
      email: "jamie@coffee.com",
      passwordHash: userPassword,
      role: "customer",
      phone: "555-1111",
      addresses: [{ line1: "99 Bean St", city: "Roastown", zip: "54321" }],
    },
  });

  const espresso = await prisma.category.create({
    data: { name: "Espresso", description: "Rich espresso drinks", slug: "espresso" },
  });
  const coldBrew = await prisma.category.create({
    data: { name: "Cold Brew", description: "Chilled coffee", slug: "cold-brew" },
  });
  const pastries = await prisma.category.create({
    data: { name: "Pastries", description: "Fresh baked", slug: "pastries" },
  });

  const products = await prisma.product.createMany({
    data: [
      {
        name: "Classic Espresso",
        description: "Bold and intense single shot",
        price: 3.5,
        categoryId: espresso.id,
        tags: ["bold", "hot"],
        imageUrls: ["/images/espresso.jpg"],
        available: true,
        inventoryCount: 100,
        featured: true,
      },
      {
        name: "Vanilla Latte",
        description: "Creamy latte with vanilla",
        price: 4.75,
        categoryId: espresso.id,
        tags: ["sweet", "milk"],
        imageUrls: ["/images/latte.jpg"],
        available: true,
        inventoryCount: 75,
        featured: true,
      },
      {
        name: "Cold Brew",
        description: "Slow-steeped cold brew",
        price: 4.25,
        categoryId: coldBrew.id,
        tags: ["cold", "smooth"],
        imageUrls: ["/images/coldbrew.jpg"],
        available: true,
        inventoryCount: 60,
        featured: false,
      },
      {
        name: "Croissant",
        description: "Buttery flaky pastry",
        price: 3.0,
        categoryId: pastries.id,
        tags: ["baked"],
        imageUrls: ["/images/croissant.jpg"],
        available: true,
        inventoryCount: 40,
        featured: false,
      },
    ],
  });

  const productList = await prisma.product.findMany();

  await prisma.promotion.createMany({
    data: [
      {
        code: "WELCOME10",
        discountType: "percent",
        value: 10,
        validFrom: new Date(Date.now() - 1000 * 60 * 60 * 24),
        validTo: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        active: true,
      },
      {
        code: "FIVEOFF",
        discountType: "fixed",
        value: 5,
        validFrom: new Date(Date.now() - 1000 * 60 * 60 * 24),
        validTo: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        active: true,
      },
    ],
  });

  const order = await prisma.order.create({
    data: {
      userId: customer.id,
      totalAmount: 8.25,
      status: "confirmed",
      paymentStatus: "paid",
      shippingAddress: { line1: "99 Bean St", city: "Roastown", zip: "54321" },
      items: {
        create: [
          {
            productId: productList[0].id,
            quantity: 1,
            price: productList[0].price,
          },
          {
            productId: productList[2].id,
            quantity: 1,
            price: productList[2].price,
          },
        ],
      },
    },
  });

  await prisma.review.create({
    data: {
      productId: productList[0].id,
      userId: customer.id,
      rating: 5,
      comment: "Amazing espresso!",
    },
  });

  await prisma.cart.create({
    data: {
      userId: customer.id,
      items: [{ productId: productList[1].id, quantity: 2 }],
    },
  });

  console.log({ admin, customer, products, order });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
