
// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

use('TailleurDatabase');

// Drop existing collections (optional)
db.clients.drop();
db.comments.drop();
db.commentresponses.drop();
db.comptes.drop();
db.favorites.drop();
db.follows.drop();
db.likes.drop();
db.measures.drop();
db.messages.drop();
db.notes.drop();
db.notifications.drop();
db.posts.drop();
db.reports.drop();
db.status.drop();
db.tailleurs.drop();
db.users.drop();

// Create Collections
db.createCollection("clients");
db.createCollection("favorites");
db.createCollection("tailleurs");
db.createCollection("measures");
db.createCollection("comptes");
db.createCollection("posts");
db.createCollection("status");
db.createCollection("follows");
db.createCollection("comments");
db.createCollection("commentresponses");
db.createCollection("likes");
db.createCollection("messages");
db.createCollection("notes");
db.createCollection("notifications");
db.createCollection("reports");
db.createCollection("users");

// Insert Users
var userId1 = ObjectId();
var userId2 = ObjectId();
var userId3 = ObjectId();
var userId4 = ObjectId();
var userId5 = ObjectId();

db.users.insertMany([
    { _id: userId1, lastname: "Smith", firstname: "John", phone: "1234567890", city: "New York", picture: "john_smith.jpg", createdAt: new Date(), updatedAt: new Date() },
    { _id: userId2, lastname: "Doe", firstname: "Jane", phone: "0987654321", city: "Los Angeles", picture: "jane_doe.jpg", createdAt: new Date(), updatedAt: new Date() },
    { _id: userId3, lastname: "Brown", firstname: "Charlie", phone: "1112223333", city: "Chicago", picture: "charlie_brown.jpg", createdAt: new Date(), updatedAt: new Date() },
    { _id: userId4, lastname: "Johnson", firstname: "Emily", phone: "4445556666", city: "Houston", picture: "emily_johnson.jpg", createdAt: new Date(), updatedAt: new Date() },
    { _id: userId5, lastname: "Williams", firstname: "James", phone: "7778889999", city: "Phoenix", picture: "james_williams.jpg", createdAt: new Date(), updatedAt: new Date() }
]);

// Insert Comptes
var compteId1 = ObjectId();
var compteId2 = ObjectId();
var compteId3 = ObjectId();
var compteId4 = ObjectId();
var compteId5 = ObjectId();

db.comptes.insertMany([
    { _id: compteId1, email: "john.smith@example.com", password: "password123", etat: "active", role: "tailleur", createdAt: new Date(), updatedAt: new Date(), identifiant: "johnsmith", bio: "I am John Smith", user_id: userId1, comment_ids: [], favorite_ids: [], follower_ids: [], report_ids: [], note_ids: [] },
    { _id: compteId2, email: "jane.doe@example.com", password: "password321", etat: "active", role: "client", createdAt: new Date(), updatedAt: new Date(), identifiant: "janedoe", bio: "I am Jane Doe", user_id: userId2, comment_ids: [], favorite_ids: [], follower_ids: [], report_ids: [], note_ids: [] },
    { _id: compteId3, email: "charlie.brown@example.com", password: "password111", etat: "active", role: "tailleur", createdAt: new Date(), updatedAt: new Date(), identifiant: "charliebrown", bio: "I am Charlie Brown", user_id: userId3, comment_ids: [], favorite_ids: [], follower_ids: [], report_ids: [], note_ids: [] },
    { _id: compteId4, email: "emily.johnson@example.com", password: "password222", etat: "active", role: "client", createdAt: new Date(), updatedAt: new Date(), identifiant: "emilyjohnson", bio: "I am Emily Johnson", user_id: userId4, comment_ids: [], favorite_ids: [], follower_ids: [], report_ids: [], note_ids: [] },
    { _id: compteId5, email: "james.williams@example.com", password: "password333", etat: "active", role: "tailleur", createdAt: new Date(), updatedAt: new Date(), identifiant: "jameswilliams", bio: "I am James Williams", user_id: userId5, comment_ids: [], favorite_ids: [], follower_ids: [], report_ids: [], note_ids: [] }
]);

// Insert Clients
var clientId2 = ObjectId();
var clientId4 = ObjectId();

db.clients.insertMany([
    { compte_id: compteId2, measure_ids: [], createdAt: new Date(), updatedAt: new Date() },
    { compte_id: compteId4, measure_ids: [], createdAt: new Date(), updatedAt: new Date() }
]);

// Insert Tailleurs
var tailleurId1 = ObjectId();
var tailleurId3 = ObjectId();
var tailleurId5 = ObjectId();

