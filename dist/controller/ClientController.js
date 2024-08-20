import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
const prisma = new PrismaClient();
class ClientController {
    constructor() {
    }
    async showClientProfile(req, res) {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: 'Token manquant', status: 'KO' });
            }
            const secretKey = process.env.JWT_SECRET || 'your-secret-key';
            let decoded;
            try {
                decoded = jwt.verify(token, secretKey);
                console.log("Decoded token:", decoded);
            }
            catch (error) {
                console.error('Erreur de décodage du jeton:', error);
                return res.status(401).json({ message: 'Token invalide', status: 'KO' });
            }
            if (!decoded || !decoded.id) {
                console.error('ID utilisateur manquant dans le jeton');
                return res.status(400).json({ message: 'ID utilisateur manquant', status: 'KO' });
            }
            const idUser = decoded.id;
            console.log(`Fetching profile for user ID: ${idUser}`);
            const compte = await prisma.compte.findUnique({
                where: { id: idUser },
                include: { user: true, followers: true, followeds: true }
            });
            console.log(compte);
            if (!compte) {
                return res.status(404).json({ message: 'Compte non trouvé', status: 'KO' });
            }
            const user = compte.user;
            if (!user) {
                return res.status(404).json({ message: 'Utilisateur non trouvé', status: 'KO' });
            }
            let posts = [];
            if (compte.role === 'tailleur') {
                let tailleur;
                try {
                    tailleur = await prisma.tailleur.findUnique({ where: { compte_id: compte.id } });
                    if (!tailleur) {
                        return res.status(404).json({ message: 'Tailleur non trouvé', status: 'KO' });
                    }
                    posts = await prisma.post.findMany({
                        where: { tailleur_id: tailleur.id }
                    });
                }
                catch (error) {
                    console.error('Erreur lors de la recherche du tailleur:', error);
                    return res.status(500).json({ message: 'Erreur lors de la recherche du tailleur', status: 'KO' });
                }
            }
            else if (compte.role === 'client') {
                console.log("role", compte.role);
                const client = await prisma.client.findUnique({
                    where: { compte_id: compte.id },
                    include: { followClients: true }
                });
                if (client && client.followClients.length > 0) {
                    const followClients = client.followClients;
                    const followedClientIds = followClients.map(follow => follow.followed_id);
                    const tailleurs = await prisma.tailleur.findMany({
                        where: { compte_id: { in: followedClientIds } },
                        include: { compte: true }
                    });
                    const activeTailleurIds = tailleurs
                        .filter(tailleur => tailleur.compte.etat === 'actif')
                        .map(tailleur => tailleur.id);
                    posts = await prisma.post.findMany({
                        where: { tailleur_id: { in: activeTailleurIds } }
                    });
                }
            }
            else {
                return res.status(400).json({ message: 'Role inconnu', status: 'KO' });
            }
            res.status(200).json({
                compte: { role: compte.role, etat: compte.etat, followers: compte.followers, followeds: compte.followeds },
                user: {
                    lastname: user.lastname,
                    firstname: user.firstname,
                    city: user.city,
                    picture: user.picture,
                },
                posts,
                role: compte.role
            });
        }
        catch (error) {
            console.error('Error fetching client profile:', error);
            res.status(500).json({ message: 'Erreur interne du serveur', status: 'KO' });
        }
    }
    async addLike(req, res) {
        try {
            const postId = parseInt(req.body.postId);
            const compteId = parseInt(req.body.compteId);
            const existingLike = await prisma.like.findFirst({
                where: { post_id: postId, compte_id: compteId }
            });
            if (existingLike) {
                if (existingLike.etat === 'LIKE') {
                    await prisma.like.delete({
                        where: { id: existingLike.id }
                    });
                    return res.status(200).json({
                        message: 'Like supprimé avec succès',
                        status: 'OK'
                    });
                }
                else if (existingLike.etat === 'DISLIKE') {
                    const updatedLike = await prisma.like.update({
                        where: { id: existingLike.id },
                        data: { etat: 'LIKE', updatedAt: new Date() }
                    });
                    return res.status(200).json({
                        message: 'État changé de dislike à like',
                        data: updatedLike,
                        status: 'OK'
                    });
                }
            }
            else {
                const newLike = await prisma.like.create({
                    data: {
                        post_id: postId,
                        compte_id: compteId,
                        etat: 'LIKE',
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                });
                return res.status(201).json({ message: 'Like ajouté avec succès', data: newLike, status: 'OK' });
            }
        }
        catch (err) {
            return res.status(500).json({ message: err.message, status: 'KO' });
        }
    }
    async addDislike(req, res) {
        try {
            const postId = parseInt(req.body.postId);
            const compteId = parseInt(req.body.compteId);
            const existingDislike = await prisma.like.findFirst({
                where: { post_id: postId, compte_id: compteId }
            });
            if (existingDislike) {
                if (existingDislike.etat === 'DISLIKE') {
                    await prisma.like.delete({
                        where: { id: existingDislike.id }
                    });
                    return res.status(200).json({
                        message: 'Dislike supprimé avec succès',
                        status: 'OK'
                    });
                }
                else if (existingDislike.etat === 'LIKE') {
                    await prisma.like.update({
                        where: { id: existingDislike.id },
                        data: { etat: 'DISLIKE', updatedAt: new Date() }
                    });
                    return res.status(200).json({
                        message: 'État changé de like à dislike',
                        data: existingDislike,
                        status: 'OK'
                    });
                }
            }
            else {
                const newDislike = await prisma.like.create({
                    data: {
                        post_id: postId,
                        compte_id: compteId,
                        etat: 'DISLIKE',
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                });
                return res.status(201).json({ message: 'Dislike ajouté avec succès', data: newDislike, status: 'OK' });
            }
        }
        catch (err) {
            return res.status(500).json({ message: err.message, status: 'KO' });
        }
    }
    async userProfile(req, res) {
        try {
            if (!req.body || typeof req.body !== 'object') {
                return res.status(400).json({ message: 'Corps de requête invalide', status: 'KO' });
            }
            const { id } = req.body;
            if (!id || typeof id !== 'string') {
                return res.status(400).json({ message: 'ID utilisateur invalide', status: 'KO' });
            }
            const userId = parseInt(id, 10);
            if (isNaN(userId)) {
                return res.status(400).json({ message: 'ID utilisateur doit être un nombre', status: 'KO' });
            }
            const compte = await prisma.compte.findUnique({
                where: { id: userId },
                include: { user: true }
            });
            if (!compte) {
                return res.status(404).json({ message: 'Utilisateur non trouvé', status: 'KO' });
            }
            return res.json({
                compte: {
                    id: compte.id,
                    email: compte.email,
                    role: compte.role,
                    etat: compte.etat,
                    user: compte.user ? {
                        lastname: compte.user.lastname,
                        firstname: compte.user.firstname,
                        city: compte.user.city,
                        picture: compte.user.picture
                    } : null
                },
                message: 'Profil de l\'utilisateur récupéré avec succès',
                status: 'OK'
            });
        }
        catch (error) {
            console.error('Erreur lors de la récupération du profil utilisateur:', error);
            return res.status(500).json({ message: 'Erreur interne du serveur', status: 'KO' });
        }
    }
    async getNotificationsForUser(req, res) {
        const userId = req.id;
        try {
            const notifications = await prisma.notification.findMany({
                where: { compte_id: userId },
            });
            return res.status(200).json({ notifications, message: 'Notifications chargées.', status: 'OK' });
        }
        catch (error) {
            return res.status(500).json({ message: error.message, status: 'KO' });
        }
    }
    async sendMessage(req, res) {
        try {
            const { messaged_id, texte } = req.body;
            const messager_id = parseInt(req.id);
            console.log(typeof (messager_id));
            console.log((messaged_id));
            console.log((texte));
            const messaged_id1 = parseInt(messaged_id);
            if (typeof messager_id !== 'number' || typeof messaged_id1 !== 'number' || typeof texte !== 'string') {
                return res.status(400).json({ message: 'Les champs messager_id, messaged_id et texte sont requis et doivent être du bon type.', status: 'KO' });
            }
            const newMessage = await prisma.message.create({
                data: {
                    messager_id,
                    messaged_id: messaged_id1,
                    texte,
                },
            });
            console.log(newMessage);
            res.status(201).json({ message: 'Message envoyé', status: newMessage });
        }
        catch (error) {
            console.error('Erreur lors de l\'envoi du message:', error);
            res.status(500).json({ message: error.message, status: 'KO' });
        }
    }
    async blockCompte(req, res) {
        try {
            const { blocked_id } = req.body;
            const blocker_id = parseInt(req.id);
            console.log((blocker_id));
            const compte_id1 = parseInt(blocked_id);
            if (typeof blocker_id !== 'number' || typeof compte_id1 !== 'number') {
                return res.status(400).json({ message: 'Les champs id et compte_id sont requis et doivent être du bon type.', status: 'KO' });
            }
            const newBloque = await prisma.bloquer.create({
                data: {
                    blocked_id: compte_id1,
                    blocker_id
                },
            });
            res.status(200).json({ message: 'compte bloque avec succes', status: newBloque });
        }
        catch (e) {
            console.error('Erreur lors de la bloquage du compte:', e);
            res.status(500).json({ message: e.message, status: 'KO' });
        }
    }
}
export default new ClientController();
