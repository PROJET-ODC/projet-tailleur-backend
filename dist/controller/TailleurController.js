import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
class TailleurController {
    constructor() {
        for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
            const val = this[key];
            if (key !== 'constructor' && typeof val === 'function') {
                this[key] = val.bind(this);
            }
        }
    }
    async acheterCredit(req, res) {
        try {
            let { montant } = req.body;
            const compteId = parseInt(req.id);
            if (typeof parseInt(montant) !== 'number' || montant <= 0) {
                return res.status(400).json({ error: 'Montant invalide' });
            }
            const regleConversion = await prisma.conversionCredit.findFirst({
                orderBy: {
                    createdAt: 'desc',
                },
                take: 1,
            });
            if (!regleConversion) {
                return res.status(500).json({ error: 'Règle de conversion non trouvée' });
            }
            montant = parseInt(montant);
            let c = regleConversion.credit;
            let p = regleConversion.prix.toNumber();
            const credit = (montant * c) / p;
            const compte = await prisma.compte.findUnique({
                where: { id: compteId },
            });
            if (!compte) {
                return res.status(404).json({ error: 'Compte non trouvé' });
            }
            if (compte.role !== 'tailleur') {
                return res.status(403).json({ error: 'Seul un tailleur peut acheter des crédits' });
            }
            const updatedCompte = await prisma.compte.update({
                where: { id: compteId },
                data: { credit: credit + compte.credit },
            });
            return res.status(200).json({ message: 'Crédit ajouté avec succès', compte: updatedCompte });
        }
        catch (error) {
            if (error instanceof Error) {
                console.error('Erreur lors de l\'achat de crédits:', error);
                return res.status(500).json({
                    error: 'Une erreur est survenue lors de l\'achat de crédits',
                    details: error.message
                });
            }
        }
    }
    async getArticleCategories(req, res) {
        try {
            const categories = await prisma.categorie.findMany();
            console.log(categories);
            res.status(200).json(categories);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur lors de la récupération des catégories" });
        }
    }
    async getAllArticles(req, res) {
    }
    async getSomeArticle(req, res) {
    }
    async getAllApprovisions(req, res) {
    }
    async payerResteCommande(req, res) {
    }
    async detailsApprovisions(req, res) {
    }
    async addApprovisions(req, res) {
    }
}
export default new TailleurController();
