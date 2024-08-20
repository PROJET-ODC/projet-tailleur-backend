import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
class ClientController {
    constructor() { }
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
    }
}
export default new ClientController();
