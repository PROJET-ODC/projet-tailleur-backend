import mongoose from "mongoose";
import User from "../model/User.js"; // Ensure the User model is imported
import Report from "../model/Report.js"; // Ensure the Report model is imported
import Post from "../model/Post.js";
import Status from "../model/Status.js";
import Notification from '../model/Notification.js';
import Message from "../model/Message.js";
import Favorite from "../model/Favorite.js";
import Compte from "../model/Compte.js";  // Importer le modèle Compte
import {createJWT} from '../utils/jwt.js';
import Tailleur from '../model/Tailleur.js';
import Client from '../model/Client.js';
import Like from '../model/Like.js';
import Comment from "../model/Comment.js";
import CommentResponse from "../model/CommentResponse.js";
import "dotenv/config";

class ClientController {

    async createAccount(req, res) {
        try {
            // Créez un nouveau compte
            const newAccount = new Compte({...req.body, createdAt: new Date(), updatedAt: new Date()});
            await newAccount.save();

            // Générer un token JWT contenant l'ID du compte et le rôle
            const token = createJWT({payload: {id: newAccount._id, role: newAccount.role}});

            return res.status(201).json({account: newAccount, token, status: 'OK'});
        } catch (err) {
            return res.status(500).json({message: err.message, status: 'KO'});
        }
    }

    async getNewsFeed(req, res) {
        try {
            const Posts = await Post.find().populate('author_id').lean();
            const statuses = await Status.find().populate('tailleur_id').lean();

            const notifications = await Notification.find().populate('post_id').lean();

            const newsFeed = {
                Posts,
                statuses,
                notificationLinks,  // Inclure uniquement les liens des notifications
                /*  messageLinks,       // Inclure uniquement les liens des messages
                 favoriteLinks  */      // Inclure uniquement les liens des favoris
            };

            return res.status(200).json({newsFeed, status: 'OK'});
        } catch (err) {
            return res.status(500).json({message: err.message, status: 'KO'});
        }
    }

    async getAccount(req, res) {
        try {
            const account = await Compte.findById(req.params.id).populate('user_id').populate('comment_ids').populate('favorite_ids').populate('follower_ids').populate('report_ids').populate('note_ids');
            if (!account) {
                return res.status(404).json({message: 'Account not found', status: 'KO'});
            }
            return res.status(200).json({account, status: 'OK'});
        } catch (err) {
            return res.status(500).json({message: err.message, status: 'KO'});
        }
    }

    async listStatus(req, res) {
        try {
            const statuses = await Status.find().populate('tailleur_id');
            return res.status(200).json({statuses, status: 'OK'});
        } catch (err) {
            return res.status(500).json({message: err.message, status: 'KO'});
        }
    }

    async getNotificationById(req, res) {
        try {
            const notification = await Notification.findById(req.params.id).populate('post_id').lean();
            if (!notification) {
                return res.status(404).json({message: 'Notification not found', status: 'KO'});
            }
            return res.status(200).json({notification, status: 'OK'});
        } catch (err) {
            return res.status(500).json({message: err.message, status: 'KO'});
        }
    }

// De même, ajouter les méthodes pour getMessageById et getFavoriteById
    async getMessageById(req, res) {
        try {
            const message = await Message.findById(req.params.id).populate('sender_id').lean();
            if (!message) {
                return res.status(404).json({message: 'Message not found', status: 'KO'});
            }
            return res.status(200).json({message, status: 'OK'});
        } catch (err) {
            return res.status(500).json({message: err.message, status: 'KO'});
        }
    }

    async getFavoriteById(req, res) {
        try {
            const favorite = await Favorite.findById(req.params.id).populate('post_id').lean();
            if (!favorite) {
                return res.status(404).json({message: 'Favorite not found', status: 'KO'});
            }
            return res.status(200).json({favorite, status: 'OK'});
        } catch (err) {
            return res.status(500).json({message: err.message, status: 'KO'});
        }
    }


    async listFavorites(req, res) {
        try {
            const favorites = await Favorite.find({compte_id: req.user.id}).populate('post_id');
            return res.status(200).json({favorites, status: 'OK'});
        } catch (err) {
            return res.status(500).json({message: err.message, status: 'KO'});
        }
    }

