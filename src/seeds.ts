import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Création de quelques utilisateurs
  const user1 = await prisma.user.create({
    data: {
      lastname: "Doe",
      firstname: "John",
      phone: "771234567",
      city: "Dakar",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      lastname: "Smith",
      firstname: "Jane",
      phone: "772345678",
      city: "Dakar",
    },
  });

  // Création des comptes associés aux utilisateurs
  const compte1 = await prisma.compte.create({
    data: {
      email: "john.doe@example.com",
      password: "$2b$12$wRBcuddac.LKstMEb3hhiuSO1h5ubuPL7YBNaWCW.fLA/1L2MNIqC",
      role: "tailleur",
      etat: "active",
      identifiant: "john_doe",
      bio: "User bio",
      credit: 100,
      user_id: user1.id,
    },
  });

  const compte2 = await prisma.compte.create({
    data: {
      email: "jane.smith@example.com",
      password: "$2b$12$wRBcuddac.LKstMEb3hhiuSO1h5ubuPL7YBNaWCW.fLA/1L2MNIqC",
      role: "client",
      etat: "active",
      identifiant: "jane_smith",
      bio: "Admin bio",
      credit: 200,
      user_id: user2.id,
    },
  });

  // Création de tailleurs
  const tailleur1 = await prisma.tailleur.create({
    data: {
      compte_id: compte1.id,
    },
  });

  // Création de clients
  const client1 = await prisma.client.create({
    data: {
      compte_id: compte2.id,
    },
  });

  // Création de mesures
  const mesure1 = await prisma.mesure.create({
    data: {
      compte_id: compte1.id,
    },
  });

  // Création de posts
  const post1 = await prisma.post.create({
    data: {
      content: "First post content",
      title: "First Post",
      count: 1,
      shareNb: 0,
      viewNb: 10,
      tailleur_id: tailleur1.id,
      status: "PUBLIE",
      categorie: "IMAGE",
    },
  });

  console.log("Data seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
