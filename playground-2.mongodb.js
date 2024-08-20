// MongoDB Playground
use("monprojet-tailleur");

// Drop existing collections
const collections = [
    "clients", "comments", "commentresponses", "comptes", "favorites", "follows", "likes", "measures",
    "messages", "notes", "notifications", "posts", "reports", "status", "tailleurs", "users",
    "conversioncredits", "paiements", "tissus", "tissuposts", "commandes", "bloquers"
];
collections.forEach(collection => db[collection].drop());

// Create Collections
collections.forEach(collection => db.createCollection(collection));

// Insert Users
const userIds = Array(5).fill().map(() => ObjectId());
const userDetails = [
    { lastname: "Smith", firstname: "John", phone: "1234567890", city: "New York" },
    { lastname: "Doe", firstname: "Jane", phone: "0987654321", city: "Los Angeles" },
    { lastname: "Brown", firstname: "Charlie", phone: "1112223333", city: "Chicago" },
    { lastname: "Johnson", firstname: "Emily", phone: "4445556666", city: "Houston" },
    { lastname: "Williams", firstname: "James", phone: "7778889999", city: "Phoenix" }
];
db.users.insertMany(userIds.map((id, index) => ({
    _id: id,
    ...userDetails[index],
    picture: `${userDetails[index].firstname.toLowerCase()}_${userDetails[index].lastname.toLowerCase()}.jpg`,
    createdAt: new Date(),
    updatedAt: new Date()
})));

// Insert Comptes
const compteIds = Array(5).fill().map(() => ObjectId());
const roles = ["tailleur", "client", "tailleur", "client", "tailleur"];
db.comptes.insertMany(compteIds.map((id, index) => ({
    _id: id,
    email: `${userDetails[index].firstname.toLowerCase()}.${userDetails[index].lastname.toLowerCase()}@example.com`,
    password: "$2a$10$3pPAMhkyrt/POCAp6A7oIOz49nM1r96RahKhzwdzZ0hH3DV0q4HOC",
    etat: "active",
    role: roles[index],
    createdAt: new Date(),
    updatedAt: new Date(),
    identifiant: `${userDetails[index].firstname.toLowerCase()}${userDetails[index].lastname.toLowerCase()}`,
    bio: `I am ${userDetails[index].firstname} ${userDetails[index].lastname}`,
    user_id: userIds[index],
    comment_ids: [],
    favorite_ids: [],
    follower_ids: [],
    report_ids: [],
    note_ids: [],
    credit: 0
})));

// Insert Clients
const clientIds = [ObjectId(), ObjectId()];
db.clients.insertMany([1, 3].map((index, i) => ({
    _id: clientIds[i],
    compte_id: compteIds[index],
    measure_ids: [],
    createdAt: new Date(),
    updatedAt: new Date()
})));

// Insert Tailleurs
const tailleurIds = [ObjectId(), ObjectId(), ObjectId()];
db.tailleurs.insertMany([0, 2, 4].map((index, i) => ({
    _id: tailleurIds[i],
    compte_id: compteIds[index],
    status_ids: [],
    post_ids: [],
    createdAt: new Date(),
    updatedAt: new Date()
})));

// Insert Measures
const measureIds = [ObjectId(), ObjectId()];
const measureData = [
    { Epaule: "40", Manche: "60", Longueur: "70", Poitrine: "90", Fesse: "95", Taille: "85", Cou: "40" },
    { Epaule: "42", Manche: "62", Longueur: "72", Poitrine: "92", Fesse: "97", Taille: "87", Cou: "42" }
];
db.measures.insertMany(measureIds.map((id, index) => ({
    _id: id,
    ...measureData[index],
    createdAt: new Date(),
    updatedAt: new Date(),
    compte_id: compteIds[index * 2 + 1]
})));

// Update Clients with Measures
db.clients.updateMany({}, { $set: { measure_ids: measureIds } });

// Insert Posts
const postIds = [ObjectId(), ObjectId(), ObjectId()];
db.posts.insertMany([0, 2, 4].map((index, i) => ({
    _id: postIds[i],
    content: `Post from ${userDetails[index].firstname}`,
    title: `${userDetails[index].firstname}'s Tailoring`,
    image: ["image"],
    createdAt: new Date(),
    updatedAt: new Date(),
    shareNb: 10 + (i * 5),
    viewsNb: 100 + (i * 50),
    cout: 2,
    author_id: tailleurIds[i],
    comment_ids: [],
    like_ids: [],
    tissus: []
})));

// Insert Statuses
const statusIds = [ObjectId(), ObjectId(), ObjectId()];
db.status.insertMany([0, 2, 4].map((index, i) => ({
    _id: statusIds[i],
    files: `status${i + 1}.jpg`,
    description: `Status by ${userDetails[index].firstname}`,
    duration: 10 + (i * 5),
    viewsNB: 100 + (i * 50),
    createdAt: new Date(),
    updatedAt: new Date(),
    categories: "image",
    tailleur_id: tailleurIds[i]
})));

// Update Tailleurs with Status and Post References
db.tailleurs.updateMany({}, { $set: { status_ids: statusIds, post_ids: postIds } });

// Insert Comments
const commentIds = [ObjectId(), ObjectId(), ObjectId()];
db.comments.insertMany(commentIds.map((id, index) => ({
    _id: id,
    content: `Comment on ${userDetails[index * 2].firstname}'s post`,
    createdAt: new Date(),
    updatedAt: new Date(),
    post_id: postIds[index],
    compte_id: compteIds[index * 2 + 1],
    commentResponse_ids: []
})));

