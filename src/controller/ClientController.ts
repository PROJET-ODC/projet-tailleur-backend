
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { createJWT } from '../utils/jwt.js';
import {ControllerRequest} from "../interface/Interface.js";

const prisma = new PrismaClient();
class ClientController {
    constructor() {
    }
   

    // Afficher le profil de l'utilisateur
    async userProfile(req: ControllerRequest, res: Response) {
        try {
            // const id = req.id;
            const id = parseInt(req.id as string, 10);

            const compte = await prisma.compte.findUnique({ where: { id } });
            if (!compte) {
                return res.status(404).json({ message: 'Utilisateur non trouvé', status: 'KO' });
            }

            return res.json({ compte, message: 'Le profil de l\'utilisateur', status: 'OK' });
        } catch (error) {
            return res.status(500).json({ message: 'Erreur interne du serveur', status: 'KO' });
        }
    }

    async accueilSearch(req: ControllerRequest, res: Response) {
        try {
            const { searchText } = req.body;
            const regex = new RegExp(searchText, 'i');
    
            // Rechercher des utilisateurs par prénom ou nom de famille
            const users = await prisma.user.findMany({
                where: {
                    OR: [
                        { lastname: { contains: searchText } }, // Supprimer 'mode: insensitive' si non supporté
                        { firstname: { contains: searchText } } // Supprimer 'mode: insensitive' si non supporté
                    ]
                }
            });
    
            const userIds = users.map(user => user.id);
    
            // Rechercher des comptes par identifiant ou par l'ID utilisateur
            const comptes = await prisma.compte.findMany({
                where: {
                    OR: [
                        { user_id: { in: userIds } }, // Remplacer 'userId' par 'user_id' si c'est ainsi que le champ est nommé
                        { identifiant: { contains: searchText } } // Supprimer 'mode: insensitive' si non supporté
                    ],
                    etat: 'active'
                }
            });
    
            // Rechercher des posts par titre ou contenu
            const posts = await prisma.post.findMany({
                where: {
                    OR: [
                        { content: { contains: searchText } }, // Supprimer 'mode: insensitive' si non supporté
                        { title: { contains: searchText } } // Supprimer 'mode: insensitive' si non supporté
                    ]
                }
            });
    
            return res.json({ comptes, posts, message: 'Résultats de la recherche', status: 'OK' });
        } catch (error) {
            return res.status(500).json({ message: 'Erreur lors de la recherche', status: 'KO' });
        }
    }
    
    async follow(req: ControllerRequest, res: Response) {
        try {
            const { idFollowedCompte } = req.body;
            const idCompte = req.id ? parseInt(req.id, 10) : undefined;
    
            if (idCompte === undefined) {
                return res.status(400).json({ message: 'ID de compte invalide', status: 'KO' });
            }
    
            // Create a new follow relationship
            const follow = await prisma.follow.create({
                data: {
                    followed_id: idFollowedCompte,
                    follower_id: idCompte,
                    status: 'FOLLOWED', // Ajout du champ status requis
                },
            });
    
            if (!follow) {
                return res.status(500).json({ message: 'Le follow a échoué', status: 'KO' });
            }
    
            // Update the followed account
            await prisma.compte.update({
                where: { id: idFollowedCompte },
                data: {
                    followeds: {
                        connect: { id: follow.id }
                    },
                    updatedAt: new Date(),
                },
            });
    
            // Update the follower account
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
    
        } catch (error) {
            return res.status(500).json({ message: 'Une erreur est survenue', status: 'KO'});
        }
    }
    