db.tailleurs.insertMany([
    { _id: tailleurId1, compte_id: compteId1, status_ids: [], post_ids: [], createdAt: new Date(), updatedAt: new Date() },
    { _id: tailleurId3, compte_id: compteId3, status_ids: [], post_ids: [], createdAt: new Date(), updatedAt: new Date() },
    { _id: tailleurId5, compte_id: compteId5, status_ids: [], post_ids: [], createdAt: new Date(), updatedAt: new Date() }
]);

// Insert Measures
var measureId1 = ObjectId();
var measureId2 = ObjectId();

db.measures.insertMany([
    { _id: measureId1, Epaule: "40", Manche: "60", Longueur: "70", Poitrine: "90", Fesse: "95", Taille: "85", Cou: "40", createdAt: new Date(), updatedAt: new Date(), compte_id: compteId2 },
    { _id: measureId2, Epaule: "42", Manche: "62", Longueur: "72", Poitrine: "92", Fesse: "97", Taille: "87", Cou: "42", createdAt: new Date(), updatedAt: new Date(), compte_id: compteId4 }
]);

// Update Clients with Measures
db.clients.updateOne({ compte_id: compteId2 }, { $set: { measure_ids: [measureId1] } });
db.clients.updateOne({ compte_id: compteId4 }, { $set: { measure_ids: [measureId2] } });

// Insert Posts
var postId1 = ObjectId();
var postId3 = ObjectId();
var postId5 = ObjectId();

db.posts.insertMany([
    { _id: postId1, content: "Post from John", title: "John's Tailoring", image: ["image1.jpg"], createdAt: new Date(), updatedAt: new Date(), shareNb: 10, viewsNb: 100, author_id: tailleurId1, comment_ids: [], like_ids: [] },
    { _id: postId3, content: "Post from Charlie", title: "Charlie's Tailoring", image: ["image3.jpg"], createdAt: new Date(), updatedAt: new Date(), shareNb: 15, viewsNb: 150, author_id: tailleurId3, comment_ids: [], like_ids: [] },
    { _id: postId5, content: "Post from James", title: "James's Tailoring", image: ["image5.jpg"], createdAt: new Date(), updatedAt: new Date(), shareNb: 20, viewsNb: 200, author_id: tailleurId5, comment_ids: [], like_ids: [] }
]);

// Insert Statuses
var statusId1 = ObjectId();
var statusId3 = ObjectId();
var statusId5 = ObjectId();

db.status.insertMany([
    { _id: statusId1, files: "status1.jpg", description: "Status by John", duration: 10, viewsNB: 100, createdAt: new Date(), updatedAt: new Date(), categories: "image", tailleur_id: tailleurId1 },
    { _id: statusId3, files: "status3.jpg", description: "Status by Charlie", duration: 15, viewsNB: 150, createdAt: new Date(), updatedAt: new Date(), categories: "image", tailleur_id: tailleurId3 },
    { _id: statusId5, files: "status5.jpg", description: "Status by James", duration: 20, viewsNB: 200, createdAt: new Date(), updatedAt: new Date(), categories: "image", tailleur_id: tailleurId5 }
]);

// Update Tailleurs with Status and Post References
db.tailleurs.updateOne({ _id: tailleurId1 }, { $set: { status_ids: [statusId1], post_ids: [postId1] } });
db.tailleurs.updateOne({ _id: tailleurId3 }, { $set: { status_ids: [statusId3], post_ids: [postId3] } });
db.tailleurs.updateOne({ _id: tailleurId5 }, { $set: { status_ids: [statusId5], post_ids: [postId5] } });

// Insert Comments
var commentId1 = ObjectId();
var commentId3 = ObjectId();
var commentId5 = ObjectId();

db.comments.insertMany([
    { _id: commentId1, content: "Comment on John's post", createdAt: new Date(), updatedAt: new Date(), post_id: postId1, compte_id: compteId2, commentResponse_ids: [] },
    { _id: commentId3, content: "Comment on Charlie's post", createdAt: new Date(), updatedAt: new Date(), post_id: postId3, compte_id: compteId4, commentResponse_ids: [] },
    { _id: commentId5, content: "Comment on James's post", createdAt: new Date(), updatedAt: new Date(), post_id: postId5, compte_id: compteId2, commentResponse_ids: [] }
]);

// Update Posts with Comment References
db.posts.updateOne({ _id: postId1 }, { $set: { comment_ids: [commentId1] } });
db.posts.updateOne({ _id: postId3 }, { $set: { comment_ids: [commentId3] } });
db.posts.updateOne({ _id: postId5 }, { $set: { comment_ids: [commentId5] } });