    async addFavorite(req, res) {
        try {
            const newFavorite = new Favorite({...req.body, createdAt: new Date(), updatedAt: new Date()});
            await newFavorite.save();
            return res.status(201).json({favorite: newFavorite, status: 'OK'});
        } catch (err) {
            return res.status(500).json({message: err.message, status: 'KO'});
        }
    }

    async getAllFavorites(req, res) {
        try {
            const id = req.id;
            console.log("ok");
            // const id = "66b38c03f583892b04f8e6a8";
            console.log('ID utilisateur:', id);

            // Validate ID'
            if (!id || !mongoose.Types.ObjectId.isValid(id)) {

                return res.status(400).json({message: 'ID utilisateur invalide'});
            }
            // return res.json(id);            

            // Find the user by ID
            const user = await Compte.findById(id);
            if (!user) {
                return res.status(404).json({message: 'Utilisateur non trouvé'});
            }

            // Find all favorites of the user
            const favorites = await Favorite.find({compte_id: user._id});
            ;
            return res.json(favorites);
        } catch (error) {
            return res.status(500).json({
                message: 'Erreur lors de la récupération des favoris',
                status: 'KO',
                error: error.message
            });
        }
    }

    async addFavorite(req, res) {
        try {
            const userId = req.id; // Utiliser req.id défini par le middleware
            const {post_id} = req.body;

            // Valider userId et post_id
            if (!userId || !mongoose.Types.ObjectId.isValid(userId) || !post_id || !mongoose.Types.ObjectId.isValid(post_id)) {
                return res.status(400).json({message: 'ID utilisateur ou ID du post invalide'});
            }

            // Trouver l'utilisateur par ID
            const user = await Compte.findById(userId);
            if (!user) {
                return res.status(404).json({message: 'Utilisateur non trouvé'});
            }

            // Ajouter le favori
            const favorite = await Favorite.addFavorite(user._id, post_id);
            return res.status(201).json(favorite);
        } catch (error) {
            return res.status(500).json({
                message: 'Erreur lors de l\'ajout du favori',
                status: 'KO',
                error: error.message
            });
        }
    }

    async deleteFavorite(req, res) {
        try {
            const {compte_id, favorite_id} = req.body;

            // Valider compte_id et favorite_id
            if (!compte_id || !mongoose.Types.ObjectId.isValid(compte_id) || !favorite_id || !mongoose.Types.ObjectId.isValid(favorite_id)) {
                return res.status(400).json({message: 'ID du compte ou ID du favori invalide'});
            }

            // Trouver le favori par ID et le compte associé
            const result = await Favorite.deleteFavorite(compte_id, favorite_id);
            if (result.deletedCount === 0) {
                return res.status(404).json({message: 'Favori non trouvé ou déjà supprimé'});
            }

            return res.status(200).json({message: 'Favori supprimé avec succès'});
        } catch (error) {
            return res.status(500).json({
                message: 'Erreur lors de la suppression du favori',
                status: 'KO',
                error: error.message
            });
        }
    }


    // Fonction pour signaler un compte
    async signaler(req, res) {
        try {
            const {id, motif} = req.body; // Utiliser req.body pour récupérer l'ID du compte et le motif du signalement

            // Valider l'ID
            if (!id || !mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({message: 'ID utilisateur invalide'});
            }

            // Trouver le compte par ID
            const compte = await Compte.findById(id);
            if (!compte) {
                return res.status(404).json({message: 'Compte non trouvé'});
            }

            // Signaler le compte
            const rapport = await Report.ReportCompte(id, motif, req.id);

            return res.status(201).json({message: 'Compte signalé avec succès', rapport});
        } catch (error) {
            return res.status(500).json({
                message: 'Erreur lors du signalement du compte',
                status: 'KO',
                error: error.message
            });
        }
    }

