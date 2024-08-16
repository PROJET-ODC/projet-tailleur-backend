const { PrismaClient } = require('@prisma/client');
const faker = require('faker');
const prisma = new PrismaClient();

async function main() {
    // Peupler la table User
    for (let i = 0; i < 10; i++) {
        const user = await prisma.user.create({
            data: {
                lastname: faker.name.lastName(),
                firstname: faker.name.firstName(),
                phone: faker.phone.phoneNumber(),
                city: faker.address.city(),
                picture: faker.image.avatar(),
            },
        });

        // Peupler la table Compte
        const compte = await prisma.compte.create({
            data: {
                email: faker.internet.email(),
                password: faker.internet.password(),
                role: faker.random.arrayElement(['admin', 'user', 'tailleur', 'client']),
                etat: faker.random.arrayElement(['active', 'inactive']),
                identifiant: faker.internet.userName(),
                bio: faker.lorem.sentences(2),
                credit: faker.datatype.number(100),
                user_id: user.id,
            },
        });

        // Peupler les relations avec Tailleur, Client, Mesure selon le rôle
        if (compte.role === 'tailleur') {
            await prisma.tailleur.create({
                data: {
                    compte_id: compte.id,
                },
            });
        } else if (compte.role === 'client') {
            await prisma.client.create({
                data: {
                    compte_id: compte.id,
                },
            });
        } else {
            await prisma.mesure.create({
                data: {
                    compte_id: compte.id,
                },
            });
        }
    }

    // Peupler les tables Follow
    for (let i = 0; i < 20; i++) {
        await prisma.follow.create({
            data: {
                follower_id: faker.datatype.number({ min: 1, max: 10 }),
                followed_id: faker.datatype.number({ min: 1, max: 10 }),
                status: faker.random.arrayElement(['FOLLOWED', 'UNFOLLOWED']),
            },
        });
    }

    // Peupler les tables Report
    for (let i = 0; i < 10; i++) {
        await prisma.report.create({
            data: {
                motif: faker.lorem.sentence(),
                reporter_id: faker.datatype.number({ min: 1, max: 10 }),
                reported_id: faker.datatype.number({ min: 1, max: 10 }),
            },
        });
    }

    // Peupler la table Note
    for (let i = 0; i < 10; i++) {
        await prisma.note.create({
            data: {
                note: faker.lorem.word(),
                noter_id: faker.datatype.number({ min: 1, max: 10 }),
                noted_id: faker.datatype.number({ min: 1, max: 10 }),
            },
        });
    }

    // Peupler la table Bloquer
    for (let i = 0; i < 10; i++) {
        await prisma.bloquer.create({
            data: {
                blocker_id: faker.datatype.number({ min: 1, max: 10 }),
                blocked_id: faker.datatype.number({ min: 1, max: 10 }),
            },
        });
    }

    // Peupler la table Message
    for (let i = 0; i < 10; i++) {
        await prisma.message.create({
            data: {
                texte: faker.lorem.sentence(),
                messager_id: faker.datatype.number({ min: 1, max: 10 }),
                messaged_id: faker.datatype.number({ min: 1, max: 10 }),
            },
        });
    }

    // Peupler la table Post
    for (let i = 0; i < 10; i++) {
        const post = await prisma.post.create({
            data: {
                content: faker.lorem.paragraph(),
                title: faker.lorem.words(3),
                count: faker.datatype.number(),
                shareNb: faker.datatype.number(),
                viewNb: faker.datatype.number(),
                tailleur_id: faker.datatype.number({ min: 1, max: 10 }),
                status: faker.random.arrayElement(['PUBLIE', 'PAS_PUBLIE', 'ARCHIVE']),
                categorie: faker.random.arrayElement(['IMAGE', 'VIDEO']),
            },
        });

        // Peupler la table Tag
        await prisma.tag.create({
            data: {
                libelle: faker.lorem.word(),
                post_id: post.id,
            },
        });
    }

    // Peupler la table Comment
    for (let i = 0; i < 10; i++) {
        await prisma.comment.create({
            data: {
                content: faker.lorem.sentences(),
                post_id: faker.datatype.number({ min: 1, max: 10 }),
                compte_id: faker.datatype.number({ min: 1, max: 10 }),
            },
        });
    }

    // Peupler la table Like
    for (let i = 0; i < 10; i++) {
        await prisma.like.create({
            data: {
                etat: faker.random.arrayElement(['LIKE', 'DISLIKE', 'UNLIKE']),
                post_id: faker.datatype.number({ min: 1, max: 10 }),
                compte_id: faker.datatype.number({ min: 1, max: 10 }),
            },
        });
    }

    // Peupler la table Favori
    for (let i = 0; i < 10; i++) {
        await prisma.favori.create({
            data: {
                post_id: faker.datatype.number({ min: 1, max: 10 }),
                compte_id: faker.datatype.number({ min: 1, max: 10 }),
            },
        });
    }

    // Peupler la table Notification
    for (let i = 0; i < 10; i++) {
        await prisma.notification.create({
            data: {
                content: faker.lorem.sentence(),
                compte_id: faker.datatype.number({ min: 1, max: 10 }),
            },
        });
    }

    // Peupler la table Commande
    for (let i = 0; i < 10; i++) {
        await prisma.commande.create({
            data: {
                post_id: faker.datatype.number({ min: 1, max: 10 }),
                compte_id: faker.datatype.number({ min: 1, max: 10 }),
            },
        });
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
