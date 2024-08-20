import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
class ClientController {
    async ShareNb(req, res) {
        try {
            const postId = req.id;
            const post = await prisma.post.update({
                where: { id: postId },
                data: { shareNb: { increment: 1 } },
                select: { shareNb: true },
            });
            if (!post) {
                return res.status(404).json({ message: 'Post non trouvé après mise à jour', status: 'KO' });
            }
            return res.status(200).json({ message: 'Partage réussi.', data: { shareNb: post.shareNb }, status: 'OK' });
        }
        catch (error) {
            return res.status(500).json({ message: 'Erreur lors du partage.', error: error.message, status: 'KO' });
        }
    }
    async ViewsNb(req, res) {
        try {
            const postId = req.id;
            const post = await prisma.post.update({
                where: { id: postId },
                data: { viewNb: { increment: 1 } },
                select: { viewNb: true },
            });
            return res.json({ message: 'Post Vu', status: 'OK', post });
        }
        catch (error) {
            if (error.code === 'P2025') {
                return res.status(404).json({ message: 'Post non trouvé', status: 'KO' });
            }
            return res.status(500).json({ message: error.message, status: 'KO' });
        }
    }
    async createCommande(req, res) {
        try {
            const compteId = req.id;
            if (!compteId) {
                return res.status(400).json({ message: 'Utilisateur non authentifié', status: 'KO' });
            }
            const { postId } = req.body;
            if (!postId) {
                return res.status(400).json({ message: 'postId est requis', status: 'KO' });
            }
            const post = await prisma.post.findUnique({
                where: { id: postId }
            });
            if (!post) {
                return res.status(404).json({ message: 'Post non trouvé', status: 'KO' });
            }
            const newCommande = await prisma.commande.create({
                data: {
                    post: {
                        connect: { id: postId }
                    },
                    compte: {
                        connect: { id: compteId }
                    }
                },
            });
            return res.status(201).json({ message: 'Commande créée avec succès', commande: newCommande, status: 'OK' });
        }
        catch (error) {
            console.error('Erreur lors de la création de la commande:', error);
            return res.status(500).json({ message: 'Erreur interne du serveur', status: 'KO' });
        }
    }
}
export default new ClientController();
