// @ts-nocheck
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { createJWT } from '../utils/jwt.js';
import {ControllerRequest} from "../interface/Interface.js";

const prisma = new PrismaClient();
class ClientController {
    constructor() {
    }
    async getMyFollowersPost(compteId: string): Promise<any[]> {
        const myFollowers = await prisma.follow.findMany({
            where: {
                followerId: compteId,
            },
            include: {
                followed: true,
            },
        });

        const myFollowersCompte = myFollowers
            .filter(follow => follow.followed?.etat === 'active')
            .map(follow => follow.followedId);

        const myFollowersTailleur = await prisma.tailleur.findMany({
            where: {
                compteId: { in: myFollowersCompte },
            },
        });

        const myFollowersTailleurIds = myFollowersTailleur.map(tailleur => tailleur.id);

        const myFollowersPost = await prisma.post.findMany({
            where: {
                authorId: { in: myFollowersTailleurIds },
            },
        });

        return myFollowersPost;
    }

    async getMyFollowersRecentStatus(compteId: string): Promise<any[]> {
        const now = Date.now();
        const twentyFourHoursInMs = 24 * 60 * 60 * 1000;

        const myFollowers = await prisma.follow.findMany({
            where: {
                followerId: compteId,
            },
            include: {
                followed: true,
            },
        });

        const myFollowersCompte = myFollowers
            .filter(follow => follow.followed?.etat === 'active')
            .map(follow => follow.followedId);

        const myFollowersTailleur = await prisma.tailleur.findMany({
            where: {
                compteId: { in: myFollowersCompte },
            },
        });

        const myFollowersTailleurIds = myFollowersTailleur.map(tailleur => tailleur.id);

        const myFollowersStatus = await prisma.status.findMany({
            where: {
                tailleurId: { in: myFollowersTailleurIds },
            },
        });

        const myFollowersRecentStatus = myFollowersStatus.filter(status => {
            const createdAtMs = new Date(status.createdAt).getTime();
            const differenceInMs = now - createdAtMs;
            return differenceInMs <= twentyFourHoursInMs;
        });

        return myFollowersRecentStatus;
    }

