// import mongoose from "mongoose";
// import { createJWT } from '../utils/jwt.js';
//
//
// import "dotenv/config";
//
//
// class ClientController {
//
//     constructor() {
//         for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
//             const val = this[key];
//             if (key !== 'constructor' && typeof val === 'function') {
//                 this[key] = val.bind(this);
//             }
//         }
//     }
//
//     async getMyFollowersPost(compte) {
//         let myFollowersTailleur = [];
//         const myFollowers = await Follow.find({
//             _id: { $in: compte.follower_ids },
//             follower_id: compte._id
//         }).populate({
//             path: 'followed_id'
//         });
//
//         const myFollowersCompte = myFollowers
//             .filter(follow => follow.followed_id.etat === 'active')
//             .map(follow => follow.followed_id);
//
//         // return myFollowersCompte;
//         for (let i = 0; i < myFollowersCompte.length; i++) {
//             myFollowersTailleur.push(await Tailleur.findOne({ compte_id: myFollowersCompte[i]._id }));
//         }
//         const myFollowersTailleurIds = myFollowersTailleur.map(objet => objet._id);
//
//         const myFollowersPost = await Post.find({
//             author_id: { $in: myFollowersTailleurIds }
//         })
//         return myFollowersPost;
//     }
//
//     async getMyFollowersRecentStatus(compte) {
//         const now = Date.now(); // Date actuelle en millisecondes
//         const twentyFourHoursInMs = 24 * 60 * 60 * 1000; // 24 heures en millisecondes
//
//         let myFollowersTailleur = [];
//         const myFollowers = await Follow.find({
//             _id: { $in: compte.follower_ids },
//             follower_id: compte._id
//         }).populate({
//             path: 'followed_id'
//         });
//
//         const myFollowersCompte = myFollowers
//             .filter(follow => follow.followed_id.etat === 'active')
//             .map(follow => follow.followed_id);
//
//         for (let i = 0; i < myFollowersCompte.length; i++) {
//             myFollowersTailleur.push(await Tailleur.findOne({ compte_id: myFollowersCompte[i]._id }));
//         }
//         const myFollowersTailleurIds = myFollowersTailleur.map(objet => objet._id);
//
//         const myFollowersStatus = await Status.find({
//             tailleur_id: { $in: myFollowersTailleurIds }
//         })
//
//         const myFollowersRecentStatus = myFollowersStatus.filter(status => {
//             const createdAtMs = new Date(status.createdAt).getTime(); // Date de création en millisecondes
//             const differenceInMs = now - createdAtMs; // Calcul de la différence
//             return differenceInMs <= twentyFourHoursInMs; // Vérifier si la différence est inférieure ou égale à 24 heures
//         });
//
//         return myFollowersRecentStatus;
//     }
//
//     async createAccount(req, res) {
//         try {
//             // Créez un nouveau compte
//             const newAccount = new Compte({ ...req.body, createdAt: new Date(), updatedAt: new Date() });
//             await newAccount.save();
//
//             // Générer un token JWT contenant l'ID du compte et le rôle
//             const token = createJWT({ payload: { id: newAccount._id, role: newAccount.role } });
//
//             return res.status(201).json({ account: newAccount, token, status: 'OK' });
//         } catch (err) {
//             return res.status(500).json({ message: err.message, status: 'KO' });
//         }
//     }
//
//     async getNewsFeed(req, res) {
//         const idCompte = req.id;
//         const now = Date.now(); // Date actuelle en millisecondes
//         const twentyFourHoursInMs = 24 * 60 * 60 * 1000; // 24 heures en millisecondes
//
//         try {
//             const compte = await Compte.findById(idCompte);
//             if (compte.role === 'tailleur') {
//                 const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000); // Date actuelle moins 24 heures
//
//                 const tailleur = await Tailleur.findOne({ compte_id: idCompte });
//                 const myOwnPost = await Post.find({
//                     author_id: tailleur._id
//                 });
//                 const myOwnStatus = await Status.find({
//                     tailleur_id: tailleur._id
//                 });
//
//                 const myOwnRecentStatus = myOwnStatus.filter(status => {
//                     const createdAtMs = new Date(status.createdAt).getTime(); // Date de création en millisecondes
//                     const differenceInMs = now - createdAtMs; // Calcul de la différence
//                     return differenceInMs <= twentyFourHoursInMs; // Vérifier si la différence est inférieure ou égale à 24 heures
//                 });
//
//
//                 const myFollowersPost = await this.getMyFollowersPost(compte);
//                 // return res.json(myFollowersPost);
//                 const posts = myOwnPost.concat(myFollowersPost);
//
//                 const myFollowersRecentStatus = await this.getMyFollowersRecentStatus(compte);
//                 const recentStatus = myFollowersRecentStatus.concat(myOwnRecentStatus);
//                 // return res.json(recentStatus);
//                 return res.json({ posts, recentStatus, message: 'Fil D\'actualité charger', status: 'KO' });
//             } else {
//                 const posts = await this.getMyFollowersPost(compte);
//                 const recentStatus = await this.getMyFollowersRecentStatus(compte);
//                 return res.json({ posts, recentStatus, message: 'Fil D\'actualité charger', status: 'KO' });
//             }
//
//         } catch (err) {
//             return res.status(500).json({ message: err.message, status: 'KO' });
//         }
//     }
//
//     async getAccount(req, res) {
//         try {
//             const account = await Compte.findById(req.params.id).populate('user_id').populate('comment_ids').populate('favorite_ids').populate('follower_ids').populate('report_ids').populate('note_ids');
//             if (!account) {
//                 return res.status(404).json({ message: 'Account not found', status: 'KO' });
//             }
//             return res.status(200).json({ account, status: 'OK' });
//         } catch (err) {
//             return res.status(500).json({ message: err.message, status: 'KO' });
//         }
//     }
//
//     async getNotificationById(req, res) {
//         try {
//             const notification = await Notification.findById(req.params.id).populate('post_id').lean();
//             if (!notification) {
//                 return res.status(404).json({ message: 'Notification not found', status: 'KO' });
//             }
//             return res.status(200).json({ notification, status: 'OK' });
//         } catch (err) {
//             return res.status(500).json({ message: err.message, status: 'KO' });
//         }
//     }
//
//     async getNotificationById(req, res) {
//         try {
//             const notification = await Notification.findById(req.params.id).populate('post_id').lean();
//             if (!notification) {
//                 return res.status(404).json({ message: 'Notification not found', status: 'KO' });
//             }
//             return res.status(200).json({ notification, status: 'OK' });
//         } catch (err) {
//             return res.status(500).json({ message: err.message, status: 'KO' });
//         }
//     }
//
//     // De même, ajouter les méthodes pour getMessageById et getFavoriteById
//     async getMessageById(req, res) {
//         try {
//             const message = await Message.findById(req.params.id).populate('sender_id').lean();
//             if (!message) {
//                 return res.status(404).json({ message: 'Message not found', status: 'KO' });
//             }
//             return res.status(200).json({ message, status: 'OK' });
//         } catch (err) {
//             return res.status(500).json({ message: err.message, status: 'KO' });
//         }
//     }
//
//     async getFavoriteById(req, res) {
//         try {
//             const favorite = await Favorite.findById(req.params.id).populate('post_id').lean();
//             if (!favorite) {
//                 return res.status(404).json({ message: 'Favorite not found', status: 'KO' });
//             }
//             return res.status(200).json({ favorite, status: 'OK' });
//         } catch (err) {
//             return res.status(500).json({ message: err.message, status: 'KO' });
//         }
//     }
//
//     async listFavorites(req, res) {
//         try {
//             const favorites = await Favorite.find({ compte_id: req.user.id }).populate('post_id');
//             return res.status(200).json({ favorites, status: 'OK' });
//         } catch (err) {
//             return res.status(500).json({ message: err.message, status: 'KO' });
//         }
//     }
//
//     async addFavorite(req, res) {
//         try {
//             const { post_id } = req.body;
//             const idCompte = req.id;
//             const newFavorite = new Favorite({ post_id, compte_id: idCompte, createdAt: new Date(), updatedAt: new Date() });
//             await newFavorite.save();
//             return res.status(201).json({ favorite: newFavorite, status: 'OK' });
//         } catch (err) {
//             return res.status(500).json({ message: err.message, status: 'KO' });
//         }
//     }
//
//     async getAllFavorites(req, res) {
//         try {
//             const id = req.id;
//
//             // Validate ID'
//             if (!id || !mongoose.Types.ObjectId.isValid(id)) {
//
//                 return res.status(400).json({ message: 'ID utilisateur invalide' });
//             }
//             // return res.json(id);
//
//             // Find the user by ID
//             const user = await Compte.findById(id);
//             if (!user) {
//                 return res.status(404).json({ message: 'Utilisateur non trouvé' });
//             }
//
//             // Find all favorites of the user
//             const favorites = await Favorite.find({ compte_id: user._id });
//             ;
//             return res.json(favorites);
//         } catch (error) {
//             return res.status(500).json({
//                 message: 'Erreur lors de la récupération des favoris',
//                 status: 'KO',
//                 error: error.message
//             });
//         }
//     }
//
//     async deleteFavorite(req, res) {
//         try {
//
//             const { favorite_id } = req.body;
//             const compte_id = req.id;
//
//             // Valider compte_id et favorite_id
//             if (!compte_id || !mongoose.Types.ObjectId.isValid(compte_id) || !favorite_id || !mongoose.Types.ObjectId.isValid(favorite_id)) {
//                 return res.status(400).json({ message: 'ID du compte ou ID du favori invalide' });
//             }
//
//             // Trouver le favori par ID et le compte associé
//             const result = await Favorite.deleteFavorite(compte_id, favorite_id);
//             if (result.deletedCount === 0) {
//                 return res.status(404).json({ message: 'Favori non trouvé ou déjà supprimé' });
//             }
//
//             return res.status(200).json({ message: 'Favori supprimé avec succès' });
//         } catch (error) {
//             return res.status(500).json({
//                 message: 'Erreur lors de la suppression du favori',
//                 status: 'KO',
//                 error: error.message
//             });
//         }
//     }
//
//     // Fonction pour signaler un compte
//     async signaler(req, res) {
//         try {
//             const { id, motif } = req.body; // Utiliser req.body pour récupérer l'ID du compte et le motif du signalement
//
//             // Valider l'ID
//             if (!id || !mongoose.Types.ObjectId.isValid(id)) {
//                 return res.status(400).json({ message: 'ID utilisateur invalide' });
//             }
//
//             // Trouver le compte par ID
//             const compte = await Compte.findById(id);
//             if (!compte) {
//                 return res.status(404).json({ message: 'Compte non trouvé' });
//             }
//
//             // Signaler le compte
//             const rapport = await Report.ReportCompte(id, motif, req.id);
//
//             return res.status(201).json({ message: 'Compte signalé avec succès', rapport });
//         } catch (error) {
//             return res.status(500).json({
//                 message: 'Erreur lors du signalement du compte',
//                 status: 'KO',
//                 error: error.message
//             });
//         }
//     }
//
//     async showClientProfile(req, res) {
//         try {
//             const idUser = req.id;
//             console.log("User ID: ", idUser);
//
//             // Trouver le compte par ID
//             const compte = await Compte.findById(idUser).exec();
//             if (!compte) {
//                 return res.status(404).json({ message: 'Compte not found', status: 'KO' });
//             }
//             console.log("Compte trouvé: ", compte);
//
//             // Récupérer le user_id depuis le compte
//             const userId = compte.user_id;
//             if (!userId) {
//                 return res.status(404).json({ message: 'User ID not found in compte', status: 'KO' });
//             }
//
//             // Trouver les informations de l'utilisateur en utilisant user_id
//             const user = await User.findById(userId).exec();
//             if (!user) {
//                 return res.status(404).json({ message: 'User not found', status: 'KO' });
//             }
//             console.log("Utilisateur trouvé: ", user);
//
//             let posts = [];
//
//             if (compte.role === 'tailleur') {
//                 // Si le compte est un tailleur, récupérer ses posts
//                 const tailleur = await Tailleur.findOne({ compte_id: compte._id }).exec();
//
//                 if (tailleur) {
//                     posts = await Post.find({ _id: { $in: tailleur.post_ids } }).exec();
//                 } else {
//                     throw new Error('Tailleur not found');
//                 }
//             } else if (compte.role === 'client') {
//
//                 const client = await Client.findOne({ compte_id: compte._id }).exec();
//                 if (client && client.followClient_ids.length > 0) {
//                     const followClients = await FollowClient.find({ client_id: client._id }).exec();
//                     const followedClientIds = followClients.map(follow => follow.followed_client_id);
//
//                     // Trouver les tailleurs suivis avec des comptes actifs
//                     const tailleurs = await Tailleur.find({ compte_id: { $in: followedClientIds } }).exec();
//                     const activeTailleurIds = [];
//
//                     for (const tailleur of tailleurs) {
//                         const compteSuivi = await Compte.findById(tailleur.compte_id).exec();
//                         if (compteSuivi && compteSuivi.etat === 'active') {
//                             activeTailleurIds.push(tailleur._id);
//                         }
//                     }
//
//                     // Récupérer les posts des tailleurs actifs
//                     posts = await Post.find({ author_id: { $in: activeTailleurIds } }).exec();
//                 }
//             } else {
//                 throw new Error('Unknown role');
//             }
//
//             // Répondre avec les données trouvées
//             res.status(200).json({
//
//                 // compte,
//                 // user,
//                 // posts,
//                 // role: compte.role
//
//                 compte: {
//                     role: compte.role,
//                     etat: compte.etat,
//                 },
//                 user: {
//                     lastname: user.lastname,
//                     firstname: user.firstname,
//                     city: user.city,
//                     picture: user.picture,
//                 },
//                 posts,
//                 role: compte.role
//             });
//         } catch (error) {
//             console.error('Error fetching client profile:', error);
//             res.status(500).json({ message: 'Internal server error', status: 'KO' });
//         }
//     }
//
//     // Récupérer tous les messages d'un client (utilisateur)
//     async getAllMessages(req, res) {
//         try {
//             const clientId = req.params.clientId || req.body.clientId || req.id;
//
//
//             if (!mongoose.Types.ObjectId.isValid(clientId)) {
//                 return res.status(400).json({ message: 'ID du client invalide', status: 'KO' });
//             }
//
//             const messages = await Message.find({
//                 $or: [
//                     { sender_id: clientId },
//                     { receiver_id: clientId }
//                 ]
//             }).populate('sender_id receiver_id', 'nom email');
//
//             if (messages.length === 0) {
//                 return res.status(404).json({ message: 'Aucun message trouvé', status: 'KO' });
//             }
//
//             res.status(200).json({ messages, status: 'OK' });
//         } catch (err) {
//             return res.status(500).json({ message: err.message, status: 'KO' });
//         }
//     }
//
//     // Envoyer un nouveau message
//     async sendMessage(req, res) {
//         try {
//             const senderId = req.params.senderId || req.body.senderId || req.id;
//             const receiverId = req.params.receiverId || req.body.receiverId || req.id;
//             const texte = req.params.texte || req.body.texte || req.id;
//
//             // Utilisez ces valeurs pour tester la fonction
//             // Vérifiez si les IDs sont valides
//             if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
//                 return res.status(400).json({ message: 'ID de l’expéditeur ou du destinataire invalide', status: 'KO' });
//             }
//
//             // Créer un nouveau message
//             const newMessage = new Message({
//                 texte,
//                 sender_id: senderId,
//                 receiver_id: receiverId,
//                 createdAt: new Date(),
//
//             });
//
//             // Sauvegarder le message dans la base de données
//             const savedMessage = await newMessage.save();
//
//             res.status(201).json({ message: 'Message envoyé avec succès', data: savedMessage, status: 'OK' });
//         } catch (err) {
//             console.error('Erreur lors de l\'envoi du message:', err); // Ajoutez un log d'erreur pour plus de détails
//             return res.status(500).json({ message: err.message, status: 'KO' });
//         }
//     }
//
//     // Ajouter un like
//     async addLike(req, res) {
//         try {
//             const { postId, compteId } = req.body;
//
//             // Vérifier si un like existe déjà pour le même post et compte
//             const existingLike = await Like.findOne({ post_id: postId, compte_id: compteId });
//             if (existingLike) {
//                 if (existingLike.etat === 'like') {
//                     return res.status(400).json({ message: 'Le like est déjà enregistré', status: 'KO' });
//                 } else {
//                     // Changer de dislike à like
//                     existingLike.etat = 'like';
//                     existingLike.updatedAt = new Date();
//                     await existingLike.save();
//
//                     // Décrémenter le compteur de dislikes et incrémenter celui de likes
//                     await Post.findByIdAndUpdate(postId, { $inc: { likeCount: 1, dislikeCount: -1 } });
//
//                     return res.status(200).json({
//                         message: 'État changé de dislike à like',
//                         data: existingLike,
//                         status: 'OK'
//                     });
//                 }
//             }
//
//             // Créer un nouveau like
//             const newLike = new Like({
//                 post_id: postId,
//                 compte_id: compteId,
//                 etat: 'like',
//                 createdAt: new Date(),
//                 updatedAt: new Date()
//             });
//
//             const savedLike = await newLike.save();
//
//             await Post.findByIdAndUpdate(postId, {
//                 $inc: { likeCount: 1 },
//                 $addToSet: { like_ids: savedLike._id }
//             });
//
//             res.status(201).json({ message: 'Like ajouté avec succès', data: savedLike, status: 'OK' });
//
//         } catch (err) {
//             return res.status(500).json({ message: err.message, status: 'KO' });
//         }
//     }
//
//     // Ajouter un dislike
//     async addDislike(req, res) {
//         try {
//             const { postId, compteId } = req.body;
//
//             // Vérifier si un dislike existe déjà pour le même post et compte
//             const existingLike = await Like.findOne({ post_id: postId, compte_id: compteId });
//             if (existingLike) {
//                 if (existingLike.etat === 'dislike') {
//                     return res.status(400).json({ message: 'Le dislike est déjà enregistré', status: 'KO' });
//                 } else {
//                     // Changer de like à dislike
//                     existingLike.etat = 'dislike';
//                     existingLike.updatedAt = new Date();
//                     await existingLike.save();
//
//                     // Décrémenter le compteur de likes et incrémenter celui de dislikes
//                     await Post.findByIdAndUpdate(postId, { $inc: { dislikeCount: 1, likeCount: -1 } });
//
//                     return res.status(200).json({
//                         message: 'État changé de like à dislike',
//                         data: existingLike,
//                         status: 'OK'
//                     });
//                 }
//             }
//
//             // Créer un nouveau dislike
//             const newDislike = new Like({
//                 post_id: postId,
//                 compte_id: compteId,
//                 etat: 'dislike',
//                 createdAt: new Date(),
//                 updatedAt: new Date()
//             });
//
//             const savedDislike = await newDislike.save();
//
//             // Incrémenter le compteur de dislikes
//             await Post.findByIdAndUpdate(postId, { $inc: { dislikeCount: 1 } });
//
//             res.status(201).json({ message: 'Dislike ajouté avec succès', data: savedDislike, status: 'OK' });
//
//         } catch (err) {
//             return res.status(500).json({ message: err.message, status: 'KO' });
//         }
//     }
//
//     // Supprimer un like ou dislike (unlike)
//     async removeLikeOrDislike(req, res) {
//         try {
//             const { postId, compteId, etat } = req.body;
//
//             // Vérifier que l'état est valide
//             if (!['like', 'dislike'].includes(etat)) {
//                 return res.status(400).json({ message: 'État invalide', status: 'KO' });
//             }
//
//             // Supprimer l'interaction pour le post, le compte, et l'état spécifiés
//             const result = await Like.deleteOne({ post_id: postId, compte_id: compteId, etat });
//
//             if (result.deletedCount === 0) {
//                 return res.status(404).json({
//                     message: `${etat.charAt(0).toUpperCase() + etat.slice(1)} non trouvé`,
//                     status: 'KO'
//                 });
//             }
//
//             // Décrémenter le compteur de l'état supprimé
//             const stateUpdate = {};
//             stateUpdate[`${etat}Count`] = -1;
//             await Post.findByIdAndUpdate(postId, { $inc: stateUpdate });
//
//             res.status(200).json({
//                 message: `${etat.charAt(0).toUpperCase() + etat.slice(1)} supprimé avec succès`,
//                 status: 'OK'
//             });
//
//         } catch (err) {
//             return res.status(500).json({ message: err.message, status: 'KO' });
//         }
//     }
//
//     async userProfile(req, res) {
//         // const user = await this.getLoginUser(req,res);
//         const id = req.id;
//         // return res.json(id);
//         // Trouver le client par ID
//         const compte = await Compte.findById(id);
//         // return res.json(!compte);
//         if (!compte) {
//             return res.status(404).json({ message: 'User non trouvé', status: 'KO' });
//         }
//         // return res.json(!compte);
//         return res.json({ compte, message: 'Le profile de l\'utilisateur', status: 'OK' });
//     }
//
//     async accueilSearch(req, res) {
//         const { searchText } = req.body
//         /**
//          * Faire la validation
//          */
//         const regex = new RegExp(searchText, 'i');
//
//         // Search in users collection
//         const usersResult = await User.find({
//             $or: [
//                 { lastname: { $regex: regex } },
//                 { firstname: { $regex: regex } }
//             ]
//         });
//
//
//         // Extract user IDs
//         const userIds = await usersResult.map(user => user._id);
//
//         const comptes = await Compte.find({
//             $and: [
//                 {
//                     $or: [
//                         { user_id: { $in: userIds } },
//                         { identifiant: { $regex: regex } }
//                     ]
//                 },
//                 { etat: "active" }
//             ]
//         });
//
//         if (!comptes) {
//             return res.status(500).json({ message: 'pas de compte retrouver', status: 'KO' });
//         }
//
//         const posts = await Post.find({
//             $or: [
//                 { content: { $regex: regex } },
//                 { title: { $regex: regex } }
//             ]
//         })
//         if (!posts) {
//             return res.status(500).json({ message: 'pas de post retrouver', status: 'KO' });
//         }
//         return res.json({ comptes, posts, message: 'Résultats de la recherche', status: 'OK' });
//     }
//
//     async ajoutComment(req, res) {
//         // return res.json(1);
//         const { content, idPost } = req.body;
//         const idCompte = req.id;
//
//         /**
//          * valider le content ici
//          */
//
//         // return res.json(content, idPost);
//         const newComment = new Comment({
//             content,
//             compte_id: idCompte,
//             post_id: idPost,
//             createdAt: new Date(),
//             updatedAt: new Date()
//         });
//         await newComment.save();
//
//         const post = await Post.findByIdAndUpdate(idPost, {
//             $push: { comment_ids: newComment._id },
//             updatedAt: new Date()
//         }, { new: true });
//
//         if (!post) {
//             return res.status(404).json({ message: 'Post non trouvé', status: 'KO' });
//         }
//
//         return res.json({ comment: newComment, message: 'Commentaire ajouté', status: 'OK' });
//
//     }
//
//     async reponseComment(req, res) {
//         const { content, idComment } = req.body;
//         const idCompte = req.id;
//         /**
//          * valider le content ici
//          */
//
//         const newCommentResponse = new CommentResponse({
//             texte: content,
//             compte_id: idCompte,
//             comment_id: idComment,
//             createdAt: new Date(),
//             updatedAt: new Date()
//         });
//         await newCommentResponse.save();
//
//         const comment = await Comment.findByIdAndUpdate(idComment, {
//             $push: { commentResponse_ids: newCommentResponse._id },
//             updatedAt: new Date()
//         }, { new: true });
//
//         if (!comment) {
//             return res.status(404).json({ message: 'Commentaire non trouvé', status: 'KO' });
//         }
//
//         return res.json({ commentResponse: newCommentResponse, message: 'Réponse ajoutée', status: 'OK' });
//     }
//
//     async deleteComment(req, res) {
//         const { idComment } = req.body;
//
//         const idCompte = req.id;
//
//         const commentDelete = await Comment.findOneAndDelete(idComment);
//
//
//         if (!commentDelete) {
//             return res.status(500).json({ message: 'Commentaire non trouvé', status: 'KO' });
//         }
//
//         return res.json({ message: 'Commentaire supprimé', status: 'OK' });
//     }
//
//     async deleteResponseComment(req, res) {
//         const { idCommentResponse } = req.body;
//
//         const commentResponse = await CommentResponse.findByIdAndDelete(idCommentResponse);
//
//         if (!commentResponse) {
//             return res.status(404).json({ message: 'Réponse de commentaire non trouvée', status: 'KO' });
//         }
//
//         return res.json({ message: 'Réponse de commentaire supprimée', status: 'OK' });
//     }
//
//     // Méthode pour incrémenter le nombre de partages
//     async ShareNb(req, res) {
//         try {
//             const { postId } = req.body; // Assurez-vous d'utiliser req.body si vous passez postId dans le corps
//
//             console.log('Received postId:', postId);
//
//             // Vérifier si l'ID est un ObjectId valide
//             if (!mongoose.Types.ObjectId.isValid(postId)) {
//                 console.log('Invalid postId');
//                 return res.status(400).json({ message: 'ID de post invalide', status: 'KO' });
//             }
//
//             // Rechercher le post par ID
//             const post = await Post.findById(postId);
//             if (!post) {
//                 console.log('Post not found');
//                 return res.status(404).json({ message: 'Post non trouvé', status: 'KO' });
//             }
//
//             // Incrémenter le nombre de partages
//             const updatedPost = await Post.findByIdAndUpdate(
//                 postId,
//                 { $inc: { shareNb: 1 } },
//                 { new: true, fields: { shareNb: 1 } }
//             );
//
//             if (!updatedPost) {
//                 return res.status(404).json({ message: 'Post non trouvé après mise à jour', status: 'KO' });
//             }
//
//             console.log('Share count updated:', updatedPost.shareNb);
//
//             // Retourner la nouvelle valeur de shareNb
//             return res.status(200).json({
//                 message: 'Partage réussi.',
//                 data: { shareNb: updatedPost.shareNb },
//                 status: 'OK',
//             });
//         } catch (error) {
//             console.error('Error during sharing:', error);
//             return res.status(500).json({ message: 'Erreur lors du partage.', error: error.message, status: 'KO' });
//         }
//     }
//
//     async ViewsNb(req, res) {
//         try {
//             const { postId } = req.body; // Assurez-vous d'utiliser req.body si vous passez postId dans le corps
//
//             console.log('Received postId:', postId);
//
//             // Vérifier si l'ID est un ObjectId valide
//             if (!mongoose.Types.ObjectId.isValid(postId)) {
//                 console.log('Invalid postId');
//                 return res.status(400).json({ message: 'ID de post invalide', status: 'KO' });
//             }
//
//             // Rechercher le post par ID
//             const post = await Post.findById(postId);
//             if (!post) {
//                 console.log('Post not found');
//                 return res.status(404).json({ message: 'Post non trouvé', status: 'KO' });
//             }
//
//             // Incrémenter le nombre de partages
//             const updatedPost = await Post.findByIdAndUpdate(
//                 postId,
//                 { $inc: { viewsNb: 1 } },
//                 { new: true, fields: { viewsNb: 1 } }
//             );
//
//             if (!updatedPost) {
//                 return res.status(404).json({ message: 'Post non trouvé après mise à jour', status: 'KO' });
//             }
//
//             return res.json({ message: 'Post Vu', status: 'OK' });
//         } catch (error) {
//             return res.status(500).json({ message: error.message, status: 'KO' });
//         }
//     }
//
//     async createCommande(req, res) {
//         try {
//             const { tissuPostId, clientId } = req.body;
//
//             // Vérifions si l'identifiant du tissuPost est valide
//             if (!mongoose.Types.ObjectId.isValid(tissuPostId)) {
//                 // console.log('tissuPostId:', tissuPostId);
//                 return res.status(400).json({ message: 'ID de TissuPost invalide', status: 'KO' });
//             }
//
//             // Vérifioons si l'identifiant du client est valide
//             const tissuPosts = await TissuPost.findById(tissuPostId).exec();
//             console.log(tissuPostId);
//             if (!tissuPosts) {
//                 return res.status(404).json({ message: 'TissuPost non trouvé', status: 'KO' });
//             }
//
//             const newCommande = new Commande({
//                 tissupost_id: tissuPostId,
//                 client_id: clientId,
//                 createdAt: new Date(),
//                 updatedAt: new Date()
//             });
//
//             // Enregistrez la nouvelle commande dans la base de données
//             await newCommande.save();
//
//             return res.status(201).json({ message: 'Commande créée avec succès', commande: newCommande, status: 'OK' });
//
//         } catch (error) {
//             return res.status(500).json({ message: error.message, status: 'KO' });
//         }
//     }
//
//
//     async follow(req, res) {
//         const { idFollowedCompte } = req.body;
//         const idCompte = req.id;
//
//         if (!idFollowedCompte) {
//             return res.status(400).json({ message: 'ID de compte à suivre est obligatoire', status: 'KO' });
//         }
//
//         const follow = new Follow({
//             followed_id: idFollowedCompte,
//             follower_id: idCompte
//         });
//
//         follow.save();
//
//         if (!follow) {
//             return res.status(500).json({ message: 'Le follow à échoué', status: 'KO' });
//         }
//
//         const followed = await Compte.findByIdAndUpdate(idFollowedCompte, {
//             $push: { follower_ids: follow._id },
//             updatedAt: new Date()
//         }, { new: true });
//
//         const follower = await Compte.findByIdAndUpdate(idCompte, {
//             $push: { follower_ids: follow._id },
//             updatedAt: new Date()
//         }, { new: true });
//
//         return res.json({ message: 'Vous avez suivi l\'utilisateur', status: 'OK' });
//     }
//
//     async addMeasure(req, res) {
//         try {
//             const { Epaule, Manche, Longueur, Poitrine, Fesse, Taille, Cou } = req.body;
//
//             // Vérifiez si tous les champs sont présents et sont des nombres
//             const fields = { Epaule, Manche, Longueur, Poitrine, Fesse, Taille, Cou };
//             for (const [key, value] of Object.entries(fields)) {
//                 if (value === undefined) {
//                     return res.status(400).json({ message: `${key} is required` });
//                 }
//                 if (isNaN(value) || value < 0) {
//                     return res.status(400).json({ message: `${key} must be a positive number` });
//                 }
//             }
//
//             // Vérifiez si l'utilisateur est authentifié
//             if (!req.user || !req.user.id) {
//                 return res.status(401).json({ message: "User not authenticated" });
//             }
//             const compte_id = req.user.id;
//
//             const newMeasure = new Measure({
//                 ...fields,
//                 compte_id
//             });
//
//             const savedMeasure = await newMeasure.save();
//
//             // Mise à jour du client avec la nouvelle mesure
//             await Client.findOneAndUpdate(
//                 { compte_id: compte_id },
//                 { $push: { measure_ids: savedMeasure._id } }
//             );
//
//             res.status(201).json({ message: "Measure added successfully", measure: savedMeasure });
//         } catch (error) {
//             res.status(500).json({ message: "Error adding measure", error: error.message });
//         }
//     }
//
//     //fonction pour ajouter la note d'un compte
//     async addNote(req, res) {
//         try {
//             // Récupération des données du corps de la requête
//             const { who_note_id, noted_id, rating } = req.body;
//
//             // Validation des données
//             if (!who_note_id || !noted_id || typeof rating !== 'number') {
//                 return res.status(400).json({ error: 'Les champs who_note_id, noted_id et rating sont requis, et rating doit être un nombre.' });
//             }
//
//             // Appel de la méthode statique pour ajouter une note
//             const note = await Note.addNote(who_note_id, noted_id, rating);
//
//             // Réponse réussie
//             return res.status(201).json({ message: 'Note ajoutée avec succès.', note });
//         } catch (error) {
//             // Gestion des erreurs
//             return res.status(500).json({ error: error.message });
//         }
//     }
//
//     // Exemple de fonction pour récupérer les notifications d'un utilisateur
//     async getNotificationsForUser(req, res) {
//         const userId = req.id;
//
//         if (!userId) {
//             return res.status(400).json({ error: 'ID utilisateur manquant' });
//         }
//
//         try {
//             // Recherchez toutes les notifications associées au compte de l'utilisateur
//             const notifications = await Notification.find({ compte_id: userId }).exec();
//             // .populate('post_id')
//             // console.log(notifications);
//             // Retourner les notifications trouvées
//             return res.status(200).json({ notifications, message: "Notifications chargées.", status: "OK" });
//         } catch (error) {
//             console.error('Erreur lors de la récupération des notifications :', error);
//             return res.status(500).json({ message: error.message, status: "KO" });
//         }
//     }
//
//     async getClientMeasures(req, res) {
//         try {
//             const userId = req.id;
//
//             // Valider l'ID du client
//             if (!userId) {
//                 return res.status(400).json({ message: 'ID du client invalide', status: 'KO' });
//             }
//
//             // Trouver les mesures du client en utilisant l'ID du compte
//             const measures = await Measure.find({ compte_id: userId }).exec();
//
//             // console.log(measures);
//
//             if (!measures.length) {
//                 return res.status(404).json({ message: 'Aucune mesure trouvée pour ce client', status: 'KO' });
//             }
//
//             return res.status(200).json(measures);
//         } catch (err) {
//             return res.status(500).json({ message: err.message, status: 'KO' });
//         }
//     }
//
//     async getPostById(req, res) {
//         try {
//             const postId = req.params.id; // Assurez-vous que l'ID provient du bon endroit
//             console.log(`Received Post ID: ${postId}`);
//
//             // Valider l'ID du post
//             if (!mongoose.Types.ObjectId.isValid(postId)) {
//                 return res.status(400).json({ message: 'ID de post invalide', status: 'KO' });
//             }
//
//             // Trouver le post par ID
//             const post = await Post.findById(postId).populate('author_id').lean();
//             if (!post) {
//                 return res.status(404).json({ message: 'Post non trouvé', status: 'KO' });
//             }
//
//             // Retourner le post
//             return res.status(200).json({ post, status: 'OK' });
//         } catch (err) {
//             return res.status(500).json({ message: 'Erreur interne du serveur', status: 'KO' });
//         }
//     }
//
//     async getSomeProfile(req, res) {
//         const { identifiant } = req.params;
//         // return res.json(identifiant);
//         const idCompte = req.id;
//         const monCompte = await Compte.findById(idCompte);
//
//         const compte = await Compte.findOne({ identifiant });
//         // return res.json(compte);
//         const user = await User.findOne({ _id: compte.user_id });
//
//         if (compte.role === 'tailleur') {
//             const tailleur = await Tailleur.findOne({ compte_id: compte._id });
//
//             const posts = await Post.find({ author_id: tailleur._id });
//             return res.json({ user, compte, posts, message: "Profile de l'utilisateur", status: 'OK' });
//         }
//         if (compte.role === 'client') {
//             const herFollowersPost = await this.getMyFollowersPost(compte);
//             return res.json({ user, compte, herFollowersPost, message: "Profile de l'utilisateur", status: 'OK' });
//         }
//     }
//
//     async bloquer(req, res) {
//
//         try {
//             const { userIdToBlock } = req.body;  // L'ID de l'utilisateur à bloquer
//             const tailleurId = req.id;  // L'ID de l'utilisateur connecté (doit être un tailleur)
//
//             // Vérifier si le tailleur est connecté
//             const tailleur = await Compte.findById(tailleurId).populate('role');
//             if (!tailleur || tailleur.role !== 'tailleur') {
//                 return res.status(403).json({
//                     message: "Accès refusé. Seuls les tailleurs peuvent bloquer des utilisateurs.",
//                     status: 'KO'
//                 });
//             }
//
//             // Vérifier si l'utilisateur à bloquer est un tailleur ou un client suivi par le tailleur
//             const userToBlock = await Compte.findById(userIdToBlock);
//
//             if (!userToBlock) {
//                 return res.status(404).json({ message: "Utilisateur à bloquer introuvable.", status: 'KO' });
//
//             }
//
//
//             // Vérifier si le tailleur suit l'utilisateur à bloquer
//             const isFollowed = tailleur.follower_ids.some(followerId => followerId.toString() === userIdToBlock);
//             if (!isFollowed) {
//                 return res.status(403).json({
//                     message: "Vous ne pouvez bloquer que des utilisateurs que vous suivez.",
//                     status: 'KO'
//                 });
//             }
//
//             // Créer l'enregistrement de blocage
//             const newBloquer = new Bloquer({
//                 blocker_id: tailleurId,
//                 blocked_id: userIdToBlock,
//                 createdAt: new Date(),
//                 updatedAt: new Date()
//             });
//
//             await newBloquer.save();
//
//             res.status(200).json({ message: "L'utilisateur a été bloqué avec succès.", status: 'OK' });
//         } catch (error) {
//             console.error('Erreur lors du blocage de l\'utilisateur:', error);
//             res.status(500).json({ message: 'Erreur lors du blocage de l\'utilisateur', status: 'KO' });
//         }
//     }
// }
//
// export default new ClientController();