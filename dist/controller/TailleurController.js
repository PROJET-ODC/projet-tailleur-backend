import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
class TailleurController {
    constructor() {
    }
    async listMyAllPosts(req, res) {
        try {
            const { tailleurId } = req.params;
            const account = await prisma.compte.findUnique({
                where: { id: tailleurId },
                include: { user: true },
            });
            if (!account) {
                return res.status(404).json({ message: 'Compte introuvable', status: 'KO' });
            }
            const userType = account.user?.type;
            let statuses = [];
            if (userType === 'client') {
                const tailleursSuivis = account.follower_ids.map(follower => follower._id);
                statuses = await prisma.status.findMany({
                    where: {
                        tailleurId: { in: tailleursSuivis },
                        tailleur: { compte: { isActive: true } },
                    },
                    include: { tailleur: true },
                });
            }
            else if (userType === 'tailleur') {
                const tailleursSuivis = account.follower_ids.map(follower => follower._id);
                statuses = await prisma.status.findMany({
                    where: {
                        OR: [
                            { tailleurId: { in: tailleursSuivis }, tailleur: { compte: { isActive: true } } },
                            { tailleurId: tailleurId },
                        ],
                    },
                    include: { tailleur: true },
                });
            }
            if (statuses.length === 0) {
                return res.status(404).json({ message: 'Aucun post trouvé', status: 'KO' });
            }
            res.status(200).json({ statuses, status: 'OK' });
        }
        catch (err) {
            return res.status(500).json({ message: err.message, status: 'KO' });
        }
    }
    async createStatus(req, res) {
        try {
            const idCompte = req.id;
            const tailleur = await prisma.tailleur.findUnique({ where: { compteId: idCompte } });
            const { description, categories } = req.body;
            const image = await this.uploadProductImage(req, res, "image");
            const newStatus = await prisma.status.create({
                data: {
                    files: image,
                    description: description || 'Model du jour',
                    duration: 24,
                    viewsNb: 0,
                    categories: categories || 'video',
                    tailleurId: tailleur?.id,
                },
            });
            res.status(201).json({ message: 'Statut créé', status: newStatus });
        }
        catch (error) {
            console.error('Erreur lors de la création du statut:', error);
            res.status(500).json({ message: error.message, status: 'KO' });
        }
    }
    async listStatus(req, res) {
        try {
            const userId = req.id;
            const now = new Date();
            const account = await prisma.compte.findUnique({
                where: { id: userId },
                include: { follower_ids: true },
            });
            if (!account) {
                return res.status(404).json({ message: 'Compte introuvable', status: 'KO' });
            }
            const userType = account.role;
            let statuses = [];
            if (userType === 'client') {
                const tailleursSuivis = account.follower_ids.map(follower => follower._id);
                statuses = await prisma.status.findMany({
                    where: { tailleurId: { in: tailleursSuivis } },
                    include: { tailleur: true },
                });
            }
            else if (userType === 'tailleur') {
                const tailleursSuivis = account.follower_ids.map(follower => follower._id);
                statuses = await prisma.status.findMany({
                    where: {
                        OR: [
                            { tailleurId: { in: tailleursSuivis } },
                            { tailleurId: userId },
                        ],
                    },
                    include: { tailleur: true },
                });
            }
            const activeStatuses = statuses.filter(status => {
                const createdAt = new Date(status.createdAt);
                const durationInSeconds = status.duration * 60;
                const differenceInSeconds = (now.getTime() - createdAt.getTime()) / 1000;
                return differenceInSeconds <= durationInSeconds && differenceInSeconds <= 86400;
            });
            console.log('Statuts actifs:', activeStatuses);
            return res.status(200).json({ statuses: activeStatuses, status: 'OK' });
        }
        catch (err) {
            return res.status(500).json({ message: err.message, status: 'oooKO' });
        }
    }
    async createPost(req, res) {
        try {
            const idCompte = req.id;
            const compte = await prisma.compte.findUnique({ where: { id: idCompte } });
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
            const { content, title, image, tissus, useCredit } = req.body;
            if (!content || typeof content !== 'string') {
                return res.status(400).json({ message: "Content must be a non-empty string", status: 'KO' });
            }
            if (!title || typeof title !== 'string') {
                return res.status(400).json({ message: "Title must be a non-empty string", status: 'KO' });
            }
            if (!image || !Array.isArray(image) || image.length === 0) {
                return res.status(400).json({ message: "Image must be a non-empty array", status: 'KO' });
            }
            if (!tissus || !Array.isArray(tissus) || tissus.length === 0) {
                return res.status(400).json({ message: "Tissus must be a non-empty array", status: 'KO' });
            }
            const tailleur = await prisma.tailleur.findUnique({ where: { compte_id: idCompte } });
            if (!tailleur) {
                return res.status(404).json({ message: "Tailleur not found", status: 'KO' });
            }
            const allMyPosts = await prisma.post.findMany({
                where: {
                    author_id: tailleur.id,
                    cout: 0,
                    createdAt: {
                        gte: startOfMonth,
                        lte: endOfMonth
                    }
                }
            });
            if (allMyPosts.length >= 1 || useCredit === true) {
                if (compte.credit >= 2) {
                    compte.credit -= 2;
                    await prisma.compte.update({
                        where: { id: idCompte },
                        data: { credit: compte.credit }
                    });
                    const newPost = await prisma.post.create({
                        data: {
                            content,
                            title,
                            image,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            shareNb: 0,
                            viewsNb: 0,
                            cout: 2,
                            author_id: tailleur.id,
                            tissus: {
                                create: tissus.map(tissu => ({
                                    prixMetre: tissu.prixMetre,
                                    nombreMetre: tissu.nombreMetre,
                                    tissu_id: tissu.tissu_id
                                }))
                            }
                        }
                    });
                    return res.status(201).json({ message: "Post created successfully", status: 'OK', post: newPost });
                }
                else {
                    return res.json({
                        message: "Votre crédit est insuffisant et Vous avez déjà plus d'un post ce mois-ci, Achetez du crédit",
                        status: 'KO'
                    });
                }
            }
            else {
                if (image.length > 1) {
                    return res.json({
                        message: "Vous ne pouvez poster plus de 1 image pour le moment, utilisez vos crédits",
                        status: 'KO'
                    });
                }
                const newPost = await prisma.post.create({
                    data: {
                        content,
                        title,
                        image,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        shareNb: 0,
                        viewsNb: 0,
                        cout: 0,
                        author_id: tailleur.id,
                        tissus: {
                            create: tissus.map(tissu => ({
                                prixMetre: tissu.prixMetre,
                                nombreMetre: tissu.nombreMetre,
                                tissu_id: tissu.tissu_id
                            }))
                        }
                    }
                });
                return res.status(201).json({ message: "Post created successfully", status: 'OK', post: newPost });
            }
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ message: err.message, status: 'KO' });
        }
    }
    async updatePost(req, res) {
        try {
            const { postId } = req.params;
            const { content, title, image, tissus } = req.body;
            const idTailleur = req.id;
            const post = await prisma.post.findUnique({
                where: {
                    id: postId,
                    author_id: idTailleur
                }
            });
            if (!post) {
                return res.status(404).json({
                    message: "Post not found or you don't have permission to edit it",
                    status: 'KO'
                });
            }
            const updatedPost = await prisma.post.update({
                where: { id: postId },
                data: {
                    content: content ?? post.content,
                    title: title ?? post.title,
                    image: image ?? post.image,
                    updatedAt: new Date()
                }
            });
            if (tissus && Array.isArray(tissus)) {
                await prisma.tissuPost.deleteMany({ where: { post_id: postId } });
                const updatedTissus = await prisma.tissuPost.createMany({
                    data: tissus.map(tissu => ({
                        prixMetre: tissu.prixMetre,
                        nombreMetre: tissu.nombreMetre,
                        post_id: postId,
                        tissu_id: tissu.tissu_id
                    }))
                });
                await prisma.post.update({
                    where: { id: postId },
                    data: {
                        tissus: {
                            create: tissus.map(tissu => ({
                                tissu_id: tissu.tissu_id,
                                prixMetre: tissu.prixMetre,
                                nombreMetre: tissu.nombreMetre
                            }))
                        }
                    }
                });
            }
            return res.status(200).json({ message: "Post updated successfully", status: 'OK', post: updatedPost });
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ message: err.message, status: 'KO' });
        }
    }
    async deletePost(req, res) {
        try {
            const postId = parseInt(req.params.postId);
            const idTailleur = req.id;
            const post = await prisma.post.findUnique({
                where: { id: postId },
            });
            if (!post || post.author_id !== idTailleur) {
                return res.status(404).json({
                    message: "Post not found or you don't have permission to delete it",
                    status: 'KO'
                });
            }
            await prisma.post.delete({
                where: { id: postId },
            });
            await prisma.tailleur.update({
                where: { compte_id: idTailleur },
                data: { post_ids: { disconnect: { id: postId } } },
            });
            return res.status(200).json({ message: "Post deleted successfully", status: 'OK' });
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ message: err.message, status: 'KO' });
        }
    }
    async acheterCredit(req, res) {
        try {
            const { compteId, montant } = req.body;
            if (typeof montant !== 'number' || montant <= 0) {
                return res.status(400).json({ error: 'Montant invalide' });
            }
            const regleConversion = await prisma.conversionCredit.findFirst();
            if (!regleConversion) {
                return res.status(500).json({ error: 'Règle de conversion non trouvée' });
            }
            const credit = (montant * regleConversion.credit) / regleConversion.prix;
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
            console.error('Erreur lors de l\'achat de crédits:', error);
            return res.status(500).json({
                error: 'Une erreur est survenue lors de l\'achat de crédits',
                details: error.message
            });
        }
    }
    async uploadProductImage(req, res, fieldName) {
        if (!req.files) {
            return res.status(500).json({ message: "No File Uploaded", status: "KO" });
        }
        const productImage = req.files[fieldName];
        if (!productImage || !productImage.mimetype.startsWith('image/')) {
            return res.status(500).json({ message: "Please Upload Image", status: "KO" });
        }
        const maxSize = 1024 * 1024;
        if (productImage.size > maxSize) {
            return res.status(500).json({ message: "Please upload image smaller than 1MB", status: "KO" });
        }
        try {
            const result = await cloudinary.uploader.upload(productImage.tempFilePath, {
                use_filename: true,
                folder: 'status',
            });
            fs.unlinkSync(productImage.tempFilePath);
            return res.status(200).json({ image: { src: result.secure_url } });
        }
        catch (error) {
            console.error('Error uploading image:', error);
            return res.status(500).json({ message: 'Error uploading image', status: 'KO' });
        }
    }
}
export default new TailleurController();
