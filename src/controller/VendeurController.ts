import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import { ArticleUnite, PrismaClient, Unite } from '@prisma/client';
import { Response } from 'express';
import { ControllerRequest } from "../interface/Interface.js";

const prisma = new PrismaClient();

class VendeurController {
    constructor() {
        for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
            const val = (this as any)[key];
            if (key !== 'constructor' && typeof val === 'function') {
                (this as any)[key] = val.bind(this);
            }
        }
    }

    async addArticle(req: ControllerRequest, res: Response) {
        const id = parseInt(req.id!);
        const {
            libelle,
            images,
            description,
            categorie_id,
            couleurs,
            unites
        } = req.body;

        if (!libelle || !images || !description || !categorie_id || !couleurs || !unites) {
            return res.status(400).json({ message: 'Tous les champs sont obligatoires', status: 'KO' });
        }

        const vendeur = await prisma.vendeur.findUnique({
            where: { compte_id: id }
        })

        if (!vendeur) {
            return res.status(404).json({ message: 'Vendeur non trouvé', status: 'KO' });
        }

        try {
            const article = await prisma.article.create({
                data: {
                    libelle: "" + libelle,
                    image: images,
                    description: "" + description,
                    categorie_id: parseInt(categorie_id),
                    vendeur_id: vendeur.id,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    slug: "tissu-" + libelle, // Assuming generateSlug is a function to create a slug
                    etat: "ACTIF",
                }
            });
            if (!article) {
                return res.status(500).json({
                    message: 'Une erreur est survenue lors de la création de l\'article',
                    status: 'KO'
                });
            }
            for (let i = 0; i < couleurs.length; i++) {
                let couleur_article = await prisma.couleurArticle.create({
                    data: {
                        article_id: article.id,
                        couleur_id: couleurs[i],
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    }
                })
                if (!couleur_article) {
                    return res.status(500).json({
                        message: 'Une erreur est survenue lors de la création de la couleur pour l\'article',
                        status: 'KO'
                    });
                }
            }

            for (let i = 0; i < unites.length; i++) {
                let unite_article = await prisma.articleUnite.create({
                    data: {
                        prix: unites[i].prix,
                        qte: unites[i].qte,
                        article_id: article.id,
                        unite_id: unites[i].unite_id,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    }
                })
            }

            return res.json({ message: "L'article est ajouté avec succès", status: "OK" });

        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({
                    message: 'Une erreur est survenue lors de la création de l\'article',
                    status: 'KO'
                });
            }
        }

    }

    async myArticles(req: ControllerRequest, res: Response) {
        const id = parseInt(req.id!);
        const vendeur = await prisma.vendeur.findUnique({
            where: { compte_id: id }
        })

        if (!vendeur) {
            return res.status(404).json({ message: 'Vendeur non trouvé', status: 'KO' });
        }

        try {
            const articles = await prisma.article.findMany({
                where: {
                    AND: [
                        { vendeur_id: vendeur.id },
                        { etat: "ACTIF" }
                    ]
                },
                include: {
                    couleur_article: {
                        select: { couleur: true },
                    },
                    categorie: {
                        select: { libelle: true },
                    },
                    article_unite: {
                        select: { prix: true, qte: true, unite: true },
                    },
                },
            })

            return res.json({ message: "Les articles sont récupérés avec succès", status: "OK", data: articles });

        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({
                    message: 'Une erreur est survenue lors de la récupération des articles',
                    status: 'KO'
                });
            }
        }
    }


    async updateArticle(req: ControllerRequest, res: Response) {
        const { unites, article_id } = req.body;
        const compte_id = parseInt(req.id!);

        const vendeur = await prisma.vendeur.findUnique({
            where: { compte_id }
        });

        if (!vendeur) {
            return res.status(404).json({ message: 'Vendeur non trouvé', status: 'KO' });
        }

        for (const unite of unites) {
            let article_unite = await prisma.articleUnite.updateMany({
                where: {
                    article_id: article_id,
                    unite_id: unite.unite_id,
                },
                data: {
                    qte: {
                        increment: unite.qte,
                    },
                }
            });
            if (!article_unite) {
                return res.status(500).json({
                    message: 'Une erreur est survenue lors de la mise à jour de la quantité pour l\'article',
                    status: 'KO'
                });
            }
        }
        return res.json({ message: "Les quantités des articles ont été mises à jour avec succès", status: "OK" });
    }


    // async myCommandes(req: ControllerRequest, res: Response) {
    //     const id = parseInt(req.id!);
    //     const vendeur = await prisma.vendeur.findUnique({
    //         where: { compte_id: id }
    //     });

    //     if (!vendeur) {
    //         return res.status(404).json({ message: 'Vendeur non trouvé', status: 'KO' });
    //     }

    //     try {
    //         const commandes = await prisma.commandeArticle.findMany({
    //             where: {
    //                 detailcommandes: {
    //                     some: {
    //                         article: {
    //                             vendeur_id: vendeur.id // Remplacez vendeurId par l'ID du vendeur spécifique
    //                         }
    //                     }
    //                 }
    //             },
    //             include: {
    //                 detailcommandes: {
    //                     include: {
    //                         article: true // Inclut les articles pour chaque détail de commande
    //                     }
    //                 }
    //             }
    //         });

    //         return res.json({ commandes, message: "Les commandes sont récupérées avec succès", status: "OK" });

    //     } catch (err) {
    //         if (err instanceof Error) {
    //             return res.json({ message: err.message, status: "KO" })
    //         }
    //     }
    // }


    async  myCommandes(req: ControllerRequest, res: Response) {
        const userId = parseInt(req.id!); // ID de l'utilisateur connecté
      
        try {
          // On récupère le compte de l'utilisateur connecté
          const compte = await prisma.compte.findUnique({
            where: {
              user_id: userId // Le compte est lié à l'utilisateur connecté
            },
            include: {
              vendeur: true, // Inclure le vendeur si l'utilisateur est un vendeur
              tailleur: true // Inclure le tailleur si l'utilisateur est un tailleur
            }
          });
      
          if (!compte) {
            return res.status(404).json({ message: 'Compte non trouvé', status: 'KO' });
          }
      
          let articles;
      
          if (compte.vendeur) {
            // Si l'utilisateur est un vendeur, on récupère les articles liés à ses commandes
            articles = await prisma.detailCommandeArticle.findMany({
              where: {
                article: {
                  vendeur_id: compte.vendeur.id // Filtrer par le vendeur lié au compte
                }
              },
              include: {
                article: {
                  select: {
                    libelle: true,
                    image: true
                  }
                },
                commande: {
                  select: {
                    numero: true,
                    montantTotal: true
                  }
                }
              }
            });
          } else if (compte.tailleur) {
            // Si l'utilisateur est un tailleur, on récupère les articles de ses commandes
            articles = await prisma.detailCommandeArticle.findMany({
              where: {
                commande: {
                  tailleur_id: compte.tailleur.id // Filtrer par le tailleur lié au compte
                }
              },
              include: {
                article: {
                  select: {
                    libelle: true,
                    image: true
                  }
                },
                commande: {
                  select: {
                    numero: true,
                    montantTotal: true
                  }
                }
              }
            });
          } else {
            return res.status(400).json({ message: 'Aucun rôle de vendeur ou tailleur trouvé pour cet utilisateur', status: 'KO' });
          }
      
          const result = articles.map(detail => ({
            libelle: detail.article.libelle,
            image: detail.article.image,
            qte: detail.qte,
            numero: detail.commande.numero,
            montantTotal: detail.commande.montantTotal
          }));
      
          return res.json(result);
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'Une erreur est survenue', status: 'KO' });
        }
      }
      
    


    async validateCommandes(req: ControllerRequest, res: Response) {

    }

    // async listCommandes(req: ControllerRequest, res: Response) {
    //     const vendeurId = parseInt(req.id!);
    
    //     // Vérification de l'existence du vendeur
    //     const vendeur = await prisma.vendeur.findUnique({
    //         where: { compte_id: vendeurId }
    //     });
    
    //     if (!vendeur) {
    //         return res.status(404).json({ message: 'Vendeur non trouvé', status: 'KO' });
    //     }
    
    //     console.log("Vendeur trouvé :", vendeur); // Log du vendeur
    
    //     try {

            
    //         // Récupérer les commandes où les articles appartiennent au vendeur
    //         const commandes = await prisma.commandeArticle.findMany({
    //             where: {
    //                 detailcommandes: {
    //                     some: {
    //                         article: {
    //                             vendeur_id: vendeur.id // ID du vendeur
    //                         }
    //                     }
    //                 }
    //             },
    //             include: {
    //                 paiement: true, // Inclure les paiements
    //                 detailcommandes: {
    //                     include: {
    //                         article: true, // Inclure les articles
    //                     }
    //                 },
    //                 tailleur: true, // Inclure les informations sur le tailleur
    //             },
    //             distinct: ['id'], // Assurer l'unicité des commandes
    //         });
    
    //         console.log("Commandes récupérées :", commandes); // Log des commandes
    
    //         return res.json({ commandes, message: "Les commandes sont récupérées avec succès", status: "OK" });
    
    //     } catch (err) {
    //         console.error("Erreur lors de la récupération des commandes :", err); // Log de l'erreur
    //         return res.status(500).json({ message: 'Erreur lors de la récupération des commandes', status: "KO" });
    //     }
    // }


}
export default new VendeurController();