// Insert Comment Responses
var commentResponseId1 = ObjectId();
var commentResponseId2 = ObjectId();
var commentResponseId3 = ObjectId();

db.commentresponses.insertMany([
    { _id: commentResponseId1, texte: "Response to comment 1", createdAt: new Date(), updatedAt: new Date(), comment_id: commentId1, compte_id: compteId1 },
    { _id: commentResponseId2, texte: "Response to comment 3", createdAt: new Date(), updatedAt: new Date(), comment_id: commentId3, compte_id: compteId3 },
    { _id: commentResponseId3, texte: "Response to comment 5", createdAt: new Date(), updatedAt: new Date(), comment_id: commentId5, compte_id: compteId5 }
]);

// Update Comments with Comment Response References
db.comments.updateOne({ _id: commentId1 }, { $set: { commentResponse_ids: [commentResponseId1] } });
db.comments.updateOne({ _id: commentId3 }, { $set: { commentResponse_ids: [commentResponseId2] } });
db.comments.updateOne({ _id: commentId5 }, { $set: { commentResponse_ids: [commentResponseId3] } });

// Insert Favorites
var favoriteId1 = ObjectId();
var favoriteId2 = ObjectId();

db.favorites.insertMany([
    { _id: favoriteId1, compte_id: compteId1, post_id: postId3, createdAt: new Date(), updatedAt: new Date() },
    { _id: favoriteId2, compte_id: compteId2, post_id: postId5, createdAt: new Date(), updatedAt: new Date() }
]);

// Insert Follows
var followId1 = ObjectId();
var followId2 = ObjectId();

db.follows.insertMany([
    { _id: followId1, followed_id: compteId1, follower_id: compteId2, status: "active", createdAt: new Date(), updatedAt: new Date() },
    { _id: followId2, followed_id: compteId3, follower_id: compteId4, status: "active", createdAt: new Date(), updatedAt: new Date() }
]);

// Insert Likes
var likeId1 = ObjectId();
var likeId2 = ObjectId();

db.likes.insertMany([
    { _id: likeId1, post_id: postId1, compte_id: compteId1, etat: "liked", createdAt: new Date(), updatedAt: new Date() },
    { _id: likeId2, post_id: postId3, compte_id: compteId3, etat: "liked", createdAt: new Date(), updatedAt: new Date() }
]);

// Insert Messages
var messageId1 = ObjectId();
var messageId2 = ObjectId();

db.messages.insertMany([
    { _id: messageId1, texte: "Hello from John", sender_id: compteId1, receiver_id: compteId2, createdAt: new Date(), updatedAt: new Date() },
    { _id: messageId2, texte: "Hello from Charlie", sender_id: compteId3, receiver_id: compteId4, createdAt: new Date(), updatedAt: new Date() }
]);

// Insert Notes
var noteId1 = ObjectId();
var noteId2 = ObjectId();

db.notes.insertMany([
    { _id: noteId1, note: "Good tailor", who_note_id: compteId2, noted_id: compteId1, createdAt: new Date(), updatedAt: new Date() },
    { _id: noteId2, note: "Great work", who_note_id: compteId4, noted_id: compteId3, createdAt: new Date(), updatedAt: new Date() }
]);

// Insert Notifications
var notificationId1 = ObjectId();
var notificationId2 = ObjectId();

db.notifications.insertMany([
    { _id: notificationId1, content: "New comment on your post", post_id: postId1, compte_id: compteId1, createdAt: new Date(), updatedAt: new Date() },
    { _id: notificationId2, content: "New like on your post", post_id: postId3, compte_id: compteId3, createdAt: new Date(), updatedAt: new Date() }
]);

// Insert Reports
var reportId1 = ObjectId();
var reportId2 = ObjectId();

db.reports.insertMany([
    { _id: reportId1, motif: "Spam", compte_id: compteId1, reporter_id: compteId2, createdAt: new Date(), updatedAt: new Date() },
    { _id: reportId2, motif: "Inappropriate content", compte_id: compteId3, reporter_id: compteId4, createdAt: new Date(), updatedAt: new Date() }
]);

// Final updates to link favorites, followers, and other relations in Compte
db.comptes.updateOne({ _id: compteId1 }, { $set: { favorite_ids: [favoriteId1], follower_ids: [followId2], note_ids: [noteId1], comment_ids: [commentId1] } });
db.comptes.updateOne({ _id: compteId2 }, { $set: { favorite_ids: [favoriteId2], follower_ids: [followId1], note_ids: [], comment_ids: [commentId3] } });
db.comptes.updateOne({ _id: compteId3 }, { $set: { favorite_ids: [], follower_ids: [], note_ids: [noteId2], comment_ids: [commentId5] } });