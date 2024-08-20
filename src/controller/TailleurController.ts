import {v2 as cloudinary} from 'cloudinary';
import fs from "fs";
import {PrismaClient} from '@prisma/client';
import {Response} from 'express';
import {ControllerRequest} from "../interface/Interface";

const prisma = new PrismaClient();

class TailleurController {
    constructor() {
        for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
            const val = (this as any)[key];
            if (key !== 'constructor' && typeof val === 'function') {
                (this as any)[key] = val.bind(this);
            }
        }
    }

    async acheterCredit(req: ControllerRequest, res: Response){
        try {
            let {montant} = req.body;
            const compteId = parseInt(req.id!);
            // Validation du montant
            if (typeof parseInt(montant) !== 'number' || montant <= 0) {
                return res.status(400).json({error: 'Montant invalide'});
            }

            // Calculer le crédit
            const regleConversion = await prisma.conversionCredit.findFirst({
                orderBy: {
                    createdAt: 'desc', // Order by createdAt in descending order
                },
                take: 1, // Take the first record (which will be the one with the max date)
            });
            // console.log(regleConversion)
            if (!regleConversion) {
                return res.status(500).json({error: 'Règle de conversion non trouvée'});
            }
            montant = parseInt(montant);
            let c = regleConversion.credit as number;
            let p = regleConversion.prix.toNumber();
            const credit = (montant * c) / p;

            // Trouver le compte
            const compte = await prisma.compte.findUnique({
                where: {id: compteId},
            });

            if (!compte) {
                return res.status(404).json({error: 'Compte non trouvé'});
            }

            // Vérifier si le compte est un "tailleur"
            if (compte.role !== 'tailleur') {
                return res.status(403).json({error: 'Seul un tailleur peut acheter des crédits'});
            }

            // Ajouter le crédit au crédit existant
            const updatedCompte = await prisma.compte.update({
                where: {id: compteId},
                data: {credit: credit + compte.credit},
            });

            // Envoyer la réponse
            return res.status(200).json({message: 'Crédit ajouté avec succès', compte: updatedCompte});
        } catch (error) {
            if(error instanceof Error) {
                console.error('Erreur lors de l\'achat de crédits:', error);
                return res.status(500).json({
                    error: 'Une erreur est survenue lors de l\'achat de crédits',
                    details: error.message
                });
            }

        }
    }

    async getArticleCategories (req: ControllerRequest, res: Response){

    }

    async getAllArticles (req: ControllerRequest, res: Response){

    }

    async getSomeArticle (req: ControllerRequest, res: Response){

    }

    async getAllApprovisions (req: ControllerRequest, res: Response){

    }

    async payerResteCommande (req: ControllerRequest, res: Response){

    }

    async detailsApprovisions (req: ControllerRequest, res: Response){

    }

    async addApprovisions (req: ControllerRequest, res: Response){

    }

}

export default new TailleurController();
