import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { createJWT } from '../utils/jwt.js';
import {ControllerRequest} from "../interface/Interface.js";

const prisma = new PrismaClient();

class ClientController {
    // constructor() {
    //     this.getNewsFeed = this.getNewsFeed.bind(this);
    // }
    
    async ShareNb(req: ControllerRequest, res: Response) {
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
                } catch (error:any) {
                    return res.status(500).json({ message: 'Erreur lors du partage.', error: error.message, status: 'KO' });
                }
    }
    
    async ViewsNb(req: ControllerRequest, res: Response) {
        try {
            const postId = req.id;
    
            const post = await prisma.post.update({
                where: { id: postId },
                data: { viewNb: { increment: 1 } },
                select: { viewNb: true },
            });
    
            return res.json({ message: 'Post Vu', status: 'OK', post });
        } catch (error:any) {
            // Vérifie si l'erreur est liée à l'absence du post
            if (error.code === 'P2025') {
                return res.status(404).json({ message: 'Post non trouvé', status: 'KO' });
            }
            return res.status(500).json({ message: error.message, status: 'KO' });
        }
    }
    async createCommande(req: ControllerRequest, res: Response) {
        try {
            // Récupérer compte_id de l'utilisateur connecté
            const compteId = req.id; // Supposant que l'ID du compte est directement disponible dans req.user
    
            // Vérifier que compteId est bien défini
            if (!compteId) {
                return res.status(400).json({ message: 'Utilisateur non authentifié', status: 'KO' });
            }
    
            // Récupérer les données du body
            const { postId } = req.body;
    
            if (!postId) {
                return res.status(400).json({ message: 'postId est requis', status: 'KO' });
            }
    
            // Vérifier que le post existe
            const post = await prisma.post.findUnique({
                where: { id: postId }
            });
    
            if (!post) {
                return res.status(404).json({ message: 'Post non trouvé', status: 'KO' });
            }
    
            // Créer la commande
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
    
            // Répondre avec succès
            return res.status(201).json({ message: 'Commande créée avec succès', commande: newCommande, status: 'OK' });
        } catch (error:any) {
            // Gestion des erreurs
            console.error('Erreur lors de la création de la commande:', error);
            return res.status(500).json({ message: 'Erreur interne du serveur', status: 'KO' });
        }
    }
    
}

export default new ClientController();