    async createAccount(req: ControllerRequest, res: Response){
        try {
            const newAccount = await prisma.compte.create({
                data: {
                    ...req.body,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            });

            const token = createJWT({ payload: { id: newAccount.id, role: newAccount.role } });

            return res.status(201).json({ account: newAccount, token, status: 'OK' });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 'KO' });
        }
    }

    async getNewsFeed(req: ControllerRequest, res: Response){
        const compteId = req.id;
        const now = Date.now();
        const twentyFourHoursInMs = 24 * 60 * 60 * 1000;

        try {
            const compte = await prisma.compte.findUnique({
                where: { id: compteId },
            });

            if (!compte) {
                return res.status(404).json({ message: 'Compte non trouvé', status: 'KO' });
            }

            if (compte.role === 'tailleur') {
                const oneDayAgo = new Date(Date.now() - twentyFourHoursInMs);

                const tailleur = await prisma.tailleur.findUnique({
                    where: { compteId },
                });

                const myOwnPost = await prisma.post.findMany({
                    where: { authorId: tailleur?.id },
                });

                const myOwnStatus = await prisma.status.findMany({
                    where: { tailleurId: tailleur?.id },
                });

                const myOwnRecentStatus = myOwnStatus.filter(status => {
                    const createdAtMs = new Date(status.createdAt).getTime();
                    const differenceInMs = now - createdAtMs;
                    return differenceInMs <= twentyFourHoursInMs;
                });

                const myFollowersPost = await this.getMyFollowersPost(compteId);
                const posts = myOwnPost.concat(myFollowersPost);

                const myFollowersRecentStatus = await this.getMyFollowersRecentStatus(compteId);
                const recentStatus = myFollowersRecentStatus.concat(myOwnRecentStatus);

                return res.json({ posts, recentStatus, message: 'Fil d\'actualité chargé', status: 'OK' });
            } else {
                const posts = await this.getMyFollowersPost(compteId);
                const recentStatus = await this.getMyFollowersRecentStatus(compteId);
                return res.json({ posts, recentStatus, message: 'Fil d\'actualité chargé', status: 'OK' });
            }
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 'KO' });
        }
    }

    async getAccount(req: ControllerRequest, res: Response){
        try {
            const account = await prisma.compte.findUnique({
                where: { id: req.params.id },
                include: {
                    user: true,
                    comments: true,
                    favorites: true,
                    followers: true,
                    reports: true,
                    notes: true,
                },
            });

            if (!account) {
                return res.status(404).json({ message: 'Compte non trouvé', status: 'KO' });
            }

            return res.status(200).json({ account, status: 'OK' });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 'KO' });
        }
    }

    async getNotificationById(req: ControllerRequest, res: Response){
        try {
            const notification = await prisma.notification.findUnique({
                where: { id: req.params.id },
                include: { post: true },
            });

            if (!notification) {
                return res.status(404).json({ message: 'Notification non trouvée', status: 'KO' });
            }

            return res.status(200).json({ notification, status: 'OK' });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 'KO' });
        }
    }

    async getMessageById(req: ControllerRequest, res: Response){
        try {
            const message = await prisma.message.findUnique({
                where: { id: req.params.id },
                include: { sender: true },
            });

            if (!message) {
                return res.status(404).json({ message: 'Message non trouvé', status: 'KO' });
            }

            return res.status(200).json({ message, status: 'OK' });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 'KO' });
        }
    }

    async getFavoriteById(req: ControllerRequest, res: Response){
        try {
            const favorite = await prisma.favorite.findUnique({
                where: { id: req.params.id },
                include: { post: true },
            });

            if (!favorite) {
                return res.status(404).json({ message: 'Favori non trouvé', status: 'KO' });
            }

            return res.status(200).json({ favorite, status: 'OK' });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 'KO' });
        }
    }

    async listFavorites(req: ControllerRequest, res: Response){
        try {
            const favorites = await prisma.favorite.findMany({
                where: { compteId: req.user.id },
                include: { post: true },
            });

            return res.status(200).json({ favorites, status: 'OK' });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 'KO' });
        }
    }

    async addFavorite(req: ControllerRequest, res: Response){
        try {
            const { postId } = req.body;
            const compteId = req.user.id;

            const newFavorite = await prisma.favorite.create({
                data: {
                    postId,
                    compteId,
                    createdAt: new Date(),
                },
            });

            return res.status(201).json({ favorite: newFavorite, status: 'OK' });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 'KO' });
        }
    }

    async getAllFavorites(req: ControllerRequest, res: Response){
        try {
            const id = req.id;

            // Validate ID
            if (!id || !prisma.$id(id)) {
                return res.status(400).json({ message: 'ID utilisateur invalide' });
            }

            const user = await prisma.compte.findUnique({
                where: { id },
            });

            if (!user) {
                return res.status(404).json({ message: 'Utilisateur non trouvé' });
            }

            const favorites = await prisma.favorite.findMany({
                where: { compteId: user.id },
            });

            return res.status(200).json(favorites);
        } catch (error) {
            return res.status(500).json({
                message: 'Erreur lors de la récupération des favoris',
                status: 'KO',
                error: error.message,
            });
        }
    }

    async deleteFavorite(req: ControllerRequest, res: Response) {
        try {
            const { favorite_id } = req.body;
            const compte_id = req.id;

            if (!compte_id || !favorite_id) {
                return res.status(400).json({ message: 'ID du compte ou ID du favori invalide' });
            }

            const result = await prisma.favorite.deleteMany({
                where: {
                    compte_id,
                    id: favorite_id
                }
            });

            if (result.count === 0) {
                return res.status(404).json({ message: 'Favori non trouvé ou déjà supprimé' });
            }

            return res.status(200).json({ message: 'Favori supprimé avec succès' });
        } catch (error) {
            return res.status(500).json({
                message: 'Erreur lors de la suppression du favori',
                status: 'KO',
                error: error.message
            });
        }
    }

    // Signaler un compte
    async signaler(req: ControllerRequest, res: Response) {
        try {
            const { id, motif } = req.body;

            if (!id) {
                return res.status(400).json({ message: 'ID utilisateur invalide' });
            }

            const compte = await prisma.compte.findUnique({ where: { id } });
            if (!compte) {
                return res.status(404).json({ message: 'Compte non trouvé' });
            }

            const rapport = await prisma.report.create({
                data: {
                    compteId: id,
                    motif,
                    userId: req.id,
                }
            });

            return res.status(201).json({ message: 'Compte signalé avec succès', rapport });
        } catch (error) {
            return res.status(500).json({
                message: 'Erreur lors du signalement du compte',
                status: 'KO',
                error: error.message
            });
        }
    }

    // Afficher le profil client
    async showClientProfile(req: ControllerRequest, res: Response) {
        try {
            const idUser = req.id;

            const compte = await prisma.compte.findUnique({ where: { id: idUser } });
            if (!compte) {
                return res.status(404).json({ message: 'Compte non trouvé', status: 'KO' });
            }

            const user = await prisma.user.findUnique({ where: { id: compte.userId } });
            if (!user) {
                return res.status(404).json({ message: 'Utilisateur non trouvé', status: 'KO' });
            }

            let posts = [];

            if (compte.role === 'tailleur') {
                const tailleur = await prisma.tailleur.findUnique({ where: { compteId: compte.id } });
                if (tailleur) {
                    posts = await prisma.post.findMany({
                        where: { id: { in: tailleur.postIds } }
                    });
                } else {
                    throw new Error('Tailleur non trouvé');
                }
            } else if (compte.role === 'client') {
                const client = await prisma.client.findUnique({ where: { compteId: compte.id } });
                if (client && client.followClientIds.length > 0) {
                    const followClients = await prisma.followClient.findMany({
                        where: { clientId: client.id }
                    });
                    const followedClientIds = followClients.map(follow => follow.followedClientId);

                    const tailleurs = await prisma.tailleur.findMany({
                        where: { compteId: { in: followedClientIds } }
                    });
                    const activeTailleurIds = [];

                    for (const tailleur of tailleurs) {
                        const compteSuivi = await prisma.compte.findUnique({ where: { id: tailleur.compteId } });
                        if (compteSuivi && compteSuivi.etat === 'active') {
                            activeTailleurIds.push(tailleur.id);
                        }
                    }

                    posts = await prisma.post.findMany({
                        where: { authorId: { in: activeTailleurIds } }
                    });
                }
            } else {
                throw new Error('Role inconnu');
            }

            res.status(200).json({
                compte: { role: compte.role, etat: compte.etat },
                user: {
                    lastname: user.lastname,
                    firstname: user.firstname,
                    city: user.city,
                    picture: user.picture,
                },
                posts,
                role: compte.role
            });
        } catch (error) {
            console.error('Error fetching client profile:', error);
            res.status(500).json({ message: 'Erreur interne du serveur', status: 'KO' });
        }
    }

    // Récupérer tous les messages d'un client
    async getAllMessages(req: ControllerRequest, res: Response) {
        try {
            const clientId = req.params.clientId || req.body.clientId || req.id;

            if (!clientId) {
                return res.status(400).json({ message: 'ID du client invalide', status: 'KO' });
            }

            const messages = await prisma.message.findMany({
                where: {
                    OR: [
                        { senderId: clientId },
                        { receiverId: clientId }
                    ]
                },
                include: {
                    sender: true,
                    receiver: true
                }
            });

            if (messages.length === 0) {
                return res.status(404).json({ message: 'Aucun message trouvé', status: 'KO' });
            }

            res.status(200).json({ messages, status: 'OK' });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 'KO' });
        }
    }

    // Envoyer un nouveau message
    async sendMessage(req: ControllerRequest, res: Response) {
        try {
            const senderId = req.params.senderId || req.body.senderId || req.id;
            const receiverId = req.params.receiverId || req.body.receiverId || req.id;
            const texte = req.params.texte || req.body.texte;

            if (!senderId || !receiverId) {
                return res.status(400).json({ message: 'ID de l’expéditeur ou du destinataire invalide', status: 'KO' });
            }

            const newMessage = await prisma.message.create({
                data: {
                    texte,
                    senderId,
                    receiverId,
                    createdAt: new Date()
                }
            });

            res.status(201).json({ message: 'Message envoyé avec succès', data: newMessage, status: 'OK' });
        } catch (err) {
            console.error('Erreur lors de l\'envoi du message:', err);
            return res.status(500).json({ message: err.message, status: 'KO' });
        }
    }

    // Ajouter un like
    async addLike(req: ControllerRequest, res: Response) {
        try {
            const { postId, compteId } = req.body;

            const existingLike = await prisma.like.findFirst({
                where: { postId, compteId }
            });

            if (existingLike) {
                if (existingLike.etat === 'like') {
                    return res.status(400).json({ message: 'Le like est déjà enregistré', status: 'KO' });
                } else {
                    await prisma.like.update({
                        where: { id: existingLike.id },
                        data: { etat: 'like', updatedAt: new Date() }
                    });

                    await prisma.post.update({
                        where: { id: postId },
                        data: { likeCount: { increment: 1 }, dislikeCount: { decrement: 1 } }
                    });

                    return res.status(200).json({
                        message: 'État changé de dislike à like',
                        data: existingLike,
                        status: 'OK'
                    });
                }
            }

            const newLike = await prisma.like.create({
                data: {
                    postId,
                    compteId,
                    etat: 'like',
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            });

            await prisma.post.update({
                where: { id: postId },
                data: { likeCount: { increment: 1 } }
            });

            res.status(201).json({ message: 'Like ajouté avec succès', data: newLike, status: 'OK' });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 'KO' });
        }
    }

    // Ajouter un dislike
    async addDislike(req: ControllerRequest, res: Response) {
        try {
            const { postId, compteId } = req.body;

            const existingLike = await prisma.like.findFirst({
                where: { postId, compteId }
            });

            if (existingLike) {
                if (existingLike.etat === 'dislike') {
                    return res.status(400).json({ message: 'Le dislike est déjà enregistré', status: 'KO' });
                } else {
                    await prisma.like.update({
                        where: { id: existingLike.id },
                        data: { etat: 'dislike', updatedAt: new Date() }
                    });

                    await prisma.post.update({
                        where: { id: postId },
                        data: { dislikeCount: { increment: 1 }, likeCount: { decrement: 1 } }
                    });

                    return res.status(200).json({
                        message: 'État changé de like à dislike',
                        data: existingLike,
                        status: 'OK'
                    });
                }
            }

            const newDislike = await prisma.like.create({
                data: {
                    postId,
                    compteId,
                    etat: 'dislike',
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            });

            await prisma.post.update({
                where: { id: postId },
                data: { dislikeCount: { increment: 1 } }
            });

            res.status(201).json({ message: 'Dislike ajouté avec succès', data: newDislike, status: 'OK' });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 'KO' });
        }
    }

    // Supprimer un like ou dislike
    async removeLikeOrDislike(req: ControllerRequest, res: Response) {
        try {
            const { postId, compteId, etat } = req.body;

            if (!['like', 'dislike'].includes(etat)) {
                return res.status(400).json({ message: 'État invalide', status: 'KO' });
            }

            const result = await prisma.like.deleteMany({
                where: { postId, compteId, etat }
            });

            if (result.count === 0) {
                return res.status(404).json({
                    message: `${etat.charAt(0).toUpperCase() + etat.slice(1)} non trouvé`,
                    status: 'KO'
                });
            }

            const stateUpdate = {};
            stateUpdate[`${etat}Count`] = -1;
            await prisma.post.update({
                where: { id: postId },
                data: stateUpdate
            });

            res.status(200).json({
                message: `${etat.charAt(0).toUpperCase() + etat.slice(1)} supprimé avec succès`,
                status: 'OK'
            });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 'KO' });
        }
    }

    // Afficher le profil de l'utilisateur
    async userProfile(req: ControllerRequest, res: Response) {
        try {
            const id = req.id;

            const compte = await prisma.compte.findUnique({ where: { id } });
            if (!compte) {
                return res.status(404).json({ message: 'Utilisateur non trouvé', status: 'KO' });
            }

            return res.json({ compte, message: 'Le profil de l\'utilisateur', status: 'OK' });
        } catch (error) {
            return res.status(500).json({ message: 'Erreur interne du serveur', status: 'KO' });
        }
    }

    // Rechercher dans l'accueil
    async accueilSearch(req: ControllerRequest, res: Response) {
        try {
            const { searchText } = req.body;
            const regex = new RegExp(searchText, 'i');

            const users = await prisma.user.findMany({
                where: {
                    OR: [
                        { lastname: { contains: searchText, mode: 'insensitive' } },
                        { firstname: { contains: searchText, mode: 'insensitive' } }
                    ]
                }
            });

            const userIds = users.map(user => user.id);

            const comptes = await prisma.compte.findMany({
                where: {
                    OR: [
                        { userId: { in: userIds } },
                        { identifiant: { contains: searchText, mode: 'insensitive' } }
                    ],
                    etat: 'active'
                }
            });

            const posts = await prisma.post.findMany({
                where: {
                    OR: [
                        { content: { contains: searchText, mode: 'insensitive' } },
                        { title: { contains: searchText, mode: 'insensitive' } }
                    ]
                }
            });

            return res.json({ comptes, posts, message: 'Résultats de la recherche', status: 'OK' });
        } catch (error) {
            return res.status(500).json({ message: 'Erreur lors de la recherche', status: 'KO' });
        }
    }

    async ajoutComment(req: ControllerRequest, res: Response) {
        const { content, idPost } = req.body;
        const idCompte = req.id;

        // Valider le content ici

        const newComment = await prisma.comment.create({
            data: {
                content,
                compteId: idCompte,
                postId: idPost,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });

        const post = await prisma.post.update({
            where: { id: idPost },
            data: {
                commentIds: { push: newComment.id },
                updatedAt: new Date(),
            },
        });

        if (!post) {
            return res.status(404).json({ message: 'Post non trouvé', status: 'KO' });
        }

        return res.json({ comment: newComment, message: 'Commentaire ajouté', status: 'OK' });
    }

    async reponseComment(req: ControllerRequest, res: Response) {
        const { content, idComment } = req.body;
        const idCompte = req.id;

        const newCommentResponse = await prisma.commentResponse.create({
            data: {
                texte: content,
                compteId: idCompte,
                commentId: idComment,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });

        const comment = await prisma.comment.update({
            where: { id: idComment },
            data: {
                commentResponseIds: { push: newCommentResponse.id },
                updatedAt: new Date(),
            },
        });

        if (!comment) {
            return res.status(404).json({ message: 'Commentaire non trouvé', status: 'KO' });
        }

        return res.json({ commentResponse: newCommentResponse, message: 'Réponse ajoutée', status: 'OK' });
    }

    async deleteComment(req: ControllerRequest, res: Response) {
        const { idComment } = req.body;
        const idCompte = req.id;

        const commentDelete = await prisma.comment.delete({
            where: { id: idComment },
        });

        if (!commentDelete) {
            return res.status(500).json({ message: 'Commentaire non trouvé', status: 'KO' });
        }

        return res.json({ message: 'Commentaire supprimé', status: 'OK' });
    }

    async deleteResponseComment(req: ControllerRequest, res: Response) {
        const { idCommentResponse } = req.body;

        const commentResponse = await prisma.commentResponse.delete({
            where: { id: idCommentResponse },
        });

        if (!commentResponse) {
            return res.status(404).json({ message: 'Réponse de commentaire non trouvée', status: 'KO' });
        }

        return res.json({ message: 'Réponse de commentaire supprimée', status: 'OK' });
    }

    async ShareNb(req: ControllerRequest, res: Response) {
        try {
            const { postId } = req.body;

            const post = await prisma.post.update({
                where: { id: postId },
                data: { shareNb: { increment: 1 } },
                select: { shareNb: true },
            });

            if (!post) {
                return res.status(404).json({ message: 'Post non trouvé après mise à jour', status: 'KO' });
            }

            return res.status(200).json({ message: 'Partage réussi.', data: { shareNb: post.shareNb }, status: 'OK' });
        } catch (error) {
            return res.status(500).json({ message: 'Erreur lors du partage.', error: error.message, status: 'KO' });
        }
    }

    async ViewsNb(req: ControllerRequest, res: Response) {
        try {
            const { postId } = req.body;

            const post = await prisma.post.update({
                where: { id: postId },
                data: { viewsNb: { increment: 1 } },
                select: { viewsNb: true },
            });

            if (!post) {
                return res.status(404).json({ message: 'Post non trouvé après mise à jour', status: 'KO' });
            }

            return res.json({ message: 'Post Vu', status: 'OK' });
        } catch (error) {
            return res.status(500).json({ message: error.message, status: 'KO' });
        }
    }

    async createCommande(req: ControllerRequest, res: Response) {
        try {
            const { tissuPostId, clientId } = req.body;

            const newCommande = await prisma.commande.create({
                data: {
                    tissupostId: tissuPostId,
                    clientId,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            });

            return res.status(201).json({ message: 'Commande créée avec succès', commande: newCommande, status: 'OK' });
        } catch (error) {
            return res.status(500).json({ message: error.message, status: 'KO' });
        }
    }

    async follow(req: ControllerRequest, res: Response) {
        const { idFollowedCompte } = req.body;
        const idCompte = req.id;

        const follow = await prisma.follow.create({
            data: {
                followedId: idFollowedCompte,
                followerId: idCompte,
            },
        });

        if (!follow) {
            return res.status(500).json({ message: 'Le follow a échoué', status: 'KO' });
        }

        await prisma.compte.update({
            where: { id: idFollowedCompte },
            data: {
                followerIds: { push: follow.id },
                updatedAt: new Date(),
            },
        });

        await prisma.compte.update({
            where: { id: idCompte },
            data: {
                followerIds: { push: follow.id },
                updatedAt: new Date(),
            },
        });

        return res.json({ message: "Vous avez suivi l'utilisateur", status: 'OK' });
    }

    async addMeasure(req: ControllerRequest, res: Response) {
        try {
            const { Epaule, Manche, Longueur, Poitrine, Fesse, Taille, Cou } = req.body;
            const idCompte = req.user?.id;

            const newMeasure = await prisma.measure.create({
                data: {
                    Epaule,
                    Manche,
                    Longueur,
                    Poitrine,
                    Fesse,
                    Taille,
                    Cou,
                    compteId: idCompte,
                },
            });

            await prisma.client.update({
                where: { compteId: idCompte },
                data: { measureIds: { push: newMeasure.id } },
            });

            res.status(201).json({ message: 'Measure added successfully', measure: newMeasure });
        } catch (error) {
            res.status(500).json({ message: 'Error adding measure', error: error.message });
        }
    }

    async addNote(req: ControllerRequest, res: Response) {
        try {
            const { whoNoteId, notedId, rating } = req.body;

            const note = await prisma.note.create({
                data: {
                    whoNoteId,
                    notedId,
                    rating,
                },
            });

            return res.status(201).json({ message: 'Note ajoutée avec succès.', note });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async getNotificationsForUser(req: ControllerRequest, res: Response) {
        const userId = req.id;

        try {
            const notifications = await prisma.notification.findMany({
                where: { compteId: userId },
            });

            return res.status(200).json({ notifications, message: 'Notifications chargées.', status: 'OK' });
        } catch (error) {
            return res.status(500).json({ message: error.message, status: 'KO' });
        }
    }

    async getClientMeasures(req: ControllerRequest, res: Response) {
        try {
            const userId = req.id;

            const measures = await prisma.measure.findMany({
                where: { compteId: userId },
            });

            if (!measures.length) {
                return res.status(404).json({ message: 'Aucune mesure trouvée pour ce client', status: 'KO' });
            }

            return res.status(200).json(measures);
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 'KO' });
        }
    }

    async getPostById(req: ControllerRequest, res: Response) {
        try {
            const postId = req.params.id;

            const post = await prisma.post.findUnique({
                where: { id: postId },
                include: { author: true },
            });

            if (!post) {
                return res.status(404).json({ message: 'Post non trouvé', status: 'KO' });
            }

            return res.status(200).json({ post, status: 'OK' });
        } catch (err) {
            return res.status(500).json({ message: 'Erreur interne du serveur', status: 'KO' });
        }
    }

    async getSomeProfile(req: ControllerRequest, res: Response) {
        const { identifiant } = req.params;
        const idCompte = req.id;

        const compte = await prisma.compte.findUnique({
            where: { identifiant },
        });

        const user = await prisma.user.findUnique({
            where: { id: compte?.userId },
        });

        if (compte?.role === 'tailleur') {
            const tailleur = await prisma.tailleur.findUnique({
                where: { compteId: idCompte },
            });

            if (!tailleur || !user || !compte) {
                return res.status(404).json({ message: 'Impossible de charger le profile demandé', status: 'KO' });
            }

            return res.json({ tailleur, user, compte, status: 'OK' });
        }

        const client = await prisma.client.findUnique({
            where: { compteId: idCompte },
        });

        if (!client || !user || !compte) {
            return res.status(404).json({ message: 'Impossible de charger le profile demandé', status: 'KO' });
        }

        return res.json({ client, user, compte, status: 'OK' });
    }
}
//
export default new ClientController();