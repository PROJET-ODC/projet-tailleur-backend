import {
    PrismaClient,
    StatusFollow,
    CategoriePost,
    StatusPost,
    etatLike,
} from "@prisma/client";
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    // Assuming you have already created some comptes (users) with id 1, 2, 3, etc.
    const follows = [
        {
            status: 'FOLLOWED',
            follower_id: 1,
            followed_id: 2,
        },
        {
            status: 'FOLLOWED',
            follower_id: 2,
            followed_id: 3,
        },
        {
            status: 'UNFOLLOWED',
            follower_id: 3,
            followed_id: 1,
        },
        {
            status: 'FOLLOWED',
            follower_id: 1,
            followed_id: 3,
        },
        {
            status: 'FOLLOWED',
            follower_id: 2,
            followed_id: 1,
        },
        {
            status: 'UNFOLLOWED',
            follower_id: 3,
            followed_id: 2,
        },
    ];

    // Loop through the follows array and create the records in the database
    for (const follow of follows) {
        await prisma.follow.create({
            data: {
                status: follow.status,
                follower_id: follow.follower_id,
                followed_id: follow.followed_id,
            },
        });
    }

    console.log('Sample data for Follow table created successfully!');
}


main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
