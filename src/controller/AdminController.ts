import {v2 as cloudinary} from 'cloudinary';
import fs from "fs";
import {ArticleUnite, PrismaClient, Unite} from '@prisma/client';
import Decimal from 'decimal.js';

import {Response} from 'express';
import {ControllerRequest} from "../interface/Interface.js";

const prisma = new PrismaClient();

class adminController{

    constructor() {
        for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
            const val = (this as any)[key];
            if (key !== 'constructor' && typeof val === 'function') {
                (this as any)[key] = val.bind(this);
            }
        }
    }

    async  getPourcentage(req: ControllerRequest, res: Response) {
        try {
            // Extraire l'ID de la commande depuis le corps de la requête
            const { commande_id } = req.body;
    
            if (!commande_id) {
                return res.status(400).json({
                    message: "ID de la commande non fourni",
                    status: "KO"
                });
            }
    
            // Récupérer la commande spécifique
            const commande = await prisma.commandeArticle.findUnique({
                where: { id: commande_id }
            });
    
            if (!commande) {
                return res.status(404).json({
                    message: "Commande non trouvée",
                    status: "KO"
                });
            }
    
            // Calculer le montant à prélever (2% du montant de la commande)
            const montantTotalNumber = parseFloat(commande.montantTotal.toFixed(2));
            const montantAPrelever = (montantTotalNumber * 2) / 100;
    
            // Récupérer les admins
            const admins = await prisma.admin.findMany();
    
            if (admins.length === 0) {
                return res.status(404).json({
                    message: "Aucun admin trouvé",
                    status: "KO"
                });
            }
    
            // Mettre à jour le revenu de chaque admin
            await Promise.all(admins.map(async (admin) => {
                await prisma.admin.update({
                    where: { id: admin.id },
                    data: {
                        revenu: {
                            increment: new Decimal(montantAPrelever).toFixed(2)
                        }
                    }
                });
            }));
    
            return res.json({
                montantAPrelever: montantAPrelever.toFixed(2),
                message: "Montant prélevé et revenus mis à jour avec succès",
                status: "OK"
            });
    
        } catch (err) {
            if (err instanceof Error) {
                console.error("Erreur lors de la mise à jour des revenus:", err.message);
                return res.status(500).json({ message: err.message, status: 'KO' });
            }
        }
    }

}

export default new adminController();