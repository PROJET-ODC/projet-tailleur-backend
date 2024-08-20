import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
class TailleurController {
    constructor() {
    }
    async createStatus(req, res) {
        try {
            const compte_id = req.id;
            const tailleur = await prisma.Tailleur.findUnique({ where: { compte_id: compte_id } });
            const { description } = req.body;
            const fileNames = req.files["files"].name;
            const newStatus = await prisma.Status.create({
                data: {
                    files: fileNames,
                    description: description || 'Model du jour',
                    duration: "24hours",
                    viewNb: 0,
                    tailleur_id: tailleur?.id,
                },
            });
            res.status(201).json({ message: 'Statut créé', status: newStatus });
        }
        catch (error) {
            console.error('Erreur lors de la création du statut:', error);
            res.status(500).json({ message: error.message, status: 'KO' });
        }
    }
    async createPost(req, res) {
        try {
            const idCompte = req.id;
            const compte = await prisma.compte.findUnique({
                where: { id: idCompte },
            });
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
            const { content, title, useCredit } = req.body;
            if (!content || typeof content !== "string") {
                return res.status(400).json({
                    message: "Content must be a non-empty string",
                    status: "KO",
                });
            }
            if (!title || typeof title !== "string") {
                return res
                    .status(400)
                    .json({ message: "Title must be a non-empty string", status: "KO" });
            }
            if (!req.files || req.files.length === 0) {
                return res
                    .status(400)
                    .json({ message: "Files must be a non-empty array", status: "KO" });
            }
            const fileNames = req.files["files"].name;
            const tailleur = await prisma.tailleur.findUnique({
                where: { compte_id: idCompte },
            });
            if (!tailleur) {
                return res
                    .status(404)
                    .json({ message: "Tailleur not found", status: "KO" });
            }
            const allMyPosts = await prisma.post.findMany({
                where: {
                    tailleur_id: tailleur.id,
                    count: 0,
                    createdAt: {
                        gte: startOfMonth,
                        lte: endOfMonth,
                    },
                },
            });
            if (allMyPosts.length >= 1 || useCredit === true) {
                if (compte.credit >= 2) {
                    compte.credit -= 2;
                    await prisma.compte.update({
                        where: { id: idCompte },
                        data: { credit: compte.credit },
                    });
                    const newPost = await prisma.post.create({
                        data: {
                            content,
                            title,
                            files: fileNames,
                            shareNb: 0,
                            viewsNb: 0,
                            count: 2,
                            tailleur_id: tailleur.id,
                            categorie: req.body.categorie || null,
                            status: req.body.status || "draft",
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        },
                    });
                    return res.status(201).json({
                        message: "Post created successfully",
                        status: "OK",
                        post: newPost,
                    });
                }
                else {
                    return res.json({
                        message: "Votre crédit est insuffisant et Vous avez déjà plus d'un post ce mois-ci, Achetez du crédit",
                        status: "KO",
                    });
                }
            }
            else {
                if (req.files.length > 1) {
                    return res.json({
                        message: "Vous ne pouvez poster plus de 1 file pour le moment, utilisez vos crédits",
                        status: "KO",
                    });
                }
                const newPost = await prisma.post.create({
                    data: {
                        content,
                        title,
                        files: fileNames,
                        shareNb: 0,
                        viewNb: 0,
                        count: 2,
                        tailleur_id: tailleur.id,
                        categorie: req.body.categorie || null,
                        status: req.body.status || "draft",
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                });
                return res.status(201).json({
                    message: "Post created successfully",
                    status: "OK",
                    post: newPost,
                });
            }
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ message: err.message, status: "KO" });
        }
    }
    async updatePost(req, res) {
        try {
            const postId = parseInt(req.params.postId, 10);
            const { content, title } = req.body;
            const tailleur_id = req.id;
            const post = await prisma.post.findUnique({
                where: {
                    id: postId,
                    tailleur_id: tailleur_id
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
                    updatedAt: new Date()
                }
            });
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
            const tailleur_id = req.id;
            const post = await prisma.Post.findUnique({
                where: { id: postId },
            });
            if (!post || post.tailleur_id !== tailleur_id) {
                return res.status(404).json({
                    message: "Post not found or you don't have permission to delete it",
                    status: 'KO'
                });
            }
            await prisma.Post.delete({
                where: { id: postId },
            });
            return res.status(200).json({ message: "Post deleted successfully", status: 'OK' });
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ message: err.message, status: 'KO' });
        }
    }
}
export default new TailleurController();