    async showClientProfile(req, res) {
        try {
            const idUser = req.id;
            console.log("User ID: ", idUser);

            // Trouver le compte par ID
            const compte = await Compte.findById(idUser).exec();
            if (!compte) {
                return res.status(404).json({message: 'Compte not found', status: 'KO'});
            }
            console.log("Compte trouvé: ", compte);

            // Récupérer le user_id depuis le compte
            const userId = compte.user_id;
            if (!userId) {
                return res.status(404).json({message: 'User ID not found in compte', status: 'KO'});
            }

            // Trouver les informations de l'utilisateur en utilisant user_id
            const user = await User.findById(userId).exec();
            if (!user) {
                return res.status(404).json({message: 'User not found', status: 'KO'});
            }
            console.log("Utilisateur trouvé: ", user);

            let posts = [];

            if (compte.role === 'tailleur') {
                const tailleur = await Tailleur.findOne({compte_id: compte._id}).exec();
                if (tailleur) {
                    posts = await Post.find({_id: {$in: tailleur.post_ids}}).exec();
                } else {
                    throw new Error('Tailleur not found');
                }
            } else if (compte.role === 'client') {
                const client = await Client.findOne({compte_id: compte._id}).exec();
                if (client && client.followClient_ids.length > 0) {
                    const followClients = await FollowClient.find({client_id: client._id}).exec();
                    const followedClientIds = followClients.map(follow => follow.followed_client_id);

                    const tailleurs = await Tailleur.find({compte_id: {$in: followedClientIds}}).exec();
                    const tailleurIds = tailleurs.map(tailleur => tailleur._id);

                    posts = await Post.find({author_id: {$in: tailleurIds}}).exec();
                }
            } else {
                throw new Error('Unknown role');
            }

            // Répondre avec les données trouvées
            res.status(200).json({
                compte,
                user,
                posts,
                role: compte.role
            });
        } catch (error) {
            console.error('Error fetching client profile:', error);
            res.status(500).json({message: 'Internal server error', status: 'KO'});
        }
    }

    // Récupérer tous les messages d'un client (utilisateur)
    async getAllMessages(req, res) {
        try {
            const clientId = req.params.clientId || req.body.clientId || req.id;


            if (!mongoose.Types.ObjectId.isValid(clientId)) {
                return res.status(400).json({message: 'ID du client invalide', status: 'KO'});
            }

            const messages = await Message.find({
                $or: [
                    {sender_id: clientId},
                    {receiver_id: clientId}
                ]
            }).populate('sender_id receiver_id', 'nom email');

            if (messages.length === 0) {
                return res.status(404).json({message: 'Aucun message trouvé', status: 'KO'});
            }

            res.status(200).json({messages, status: 'OK'});
        } catch (err) {
            return res.status(500).json({message: err.message, status: 'KO'});
        }
    }

