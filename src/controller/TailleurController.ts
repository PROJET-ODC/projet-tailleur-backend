// @ts-nocheck
import {v2 as cloudinary} from 'cloudinary';
import fs from "fs";
import {PrismaClient} from '@prisma/client';
import {Response} from 'express';
import {ControllerRequest} from "../interface/Interface";

const prisma = new PrismaClient();

class TailleurController {
  
// // Fonction pour créer un nouveau statut
// async createStatus(req: ControllerRequest, res: Response) {
//     try {
//         const idCompte = req.id;  // L'identifiant du compte est récupéré
//         const tailleur = await prisma.tailleur.findUnique({
//             where: { compte_id: idCompte } // Récupération du tailleur par compteId
//         });

//         if (!tailleur) {
//             return res.status(404).json({ message: "Tailleur non trouvé", status: "KO" });
//         }

//         const { description, categories } = req.body;


//         const newStatus = await prisma.status.create({
//             data: {
//                 files: "image.jpg",                     // Image téléchargée
//                 description: description || 'Model du jour', 
//                 duration: '24',                   // Durée par défaut
//                 viewNb: 0,                        // Initialisation du nombre de vues
//                 tailleur_id: tailleur.id,         // Référence au tailleur
//             },
//         });

//         res.status(201).json({ message: 'Statut créé', status: newStatus });
//     } catch (error) {
//         console.error('Erreur lors de la création du statut:', error);
//         res.status(500).json({ message: error.message, status: 'KO' });
//     }
// }


//     // Function to list active statuses
//     async listStatus(req: ControllerRequest, res: Response) {
//         try {
//             const userId = req.id;
//             const now = new Date();

//             const account = await prisma.compte.findUnique({
//                 where: {id: userId},
//                 include: {follower_ids: true},
//             });

//             if (!account) {
//                 return res.status(404).json({message: 'Compte introuvable', status: 'KO'});
//             }

//             const userType = account.role;
//             let statuses = [];

//             if (userType === 'client') {
//                 const tailleursSuivis = account.follower_ids.map(follower => follower._id);
//                 statuses = await prisma.status.findMany({
//                     where: {tailleurId: {in: tailleursSuivis}},
//                     include: {tailleur: true},
//                 });
//             } else if (userType === 'tailleur') {
//                 const tailleursSuivis = account.follower_ids.map(follower => follower._id);
//                 statuses = await prisma.status.findMany({
//                     where: {
//                         OR: [
//                             {tailleurId: {in: tailleursSuivis}},
//                             {tailleurId: userId},
//                         ],
//                     },
//                     include: {tailleur: true},
//                 });
//             }

//             const activeStatuses = statuses.filter(status => {
//                 const createdAt = new Date(status.createdAt);
//                 const durationInSeconds = status.duration * 60;
//                 const differenceInSeconds = (now.getTime() - createdAt.getTime()) / 1000;

//                 return differenceInSeconds <= durationInSeconds && differenceInSeconds <= 86400;
//             });

//             console.log('Statuts actifs:', activeStatuses);

//             return res.status(200).json({statuses: activeStatuses, status: 'OK'});
//         } catch (err) {
//             return res.status(500).json({message: err.message, status: 'oooKO'});
//         }
//     }

  
}

export default new TailleurController();
