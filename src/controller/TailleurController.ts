import {v2 as cloudinary} from 'cloudinary'
import fs from "fs";
import {PrismaClient} from "@prisma/client";
import {Response} from "express";
import {ControllerRequest} from "../interface/Interface";
import Decimal from 'decimal.js';
import { etatCommande } from '@prisma/client'; // Importez l'énumération


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

    // Function to create a new status
    async createStatus(req: ControllerRequest, res: Response) {
        try {
            const compte_id = parseInt(req.id!);
            const tailleur = await prisma.tailleur.findUnique({where: {compte_id: compte_id}});

            const {description} = req.body;
            if (!tailleur) {
                return res.status(400).json({message: "Le tailleur est introuvable", status: "KO"})
            }
            if (!req.files) {
                return res.status(400).json({message: "Le fichier est requis", status: "KO"})
            }

            const fileNames = "name" in req.files["files"] ? req.files["files"].name : "";

            const newStatus = await prisma.status.create({
                data: {
                    files: fileNames,
                    description: description || 'Model du jour',
                    duration: "24hours",
                    viewNb: 0,
                    tailleur_id: tailleur.id
                },
            });

            res.status(201).json({message: 'Statut créé', status: newStatus});
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({message: error.message, status: 'KO'});
            }
        }
    }
    async deleteStatus(req: ControllerRequest, res: Response) {
        try {
            // const status_id = parseInt(req.params.status_id);
            const status_id = parseInt(req.body.status_id);

    
            // Vérifier que l'ID du statut est valide

            if (isNaN(status_id)) {
                return res.status(400).json({
                    message: "ID de statut invalide",
                    status: 'KO'
                });
            }
    
            // Vérifier si le statut existe
            const statut = await prisma.status.findUnique({
                where: { id: status_id },
            });
    
            if (!statut) {
                return res.status(404).json({
                    message: "Statut non trouvé",
                    status: 'KO'
                });
            }
    
            // Supprimer le statut
            await prisma.status.delete({
                where: { id: status_id },
            });
    
            return res.status(200).json({
                message: "Statut supprimé avec succès",
                status: 'OK'
            });
        } catch (err) {
            if (err instanceof Error) {
                console.error("Erreur lors de la suppression du statut:", err.message);
                return res.status(500).json({ message: err.message, status: 'KO' });
            }
        }
    }
    
    async createPost(req: ControllerRequest, res: Response) {
        try {
            const idCompte = parseInt(req.id!);
            const compte = await prisma.compte.findUnique({
                where: { id: idCompte },
            });
    
            if (!compte) {
                return res.status(404).json({ message: "Compte introuvable", status: "KO" });
            }
    
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfMonth = new Date(
                now.getFullYear(),
                now.getMonth() + 1,
                0,
                23,
                59,
                59,
                999
            );
    
            // Valider les champs
            const { content, title, useCredit, tags, tailles } = req.body;
    
            if (!content || typeof content !== "string") {
                return res.status(400).json({
                    message: "Content must be a non-empty string",
                    status: "KO",
                });
            }
    
            if (!title || typeof title !== "string") {
                return res.status(400).json({
                    message: "Title must be a non-empty string",
                    status: "KO"
                });
            }
    
            if (!req.files) {
                return res.status(400).json({
                    message: "Le fichier est requis",
                    status: "KO"
                });
            }
    
            const fileNames = "name" in req.files["files"] ? req.files["files"].name : "";
    
            // Récupérer le tailleur avant de créer le post
            const tailleur = await prisma.tailleur.findUnique({
                where: { compte_id: idCompte },
            });
    
            if (!tailleur) {
                return res.status(404).json({
                    message: "Tailleur not found",
                    status: "KO"
                });
            }
    
            const allMyPosts = await prisma.post.findMany({
                where: {
                    tailleur_id: tailleur.id,
                    createdAt: {
                        gte: startOfMonth,
                        lte: endOfMonth,
                    },
                },
            });
    
            // Si le tailleur a déjà posté ce mois-ci et ne veut pas utiliser de crédits
            if (allMyPosts.length >= 1 && !useCredit) {
                return res.json({
                    message: "Vous ne pouvez poster plus de 1 fichier gratuitement ce mois-ci, utilisez vos crédits",
                    status: "KO"
                });
            }
    
            // Si l'utilisateur veut utiliser ses crédits pour poster
            if (useCredit) {
                if (compte.credit >= 2) {
                    compte.credit -= 2;
                    await prisma.compte.update({
                        where: { id: idCompte },
                        data: { credit: compte.credit },
                    });
                } else {
                    return res.json({
                        message: "Crédit insuffisant. Rechargez votre compte pour continuer.",
                        status: "KO"
                    });
                }
            }
    
            // S'assurer que tags et tailles sont des tableaux (même vides)
            const tagArray = Array.isArray(tags) ? tags : [];
            const tailleArray = Array.isArray(tailles) ? tailles : [];
    
            // Créer le post
            const newPost = await prisma.post.create({
                data: {
                    content,
                    title,
                    files: fileNames,
                    shareNb: 0,
                    viewNb: 0,
                    count: useCredit ? 2 : 0,
                    tailleur_id: tailleur.id,
                    categorie: req.body.categorie || null,
                    status: req.body.status || "draft",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    tags: {
                        create: tagArray.map((libelle: string) => ({
                            libelle,
                        })),
                    },
                    TaillePost: {
                        create: tailleArray.map((tailleId: number) => ({
                            taille: { connect: { id: tailleId } }, // Utilisez `connect` pour associer les tailles existantes
                        })),
                    },
                },
                include: {
                    tags: true,
                    TaillePost: {
                        include: {
                            taille: true,
                        }
                    },
                },
            });
    
            return res.status(201).json({
                message: "Post created successfully",
                status: "OK",
                post: newPost,
            });
    
        } catch (error) {
            if (error instanceof Error) {
                console.error("Erreur lors de la création du post:", error);
                return res.status(500).json({
                    error: "Une erreur est survenue lors de la création du post",
                    details: error.message,
                });
            }
        }
    }
    
    
    
    async acheterCredit(req: ControllerRequest, res: Response) {
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
            if (error instanceof Error) {
                console.error('Erreur lors de l\'achat de crédits:', error);
                return res.status(500).json({
                    error: 'Une erreur est survenue lors de l\'achat de crédits',
                    details: error.message
                });
            }
        }

    }