// Update Posts with Comment References
db.posts.updateMany({}, { $set: { comment_ids: commentIds } });

// Insert Comment Responses
const commentResponseIds = [ObjectId(), ObjectId(), ObjectId()];
db.commentresponses.insertMany(commentResponseIds.map((id, index) => ({
    _id: id,
    texte: `Response to comment ${index + 1}`,
    createdAt: new Date(),
    updatedAt: new Date(),
    comment_id: commentIds[index],
    compte_id: compteIds[index * 2]
})));

// Update Comments with Comment Response References
db.comments.updateMany({}, { $set: { commentResponse_ids: commentResponseIds } });

// Insert Favorites
const favoriteIds = [ObjectId(), ObjectId()];
db.favorites.insertMany(favoriteIds.map((id, index) => ({
    _id: id,
    compte_id: compteIds[index * 2],
    post_id: postIds[(index + 1) % 3],
    createdAt: new Date(),
    updatedAt: new Date()
})));

// Insert Follows
const followIds = [ObjectId(), ObjectId()];
db.follows.insertMany(followIds.map((id, index) => ({
    _id: id,
    followed_id: compteIds[index * 2],
    follower_id: compteIds[index * 2 + 1],
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date()
})));

// Insert Likes
const likeIds = [ObjectId(), ObjectId()];
db.likes.insertMany(likeIds.map((id, index) => ({
    _id: id,
    post_id: postIds[index],
    compte_id: compteIds[index * 2],
    etat: "liked",
    createdAt: new Date(),
    updatedAt: new Date()
})));

// Insert Messages
const messageIds = [ObjectId(), ObjectId()];
db.messages.insertMany(messageIds.map((id, index) => ({
    _id: id,
    texte: `Hello from ${userDetails[index * 2].firstname}`,
    sender_id: compteIds[index * 2],
    receiver_id: compteIds[index * 2 + 1],
    createdAt: new Date(),
    updatedAt: new Date()
})));

// Insert Notes
const noteIds = [ObjectId(), ObjectId()];
db.notes.insertMany(noteIds.map((id, index) => ({
    _id: id,
    note: index === 0 ? "Good tailor" : "Great work",
    who_note_id: compteIds[index * 2 + 1],
    noted_id: compteIds[index * 2],
    createdAt: new Date(),
    updatedAt: new Date()
})));

// Insert Notifications
const notificationIds = [ObjectId(), ObjectId()];
db.notifications.insertMany(notificationIds.map((id, index) => ({
    _id: id,
    content: index === 0 ? "New comment on your post" : "New like on your post",
    post_id: postIds[index],
    compte_id: compteIds[index * 2],
    createdAt: new Date(),
    updatedAt: new Date()
})));

// Insert Bloquers
db.bloquers.insertMany([
    { blocked_id: compteIds[1], blocker_id: compteIds[0], createdAt: new Date(), updatedAt: new Date() },
    { blocked_id: compteIds[3], blocker_id: compteIds[2], createdAt: new Date(), updatedAt: new Date() },
    { blocked_id: compteIds[4], blocker_id: compteIds[0], createdAt: new Date(), updatedAt: new Date() }
]);

// Insert Reports
const reportIds = [ObjectId(), ObjectId()];
db.reports.insertMany(reportIds.map((id, index) => ({
    _id: id,
    motif: index === 0 ? "Spam" : "Inappropriate content",
    compte_id: compteIds[index * 2],
    reporter_id: compteIds[index * 2 + 1],
    createdAt: new Date(),
    updatedAt: new Date()
})));

// Insert Tissus
const tissuIds = [ObjectId(), ObjectId()];
db.tissus.insertMany(tissuIds.map((id, index) => ({
    _id: id,
    libelle: index === 0 ? "Cotton" : "Silk",
    unite: index === 0 ? "m" : "yard",
    createdAt: new Date(),
    updatedAt: new Date()
})));

// Insert TissuPosts
const tissuPostIds = [ObjectId(), ObjectId(), ObjectId()];
db.tissuposts.insertMany(tissuPostIds.map((id, index) => ({
    _id: id,
    prixMetre: 15 + (index * 5),
    nombreMetre: 2 + (index * 0.5),
    post_id: postIds[index],
    tissu_id: tissuIds[index % 2],
    createdAt: new Date(),
    updatedAt: new Date()
})));

// Insert Commandes
const commandeIds = [ObjectId(), ObjectId(), ObjectId()];
db.commandes.insertMany(commandeIds.map((id, index) => ({
    _id: id,
    tissupost_id: tissuPostIds[index],
    client_id: compteIds[index % 2 * 2 + 1],
    createdAt: new Date(),
    updatedAt: new Date()
})));

// Insert Paiements
const paiementIds = [ObjectId(), ObjectId()];
db.paiements.insertMany(paiementIds.map((id, index) => ({
    _id: id,
    commande_id: commandeIds[index],
    montant: 2000 + (index * 1000),
    createdAt: new Date(),
    updatedAt: new Date()
})));

// Update Posts with Tissu information
db.posts.updateMany({}, {
    $set: {
        tissus: tissuPostIds.map((id, index) => ({
            tissu_id: tissuIds[index % 2],
            prixMetre: 15 + (index * 5),
            nombreMetre: 2 + (index * 0.5),
            tissuPost_id: id
        }))
    }
});

// Final updates to link favorites, followers, and other relations in Compte
db.comptes.updateMany({}, {
    $set: {
        favorite_ids: favoriteIds,
        follower_ids: followIds,
        note_ids: noteIds,
        comment_ids: commentIds
    }
});