    // Envoyer un nouveau message
    async sendMessage(req, res) {
        try {
            const senderId = req.params.senderId || req.body.senderId || req.id;
            const receiverId = req.params.receiverId || req.body.receiverId || req.id;
            const texte = req.params.texte || req.body.texte || req.id;


            // Utilisez ces valeurs pour tester la fonction


            // Vérifiez si les IDs sont valides
            if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
                return res.status(400).json({message: 'ID de l’expéditeur ou du destinataire invalide', status: 'KO'});
            }

            // Créer un nouveau message
            const newMessage = new Message({
                texte,
                sender_id: senderId,
                receiver_id: receiverId
            });

            // Sauvegarder le message dans la base de données
            const savedMessage = await newMessage.save();

            res.status(201).json({message: 'Message envoyé avec succès', data: savedMessage, status: 'OK'});
        } catch (err) {
            console.error('Erreur lors de l\'envoi du message:', err); // Ajoutez un log d'erreur pour plus de détails
            return res.status(500).json({message: err.message, status: 'KO'});
        }
    }

    // Ajouter un like
    async addLike(req, res) {
        try {
            const {postId, compteId} = req.body;

            // Vérifier si un like existe déjà pour le même post et compte
            const existingLike = await Like.findOne({post_id: postId, compte_id: compteId});
            if (existingLike) {
                if (existingLike.etat === 'like') {
                    return res.status(400).json({message: 'Le like est déjà enregistré', status: 'KO'});
                } else {
                    // Changer de dislike à like
                    existingLike.etat = 'like';
                    existingLike.updatedAt = new Date();
                    await existingLike.save();

                    // Décrémenter le compteur de dislikes et incrémenter celui de likes
                    await Post.findByIdAndUpdate(postId, {$inc: {likeCount: 1, dislikeCount: -1}});

                    return res.status(200).json({
                        message: 'État changé de dislike à like',
                        data: existingLike,
                        status: 'OK'
                    });
                }
            }

            // Créer un nouveau like
            const newLike = new Like({
                post_id: postId,
                compte_id: compteId,
                etat: 'like',
                createdAt: new Date(),
                updatedAt: new Date()
            });

            const savedLike = await newLike.save();

            // Incrémenter le compteur de likes
            await Post.findByIdAndUpdate(postId, {$inc: {likeCount: 1}});

            res.status(201).json({message: 'Like ajouté avec succès', data: savedLike, status: 'OK'});

        } catch (err) {
            return res.status(500).json({message: err.message, status: 'KO'});
        }
    }

    // Ajouter un dislike
    async addDislike(req, res) {
        try {
            const {postId, compteId} = req.body;

            // Vérifier si un dislike existe déjà pour le même post et compte
            const existingLike = await Like.findOne({post_id: postId, compte_id: compteId});
            if (existingLike) {
                if (existingLike.etat === 'dislike') {
                    return res.status(400).json({message: 'Le dislike est déjà enregistré', status: 'KO'});
                } else {
                    // Changer de like à dislike
                    existingLike.etat = 'dislike';
                    existingLike.updatedAt = new Date();
                    await existingLike.save();

                    // Décrémenter le compteur de likes et incrémenter celui de dislikes
                    await Post.findByIdAndUpdate(postId, {$inc: {dislikeCount: 1, likeCount: -1}});

                    return res.status(200).json({
                        message: 'État changé de like à dislike',
                        data: existingLike,
                        status: 'OK'
                    });
                }
            }

            // Créer un nouveau dislike
            const newDislike = new Like({
                post_id: postId,
                compte_id: compteId,
                etat: 'dislike',
                createdAt: new Date(),
                updatedAt: new Date()
            });

            const savedDislike = await newDislike.save();

            // Incrémenter le compteur de dislikes
            await Post.findByIdAndUpdate(postId, {$inc: {dislikeCount: 1}});

            res.status(201).json({message: 'Dislike ajouté avec succès', data: savedDislike, status: 'OK'});

        } catch (err) {
            return res.status(500).json({message: err.message, status: 'KO'});
        }
    }

    // Supprimer un like ou dislike (unlike)
    async removeLikeOrDislike(req, res) {
        try {
            const {postId, compteId, etat} = req.body;

            // Vérifier que l'état est valide
            if (!['like', 'dislike'].includes(etat)) {
                return res.status(400).json({message: 'État invalide', status: 'KO'});
            }

            // Supprimer l'interaction pour le post, le compte, et l'état spécifiés
            const result = await Like.deleteOne({post_id: postId, compte_id: compteId, etat});

            if (result.deletedCount === 0) {
                return res.status(404).json({
                    message: `${etat.charAt(0).toUpperCase() + etat.slice(1)} non trouvé`,
                    status: 'KO'
                });
            }

            // Décrémenter le compteur de l'état supprimé
            const stateUpdate = {};
            stateUpdate[`${etat}Count`] = -1;
            await Post.findByIdAndUpdate(postId, {$inc: stateUpdate});

            res.status(200).json({
                message: `${etat.charAt(0).toUpperCase() + etat.slice(1)} supprimé avec succès`,
                status: 'OK'
            });

        } catch (err) {
            return res.status(500).json({message: err.message, status: 'KO'});
        }
    }

    async userProfile(req, res) {
        // const user = await this.getLoginUser(req,res);
        const id = req.id;
        // return res.json(id);
        // Trouver le client par ID
        const compte = await Compte.findById(id);
        // return res.json(!compte);
        if (!compte) {
            return res.status(404).json({message: 'User non trouvé', status: 'KO'});
        }
        // return res.json(!compte);
        return res.json({compte, message: 'Le profile de l\'utilisateur', status: 'OK'});
    }

    async accueilSearch(req, res) {
        const {searchText} = req.body
        /**
         * Faire la validation
         */
        const regex = new RegExp(searchText, 'i');

        // Search in users collection
        const usersResult = await User.find({
            $or: [
                {lastname: {$regex: regex}},
                {firstname: {$regex: regex}}
            ]
        });


        // Extract user IDs
        const userIds = await usersResult.map(user => user._id);

        // Search in comptes collection using the user IDs
        const comptes = await Compte.find({
            $or: [
                {user_id: {$in: userIds}},
                {identifiant: {$regex: regex}}
            ]
        });

        if (!comptes) {
            return res.status(500).json({message: 'pas de compte retrouver', status: 'KO'});
        }

        const posts = await Post.find({
            $or: [
                {content: {$regex: regex}},
                {title: {$regex: regex}}
            ]
        })
        if (!posts) {
            return res.status(500).json({message: 'pas de post retrouver', status: 'KO'});
        }
        return res.json({comptes, posts, message: 'Résultats de la recherche', status: 'OK'});
    }

    async ajoutComment(req, res) {
        const {content, idPost} = req.body;
        const idCompte = req.id;

        /**
         * valider le content ici
         */

        const newComment = new Comment({
            content,
            compte_id: idCompte,
            post_id: idPost,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        await newComment.save();

        const post = await Post.findByIdAndUpdate(idPost, {
            $push: {comment_ids: newComment._id},
            updatedAt: new Date()
        }, {new: true});

        if (!post) {
            return res.status(404).json({message: 'Post non trouvé', status: 'KO'});
        }

        return res.json({comment: newComment, message: 'Commentaire ajouté', status: 'OK'});

    }

    async reponseComment(req, res) {
        const {content, idComment, idCompte} = req.body;

        /**
         * valider le content ici
         */

        const newCommentResponse = new CommentResponse({
            texte: content,
            compte_id: idCompte,
            comment_id: idComment,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        await newCommentResponse.save();

        const comment = await Comment.findByIdAndUpdate(idComment, {
            $push: {commentResponse_ids: newCommentResponse._id},
            updatedAt: new Date()
        }, {new: true});

        if (!comment) {
            return res.status(404).json({message: 'Commentaire non trouvé', status: 'KO'});
        }

        return res.json({commentResponse: newCommentResponse, message: 'Réponse ajoutée', status: 'OK'});
    }

    async deleteComment(req, res) {
        const { idComment } = req.body;
        const idCompte = req.id;

        const compte = await Compte.findById(idCompte);
        const lecomment = await Comment.findById(idComment);

        if (!lecomment) {
            return res.status(404).json({ message: 'Commentaire non trouvé', status: 'KO' });
        }

        if (compte.role === "tailleur") {
            const tailleur = await Tailleur.findOne({ compte_id: compte._id });

            // si le role c'est tailleur, il peut supprimer ces commentaires et les commentaires d'autres sur son post
            const post = await Post.findOneAndUpdate(
                {
                    _id: lecomment.post_id
                },
                {
                    $pull: { comment_ids: idComment },
                    updatedAt: new Date()
                },
                { new: true }
            );

            if (!post) {
                return res.status(404).json({ message: 'Post non trouvé', status: 'KO' });
            }

            const commentDelete =  await Comment.findByIdAndDelete(idComment);

            if(!commentDelete){
                return res.status(500).json({ message: 'Commentaire non trouvé', status: 'KO' });
            }

            await CommentResponse.deleteMany({ comment_id: idComment });

            return res.json({ message: 'Commentaire supprimé et ses réponses', status: 'OK' });

        } else {
            // Si le rôle n'est pas "tailleur", supprimer le commentaire et l'ID du commentaire du Post
            const post = await Post.findOneAndUpdate(
                { 'comment_ids._id': idComment },
                {
                    $pull: { comment_ids: idComment },
                    updatedAt: new Date()
                },
                { new: true }
            );

            if (!post) {
                return res.status(404).json({ message: 'Post non trouvé', status: 'KO' });
            }

            await Comment.findByIdAndDelete(idComment);

            return res.json({ message: 'Commentaire supprimé', status: 'OK' });
        }
    }

    async deleteResponseComment(req, res) {
        const {idCommentResponse} = req.body;

        const commentResponse = await CommentResponse.findByIdAndDelete(idCommentResponse);

        if (!commentResponse) {
            return res.status(404).json({message: 'Réponse de commentaire non trouvée', status: 'KO'});
        }

        return res.json({message: 'Réponse de commentaire supprimée', status: 'OK'});
    }
}

export default new ClientController();