//for update
    async updatePost(req: ControllerRequest, res: Response) {
        try {
            const postId = parseInt(req.params.postId, 10);  // Convertir l'ID en entier
            const {content, title} = req.body;
            const compte_id = parseInt(req.id!);

            const tailleur = await prisma.tailleur.findUnique({
                where:{compte_id}
            })

            if (!tailleur){
                return res.status(404).json({
                    message: "Tailleur not found",
                    status: 'KO'
                });
            }
            // Vérifier si le post existe et appartient au tailleur
            const post = await prisma.post.findUnique({
                where: {
                    id: postId,
                    tailleur_id: tailleur.id
                }
            });

            if (!post) {
                return res.status(404).json({
                    message: "Post not found or you don't have permission to edit it",
                    status: 'KO'
                });
            }

            // Mettre à jour les champs de base
            const updatedPost = await prisma.post.update({
                where: {id: postId},
                data: {
                    content: content ?? post.content,
                    title: title ?? post.title,
                    // files: image ?? post.files,
                    updatedAt: new Date()
                }
            });


            return res.status(200).json({message: "Post updated successfully", status: 'OK', post: updatedPost});
        } catch (err) {
            if(err instanceof Error) {
                return res.status(500).json({message: err.message, status: 'KO'});
            }
        }
    }

    async deletePost(req: ControllerRequest, res: Response) {
        try {
            const postId = parseInt(req.params.postId);
            const compte_id = parseInt(req.id!);

            const tailleur = await prisma.tailleur.findUnique({
                where:{compte_id}
            })

            if (!tailleur){
                return res.status(404).json({
                    message: "Tailleur not found",
                    status: 'KO'
                });
            }

            // Vérifier si le post existe et appartient au tailleur
            const post = await prisma.post.findUnique({
                where: {id: postId},
            });

            if (!post || post.tailleur_id !== tailleur.id) {
                return res.status(404).json({
                    message: "Post not found or you don't have permission to delete it",
                    status: 'KO'
                });
            }

            // Supprimer le post
            await prisma.post.delete({
                where: {id: postId},
            });


            return res.status(200).json({message: "Post deleted successfully", status: 'OK'});
        } catch (err) {
            if(err instanceof Error) {
                return res.status(500).json({message: err.message, status: 'KO'});
            }
        }
    }


    async getArticleCategories(req: ControllerRequest, res: Response) {

    }

    async getAllArticles(req: ControllerRequest, res: Response) {

    }

    async getSomeArticle(req: ControllerRequest, res: Response) {

    }

    async getAllApprovisions(req: ControllerRequest, res: Response) {

    }

  async payerResteCommande(req: ControllerRequest, res: Response) {
    try {
        const { commande_id, montant } = req.body; 
        const compte_id = parseInt(req.id!);

        // Valider les entrées
        if (!commande_id || !montant) {
            return res.status(400).json({
                message: "Commande ID et montant sont requis",
                status: 'KO'
            });
        }
        const parsedCommandeId = parseInt(commande_id);
        const parsedMontant = parseFloat(montant);
        console.log("ID de la commande pour le paiement:", parsedCommandeId);

        // Vérifier si le tailleur existe
        const tailleur = await prisma.tailleur.findUnique({
            where: { compte_id }
        });

        if (!tailleur) {
            return res.status(404).json({
                message: "Tailleur non trouvé",
                status: 'KO'
            });
        }

        // Vérifier si la commande existe et appartient au tailleur
        const commande = await prisma.commandeArticle.findUnique({
            where: { id: parsedCommandeId },
        });

        if (!commande || commande.tailleur_id !== tailleur.id) {
            return res.status(404).json({
                message: "Commande non trouvée ou vous n'avez pas la permission de la payer",
                status: 'KO'
            });
        }

        // Vérifier que la commande existe avant de créer le paiement
        if (!commande) {
            return res.status(404).json({
                message: "Commande non trouvée",
                status: 'KO'
            });
        }

        // Récupérer le montant versé actuellement pour cette commande
        const paiements = await prisma.paiementArticle.findMany({
            where: { commande_id: parsedCommandeId }
        });

        const montantVerse = paiements.reduce((total, paiement) => total.plus(paiement.montant), new Decimal(0));

        // Ajouter le nouveau montant versé
        const totalVerse = montantVerse.plus(new Decimal(parsedMontant));

        // Insérer le nouveau paiement
        await prisma.paiementArticle.create({
            data: {
                montant: parsedMontant,
                commande_id: parsedCommandeId, // Utiliser l'entier parsedCommandeId ici
            }
        });

        // Vérifier si le montant total a été atteint
        let etatPaiement: etatCommande = etatCommande.EN_ATTENTE;
        if (totalVerse.gte(new Decimal(commande.montantTotal))) {
            etatPaiement = etatCommande.TERMINER;
        }

        // Mettre à jour l'état de la commande si nécessaire
        await prisma.commandeArticle.update({
            where: { id: parsedCommandeId },
            data: {
                etat: etatPaiement
            }
        });

        return res.status(200).json({
            message: `Paiement de ${parsedMontant} a été ajouté. Statut du paiement: ${etatPaiement}`,
            status: 'OK'
        });

    } catch (err) {
        if (err instanceof Error) {
            return res.status(500).json({ message: err.message, status: 'KO' });
        }
    }
}

  
  

    async detailsApprovisions(req: ControllerRequest, res: Response) {

    }

    async addApprovisions(req: ControllerRequest, res: Response) {

    }

  

}

export default new TailleurController();
//772313145:FATIMA IMAN//