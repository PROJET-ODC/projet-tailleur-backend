import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
class ClientController {
    constructor() {
    }
    async userProfile(req, res) {
        try {
            const id = parseInt(req.id, 10);
            const compte = await prisma.compte.findUnique({ where: { id } });
            if (!compte) {
                return res.status(404).json({ message: 'Utilisateur non trouvé', status: 'KO' });
            }
            return res.json({ compte, message: 'Le profil de l\'utilisateur', status: 'OK' });
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
                        { firstname: { contains: searchText } }
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
                        { content: { contains: searchText } },
                        { title: { contains: searchText } }
                    ]
                }
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
    async getSomeProfile(req, res) {
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
    async bloquer(req, res) {
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
    async getMyFollowersPost(compte) {
        let myFollowersTailleur = [];
        const myFollowers = await prisma.follow.findMany({
            where: {
                follower_id: compte.id,
                followed_id: { in: compte.follower_ids }
            },
            include: {
                followed: true
            }
        });
        const myFollowersCompte = myFollowers
            .filter((follow) => follow.followed.etat === 'active')
            .map((follow) => follow.followed);
        for (let i = 0; i < myFollowersCompte.length; i++) {
            const tailleur = await prisma.tailleur.findUnique({
                where: { compte_id: myFollowersCompte[i].id }
            });
            if (tailleur) {
                myFollowersTailleur.push(tailleur);
            }
        }
        const myFollowersTailleurIds = myFollowersTailleur.map(objet => objet.id);
        const myFollowersPost = await prisma.post.findMany({
            where: {
                tailleur_id: { in: myFollowersTailleurIds }
            }
        });
        return myFollowersPost;
    }
    async getMyFollowersRecentStatus(compte) {
        const now = Date.now();
        const twentyFourHoursInMs = 24 * 60 * 60 * 1000;
        let myFollowersTailleur = [];
        const myFollowers = await prisma.follow.findMany({
            where: {
                follower_id: compte.id,
                followed_id: { in: compte.follower_ids }
            },
            include: {
                followed: true
            }
        });
        const myFollowersCompte = myFollowers
            .filter((follow) => follow.followed.etat === 'active')
            .map((follow) => follow.followed);
        for (let i = 0; i < myFollowersCompte.length; i++) {
            const tailleur = await prisma.tailleur.findUnique({
                where: { compte_id: myFollowersCompte[i].id }
            });
            if (tailleur) {
                myFollowersTailleur.push(tailleur);
            }
        }
        const myFollowersTailleurIds = myFollowersTailleur.map(objet => objet.id);
        const myFollowersStatus = await prisma.status.findMany({
            where: {
                tailleur_id: { in: myFollowersTailleurIds }
            }
        });
        const myFollowersRecentStatus = myFollowersStatus.filter((status) => {
            const createdAtMs = new Date(status.createdAt).getTime();
            const differenceInMs = now - createdAtMs;
            return differenceInMs <= twentyFourHoursInMs;
        });
        return myFollowersRecentStatus;
    }
}
export default new ClientController();
