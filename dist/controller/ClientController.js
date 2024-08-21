import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
class ClientController {
    constructor() {
        for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
            const val = this[key];
            if (key !== 'constructor' && typeof val === 'function') {
                this[key] = val.bind(this);
            }
        }
    }
    async getFavoriteById(req, res) {
        try {
            const favorite = await prisma.favori.findUnique({
                where: { id: Number(req.id) },
                include: { post: true },
            });
            if (!favorite) {
                return res.status(404).json({ message: 'Favori non trouvé', status: 'KO' });
            }
            return res.status(200).json({ favorite, status: 'OK' });
        }
        catch (err) {
            return res.status(500).json({ message: err.message, status: 'KO' });
        }
    }
    async listFavorites(req, res) {
        try {
            const favorites = await prisma.favori.findMany({
                where: { compte_id: Number(req.id) },
                include: { post: true },
            });
            return res.status(200).json({ favorites, status: 'OK' });
        }
        catch (err) {
            return res.status(500).json({ message: err.message, status: 'KO' });
        }
    }
    async addFavorite(req, res) {
        try {
            const { post_id } = req.body;
            const compte_id = Number(req.id);
            const newFavorite = await prisma.favori.create({
                data: {
                    post_id,
                    compte_id,
                    createdAt: new Date(),
                },
            });
            return res.status(201).json({ favorite: newFavorite, status: 'OK' });
        }
        catch (err) {
            return res.status(500).json({ message: err.message, status: 'KO' });
        }
    }
    async getAllFavorites(req, res) {
        try {
            const id = req.id;
            if (!id) {
                return res.status(400).json({ message: 'ID utilisateur invalide' });
            }
            const user = await prisma.compte.findUnique({
                where: { id: Number() },
            });
            if (!user) {
                return res.status(404).json({ message: 'Utilisateur non trouvé' });
            }
            const favorites = await prisma.favori.findMany({
                where: { compte_id: user.id },
            });
            return res.status(200).json({ favorites, status: 'OK' });
        }
        catch (error) {
            return res.status(500).json({
                message: 'Erreur lors de la récupération des favoris',
                status: 'KO',
                error: error.message,
            });
        }
    }
    async deleteFavorite(req, res) {
        try {
            const { favorite_id } = req.body;
            const compte_id = Number(req.id);
            console.log(favorite_id);
            if (!compte_id || !favorite_id) {
                return res.status(400).json({ message: 'ID du compte ou ID du favori invalide' });
            }
            const result = await prisma.favori.deleteMany({
                where: {
                    compte_id,
                    id: favorite_id
                }
            });
            if (result.count === 0) {
                return res.status(404).json({ message: 'Favori non trouvé ou déjà supprimé' });
            }
            return res.status(200).json({ message: 'Favori supprimé avec succès', status: 'OK' });
        }
        catch (error) {
            return res.status(500).json({
                message: 'Erreur lors de la suppression du favori',
                status: 'KO',
                error: error.message
            });
        }
    }
    async signaler(req, res) {
        try {
            const { reporter_id, motif } = req.body;
            const compte_id = Number(req.id);
            if (!compte_id) {
                return res.status(400).json({ message: 'ID utilisateur invalide' });
            }
            const compte = await prisma.compte.findUnique({ where: { id: compte_id } });
            if (!compte) {
                return res.status(404).json({ message: 'Compte non trouvé', status: 'KO' });
            }
            const rapport = await prisma.report.create({
                data: {
                    reporter_id: compte_id,
                    reported_id: reporter_id,
                    motif,
                }
            });
            return res.status(201).json({ message: 'Compte signalé avec succès', rapport, status: 'OK' });
        }
        catch (error) {
            return res.status(500).json({
                message: 'Erreur lors du signalement du compte',
                status: 'KO',
                error: error.message
            });
        }
    }
    async ajoutComment(req, res) {
        const { content, post_id } = req.body;
        const idCompte = Number(req.id);
        if (!content || !post_id) {
            return res.status(400).json({ message: 'Données invalides', status: 'KO' });
        }
        try {
            const newComment = await prisma.comment.create({
                data: {
                    content,
                    compte_id: idCompte,
                    post_id,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            });
            const post = await prisma.post.update({
                where: { id: post_id },
                data: {
                    comments: {
                        connect: { id: newComment.id }
                    },
                    updatedAt: new Date(),
                },
            });
            if (!post) {
                return res.status(404).json({ message: 'Post non trouvé', status: 'KO' });
            }
            return res.json({ comment: newComment, message: 'Commentaire ajouté', status: 'OK' });
        }
        catch (error) {
            return res.status(500).json({ message: 'Erreur serveur', status: 'KO' });
        }
    }
    async reponseComment(req, res) {
        const { content, comment_id } = req.body;
        const idCompte = req.id;
        if (!content || !comment_id) {
            return res.status(400).json({ message: 'Données invalides', status: 'KO' });
        }
        try {
            const newCommentResponse = await prisma.commentResponse.create({
                data: {
                    content,
                    comment_id,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            });
            await prisma.comment.update({
                where: { id: comment_id },
                data: {
                    updatedAt: new Date(),
                },
            });
            return res.json({ commentResponse: newCommentResponse, message: 'Réponse ajoutée', status: 'OK' });
        }
        catch (error) {
            return res.status(500).json({ message: 'Erreur serveur', status: 'KO' });
        }
    }
    async deleteComment(req, res) {
        const { comment_id } = req.body;
        const idCompte = req.id;
        try {
            const commentDelete = await prisma.comment.delete({
                where: { id: comment_id },
            });
            if (!commentDelete) {
                return res.status(404).json({ message: 'Commentaire non trouvé', status: 'KO' });
            }
            return res.json({ message: 'Commentaire supprimé', status: 'OK' });
        }
        catch (error) {
            return res.status(500).json({ message: 'Erreur lors de la suppression du commentaire', status: 'KO' });
        }
    }
    async getMyFollowersPost(compteId) {
        const myFollowers = await prisma.follow.findMany({
            where: {
                AND: [
                    { follower_id: compteId },
                    { status: "FOLLOWED" },
                ]
            },
            include: {
                followed: true,
            },
        });
        const myFollowersCompte = myFollowers
            .filter(follow => follow.followed?.etat === 'active')
            .map(follow => follow.followed_id);
        const myFollowersTailleur = await prisma.tailleur.findMany({
            where: {
                compte_id: { in: myFollowersCompte },
            },
        });
        const myFollowersTailleurIds = myFollowersTailleur.map(tailleur => tailleur.id);
        const myFollowersPost = await prisma.post.findMany({
            where: {
                AND: [
                    { tailleur_id: { in: myFollowersTailleurIds } },
                    { status: 'PUBLIE' }
                ]
            },
            include: { tags: true }
        });
        return myFollowersPost;
    }
    async getMyFollowersRecentStatus(compteId) {
        const now = Date.now();
        const twentyFourHoursInMs = 24 * 60 * 60 * 1000;
        const myFollowers = await prisma.follow.findMany({
            where: {
                follower_id: compteId,
            },
            include: {
                followed: true,
            },
        });
        const myFollowersCompte = myFollowers
            .filter(follow => follow.followed?.etat === 'active')
            .map(follow => follow.followed_id);
        const myFollowersTailleur = await prisma.tailleur.findMany({
            where: {
                compte_id: { in: myFollowersCompte },
            },
        });
        const myFollowersTailleurIds = myFollowersTailleur.map(tailleur => tailleur.id);
        const myFollowersStatus = await prisma.status.findMany({
            where: {
                tailleur_id: { in: myFollowersTailleurIds },
            },
        });
        const myFollowersRecentStatus = myFollowersStatus.filter(status => {
            const createdAtMs = new Date(status.createdAt).getTime();
            const differenceInMs = now - createdAtMs;
            return differenceInMs <= twentyFourHoursInMs;
        });
        return myFollowersRecentStatus;
    }
    async getNewsFeed(req, res) {
        const compte_id = parseInt(req.id);
        const now = Date.now();
        const twentyFourHoursInMs = 24 * 60 * 60 * 1000;
        try {
            const compte = await prisma.compte.findUnique({
                where: { id: compte_id },
            });
            if (!compte) {
                return res.status(404).json({ message: 'Compte non trouvé', status: 'KO' });
            }
            if (compte.role === 'tailleur') {
                const oneDayAgo = new Date(Date.now() - twentyFourHoursInMs);
                const tailleur = await prisma.tailleur.findUnique({
                    where: { compte_id },
                });
                const myOwnPost = await prisma.post.findMany({
                    where: {
                        AND: [
                            { tailleur_id: tailleur?.id },
                            { status: 'PUBLIE' }
                        ]
                    },
                    include: { tags: true }
                });
                const myOwnStatus = await prisma.status.findMany({
                    where: { tailleur_id: tailleur?.id },
                });
                const myOwnRecentStatus = myOwnStatus.filter(status => {
                    const createdAtMs = new Date(status.createdAt).getTime();
                    const differenceInMs = now - createdAtMs;
                    return differenceInMs <= twentyFourHoursInMs;
                });
                const myFollowersPost = await this.getMyFollowersPost(compte_id);
                const posts = myOwnPost.concat(myFollowersPost);
                const myFollowersRecentStatus = await this.getMyFollowersRecentStatus(compte_id);
                const recentStatus = myFollowersRecentStatus.concat(myOwnRecentStatus);
                return res.json({ posts, recentStatus, message: 'Fil d\'actualité chargé', status: 'OK' });
            }
            else {
                const posts = await this.getMyFollowersPost(compte_id);
                const recentStatus = await this.getMyFollowersRecentStatus(compte_id);
                return res.json({ posts, recentStatus, message: 'Fil d\'actualité chargé', status: 'OK' });
            }
        }
        catch (err) {
            if (err instanceof Error) {
                return res.status(500).json({ message: err.message, status: 'KO' });
            }
        }
    }
    async userProfile(req, res) {
        try {
            const id = parseInt(req.id, 10);
            const compte = await prisma.compte.findUnique({
                where: { id },
            });
            const user = await prisma.user.findUnique({
                where: { id: compte?.user_id },
            });
            if (compte?.role === 'tailleur') {
                const tailleur = await prisma.tailleur.findUnique({
                    where: { compte_id: id },
                });
                const posts = await prisma.post.findMany({
                    where: {
                        AND: [
                            { tailleur_id: tailleur?.id },
                            { status: 'PUBLIE' }
                        ]
                    },
                });
                if (!tailleur || !user || !compte) {
                    return res.status(404).json({ message: 'Impossible de charger le profile demandé', status: 'KO' });
                }
                return res.json({ tailleur, user, compte, posts, status: 'OK' });
            }
            const client = await prisma.client.findUnique({
                where: { compte_id: id },
            });
            if (!client || !user || !compte) {
                return res.status(404).json({ message: 'Impossible de charger le profile demandé', status: 'KO' });
            }
            const followersPosts = await this.getMyFollowersPost(compte.id);
            return res.json({ client, user, compte, followersPosts, status: 'OK' });
        }
        catch (error) {
            return res.status(500).json({ message: 'Erreur interne du serveur', status: 'KO' });
        }
    }
    async accueilSearch(req, res) {
        try {
            const { searchText } = req.body;
            const regex = new RegExp(searchText, 'i');
            const users = await prisma.user.findMany({
                where: {
                    OR: [
                        { lastname: { contains: searchText } },
                        { firstname: { contains: searchText, } }
                    ]
                }
            });
            const userIds = users.map(user => user.id);
            const comptes = await prisma.compte.findMany({
                where: {
                    OR: [
                        { user_id: { in: userIds } },
                        { identifiant: { contains: searchText } }
                    ],
                    etat: 'active'
                }
            });
            const posts = await prisma.post.findMany({
                where: {
                    OR: [
                        {
                            content: { contains: searchText }
                        },
                        {
                            title: { contains: searchText }
                        },
                        {
                            tags: {
                                some: {
                                    libelle: { contains: searchText }
                                }
                            }
                        }
                    ]
                },
                include: { tags: true }
            });
            return res.json({ comptes, posts, message: 'Résultats de la recherche', status: 'OK' });
        }
        catch (error) {
            return res.status(500).json({ message: 'Erreur lors de la recherche', status: 'KO' });
        }
    }
    async follow(req, res) {
        try {
            const { idFollowedCompte } = req.body;
            const idCompte = req.id ? parseInt(req.id, 10) : undefined;
            if (idCompte === undefined) {
                return res.status(400).json({ message: 'ID de compte invalide', status: 'KO' });
            }
            const follow = await prisma.follow.create({
                data: {
                    followed_id: idFollowedCompte,
                    follower_id: idCompte,
                    status: 'FOLLOWED',
                },
            });
            if (!follow) {
                return res.status(500).json({ message: 'Le follow a échoué', status: 'KO' });
            }
            await prisma.compte.update({
                where: { id: idFollowedCompte },
                data: {
                    followeds: {
                        connect: { id: follow.id }
                    },
                    updatedAt: new Date(),
                },
            });
            await prisma.compte.update({
                where: { id: idCompte },
                data: {
                    followers: {
                        connect: { id: follow.id }
                    },
                    updatedAt: new Date(),
                },
            });
            return res.json({ message: "Vous avez suivi l'utilisateur", status: 'OK' });
        }
        catch (error) {
            return res.status(500).json({ message: 'Une erreur est survenue', status: 'KO' });
        }
    }
    async getPostById(req, res) {
        try {
            const postId = parseInt(req.params.id, 10);
            const post = await prisma.post.findUnique({
                where: { id: postId },
                include: { tailleur: true },
            });
            if (!post) {
                return res.status(404).json({ message: 'Post non trouvé', status: 'KO' });
            }
            return res.status(200).json({ post, status: 'OK' });
        }
        catch (err) {
            return res.status(500).json({ message: 'Erreur interne du serveur', status: 'KO' });
        }
    }
    async deleteResponseComment(req, res) {
        const { idCommentResponse } = req.body;
        try {
            const commentResponse = await prisma.commentResponse.delete({
                where: { id: idCommentResponse },
            });
            if (!commentResponse) {
                return res.status(404).json({ message: 'Réponse de commentaire non trouvée', status: 'KO' });
            }
            return res.json({ message: 'Réponse de commentaire supprimée', status: 'OK' });
        }
        catch (error) {
            return res.status(500).json({ message: 'Erreur lors de la suppression de la réponse de commentaire', status: 'KO' });
        }
        async;
        getSomeProfile(req, ControllerRequest, res, Response);
        {
            const { identifiant } = req.params;
            const idCompte = Number(req.id);
            if (isNaN(idCompte)) {
                return res.status(400).json({ message: 'ID de compte invalide', status: 'KO' });
            }
            try {
                const compte = await prisma.compte.findUnique({
                    where: { identifiant },
                });
                const user = await prisma.user.findUnique({
                    where: { id: compte?.user_id },
                });
                if (compte?.role === 'tailleur') {
                    const tailleur = await prisma.tailleur.findUnique({
                        where: { compte_id: idCompte },
                    });
                    if (!tailleur || !user || !compte) {
                        return res.status(404).json({ message: 'Impossible de charger le profile demandé', status: 'KO' });
                    }
                    return res.json({ tailleur, user, compte, status: 'OK' });
                }
                const client = await prisma.client.findUnique({
                    where: { compte_id: idCompte },
                });
                if (!client || !user || !compte) {
                    return res.status(404).json({ message: 'Impossible de charger le profile demandé', status: 'KO' });
                }
                return res.json({ client, user, compte, status: 'OK' });
            }
            catch (err) {
                return res.status(500).json({ message: 'Erreur interne du serveur', status: 'KO' });
            }
        }
        async;
        bloquer(req, ControllerRequest, res, Response);
        {
            try {
                const { userIdToBlock } = req.body;
                const tailleurId = req.id;
                if (!tailleurId) {
                    return res.status(401).json({ message: "Utilisateur non authentifié", status: 'KO' });
                }
                const tailleur = await prisma.compte.findUnique({
                    where: { id: parseInt(tailleurId, 10) },
                    select: { role: true }
                });
                if (!tailleur || tailleur.role !== 'tailleur') {
                    return res.status(403).json({
                        message: "Accès refusé. Seuls les tailleurs peuvent bloquer des utilisateurs.",
                        status: 'KO'
                    });
                }
                const userToBlock = await prisma.compte.findUnique({
                    where: { id: parseInt(userIdToBlock, 10) }
                });
                if (!userToBlock) {
                    return res.status(404).json({ message: "Utilisateur à bloquer introuvable.", status: 'KO' });
                }
                const isFollowed = await prisma.follow.findFirst({
                    where: {
                        follower_id: parseInt(tailleurId, 10),
                        followed_id: parseInt(userIdToBlock, 10)
                    }
                });
                if (!isFollowed) {
                    return res.status(403).json({
                        message: "Vous ne pouvez bloquer que des utilisateurs que vous suivez.",
                        status: 'KO'
                    });
                }
                const newBloquer = await prisma.bloquer.create({
                    data: {
                        blocker_id: parseInt(tailleurId, 10),
                        blocked_id: parseInt(userIdToBlock, 10)
                    }
                });
                res.status(200).json({ message: "L'utilisateur a été bloqué avec succès.", status: 'OK' });
            }
            catch (error) {
                console.error('Erreur lors du blocage de l\'utilisateur:', error);
                res.status(500).json({ message: 'Erreur lors du blocage de l\'utilisateur', status: 'KO' });
            }
        }
    }
}
export default new ClientController();