    async getPostById(req: ControllerRequest, res: Response) {
        try {
            const postId = parseInt(req.params.id, 10); // Conversion de l'ID en nombre
    
            const post = await prisma.post.findUnique({
                where: { id: postId },
                include: { tailleur: true }, // Inclusion de la relation 'tailleur' à la place de 'author'
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
        const idCompte = Number(req.id);  // Convert idCompte to a number
    
        if (isNaN(idCompte)) {
            return res.status(400).json({ message: 'ID de compte invalide', status: 'KO' });
        }
    
        try {
            // Fetch the Compte based on identifiant
            const compte = await prisma.compte.findUnique({
                where: { identifiant },
            });
    
            // Fetch the User associated with the Compte
            const user = await prisma.user.findUnique({
                where: { id: compte?.user_id }, // Corrected to user_id
            });
    
            // If the Compte's role is 'tailleur'
            if (compte?.role === 'tailleur') {
                const tailleur = await prisma.tailleur.findUnique({
                    where: { compte_id: idCompte }, // Corrected to compte_id, now a number
                });
    
                // If any of the required entities are not found
                if (!tailleur || !user || !compte) {
                    return res.status(404).json({ message: 'Impossible de charger le profile demandé', status: 'KO' });
                }
    
                // Return the Tailleur's profile
                return res.json({ tailleur, user, compte, status: 'OK' });
            }
    
            // If the Compte's role is not 'tailleur', assume it is a 'client'
            const client = await prisma.client.findUnique({
                where: { compte_id: idCompte }, // Corrected to compte_id, now a number
            });
    
            // If any of the required entities are not found
            if (!client || !user || !compte) {
                return res.status(404).json({ message: 'Impossible de charger le profile demandé', status: 'KO' });
            }
    
            // Return the Client's profile
            return res.json({ client, user, compte, status: 'OK' });
    
        } catch (err) {
            // Handle any errors that occur during the process
            return res.status(500).json({ message: 'Erreur interne du serveur', status: 'KO' });
        }
    }

    async bloquer(req: ControllerRequest, res: Response) {
        try {
            const { userIdToBlock } = req.body;  // L'ID de l'utilisateur à bloquer
            const tailleurId = req.id;  // L'ID de l'utilisateur connecté (doit être un tailleur)
    
            if (!tailleurId) {
                return res.status(401).json({ message: "Utilisateur non authentifié", status: 'KO' });
            }
    
            // Vérifier si le tailleur est connecté
            const tailleur = await prisma.compte.findUnique({
                where: { id: parseInt(tailleurId, 10) },
                // Assuming the role is stored as a string in the 'role' field
                select: { role: true } 
            });
    
            if (!tailleur || tailleur.role !== 'tailleur') {
                return res.status(403).json({
                    message: "Accès refusé. Seuls les tailleurs peuvent bloquer des utilisateurs.",
                    status: 'KO'
                });
            }
    
            // Vérifier si l'utilisateur à bloquer existe
            const userToBlock = await prisma.compte.findUnique({
                where: { id: parseInt(userIdToBlock, 10) }
            });
    
            if (!userToBlock) {
                return res.status(404).json({ message: "Utilisateur à bloquer introuvable.", status: 'KO' });
            }
    
            // Vérifier si le tailleur suit l'utilisateur à bloquer
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
    
            // Créer l'enregistrement de blocage
            const newBloquer = await prisma.bloquer.create({
                data: {
                    blocker_id: parseInt(tailleurId, 10),
                    blocked_id: parseInt(userIdToBlock, 10)
                }
            });
    
            res.status(200).json({ message: "L'utilisateur a été bloqué avec succès.", status: 'OK' });
        } catch (error) {
            console.error('Erreur lors du blocage de l\'utilisateur:', error);
            res.status(500).json({ message: 'Erreur lors du blocage de l\'utilisateur', status: 'KO' });
        }
    }
    
    async getMyFollowersPost(compte: any) {
        let myFollowersTailleur = [];
    
        // Assurez-vous que les modèles `Follow`, `Tailleur`, et `Post` sont importés correctement
        const myFollowers = await prisma.follow.findMany({
            where: {
                follower_id: compte.id,
                followed_id: { in: compte.follower_ids }
            },
            include: {
                followed: true // Inclure le compte suivi dans les résultats
            }
        });
    
        const myFollowersCompte = myFollowers
            .filter((follow: any) => follow.followed.etat === 'active')
            .map((follow: any) => follow.followed);
    
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
    



    


    async getMyFollowersRecentStatus(compte: any) {
        const now = Date.now(); // Date actuelle en millisecondes
        const twentyFourHoursInMs = 24 * 60 * 60 * 1000; // 24 heures en millisecondes
    
        let myFollowersTailleur = [];
    
        // Utilisation correcte de Prisma pour rechercher les followers
        const myFollowers = await prisma.follow.findMany({
            where: {
                follower_id: compte.id,
                followed_id: { in: compte.follower_ids }
            },
            include: {
                followed: true // Inclure le compte suivi dans les résultats
            }
        });
    
        const myFollowersCompte = myFollowers
            .filter((follow: any) => follow.followed.etat === 'active')
            .map((follow: any) => follow.followed);
    
        for (let i = 0; i < myFollowersCompte.length; i++) {
            const tailleur = await prisma.tailleur.findUnique({
                where: { compte_id: myFollowersCompte[i].id }
            });
            if (tailleur) {
                myFollowersTailleur.push(tailleur);
            }
        }
    
        const myFollowersTailleurIds = myFollowersTailleur.map(objet => objet.id);
    
        // Utilisation correcte de Prisma pour rechercher les statuts
        const myFollowersStatus = await prisma.status.findMany({
            where: {
                tailleur_id: { in: myFollowersTailleurIds }
            }
        });
    
        // Filtrage des statuts récents (moins de 24 heures)
        const myFollowersRecentStatus = myFollowersStatus.filter((status: any) => {
            const createdAtMs = new Date(status.createdAt).getTime(); // Date de création en millisecondes
            const differenceInMs = now - createdAtMs; // Calcul de la différence
            return differenceInMs <= twentyFourHoursInMs; // Vérifier si la différence est inférieure ou égale à 24 heures
        });
    
        return myFollowersRecentStatus;
    }
    
}

export default new ClientController();