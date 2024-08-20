// @ts-nocheck
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { PrismaClient } from "@prisma/client";
import { Response } from "express";
import { ControllerRequest } from "../interface/Interface";

const prisma = new PrismaClient();

class TailleurController {
  constructor() {
    // for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
    //     const val = this[key];
    //     if (key !== 'constructor' && typeof val === 'function') {
    //         this[key] = val.bind(this);
    //     }
    // }
  }

  // // Function to list all posts of the logged-in user (tailor or client)
  // async listMyAllPosts(req: ControllerRequest, res: Response) {
  //     try {
  //         const {tailleurId} = req.params;

  //         // Validate ID
  //         const account = await prisma.compte.findUnique({
  //             where: {id: tailleurId},
  //             include: {user: true},
  //         });

  //         if (!account) {
  //             return res.status(404).json({message: 'Compte introuvable', status: 'KO'});
  //         }

  //         const userType = account.user?.type;
  //         let statuses = [];

  //         if (userType === 'client') {
  //             const tailleursSuivis = account.follower_ids.map(follower => follower._id);
  //             statuses = await prisma.status.findMany({
  //                 where: {
  //                     tailleurId: {in: tailleursSuivis},
  //                     tailleur: {compte: {isActive: true}},
  //                 },
  //                 include: {tailleur: true},
  //             });
  //         } else if (userType === 'tailleur') {
  //             const tailleursSuivis = account.follower_ids.map(follower => follower._id);
  //             statuses = await prisma.status.findMany({
  //                 where: {
  //                     OR: [
  //                         {tailleurId: {in: tailleursSuivis}, tailleur: {compte: {isActive: true}}},
  //                         {tailleurId: tailleurId},
  //                     ],
  //                 },
  //                 include: {tailleur: true},
  //             });
  //         }

  //         if (statuses.length === 0) {
  //             return res.status(404).json({message: 'Aucun post trouvé', status: 'KO'});
  //         }

  //         res.status(200).json({statuses, status: 'OK'});
  //     } catch (err) {
  //         return res.status(500).json({message: err.message, status: 'KO'});
  //     }
  // }

  // Function to create a new status
  async createStatus(req: ControllerRequest, res: Response) {
      try {
          const compte_id = req.id;
          const tailleur = await prisma.Tailleur.findUnique({where: {compte_id: compte_id}});

          const {description} = req.body;
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

          res.status(201).json({message: 'Statut créé', status: newStatus});
      } catch (error) {
          console.error('Erreur lors de la création du statut:', error);
          res.status(500).json({message: error.message, status: 'KO'});
      }
  }

  // Function to list active statuses
  // async listStatus(req: ControllerRequest, res: Response) {
  //     try {
  //         const userId = req.id;
  //         const now = new Date();

  //         const account = await prisma.compte.findUnique({
  //             where: {id: userId},
  //             include: {follower_ids: true},
  //         });

  //         if (!account) {
  //             return res.status(404).json({message: 'Compte introuvable', status: 'KO'});
  //         }

  //         const userType = account.role;
  //         let statuses = [];

  //         if (userType === 'client') {
  //             const tailleursSuivis = account.follower_ids.map(follower => follower._id);
  //             statuses = await prisma.status.findMany({
  //                 where: {tailleurId: {in: tailleursSuivis}},
  //                 include: {tailleur: true},
  //             });
  //         } else if (userType === 'tailleur') {
  //             const tailleursSuivis = account.follower_ids.map(follower => follower._id);
  //             statuses = await prisma.status.findMany({
  //                 where: {
  //                     OR: [
  //                         {tailleurId: {in: tailleursSuivis}},
  //                         {tailleurId: userId},
  //                     ],
  //                 },
  //                 include: {tailleur: true},
  //             });
  //         }

  //         const activeStatuses = statuses.filter(status => {
  //             const createdAt = new Date(status.createdAt);
  //             const durationInSeconds = status.duration * 60;
  //             const differenceInSeconds = (now.getTime() - createdAt.getTime()) / 1000;

  //             return differenceInSeconds <= durationInSeconds && differenceInSeconds <= 86400;
  //         });

  //         console.log('Statuts actifs:', activeStatuses);

  //         return res.status(200).json({statuses: activeStatuses, status: 'OK'});
  //     } catch (err) {
  //         return res.status(500).json({message: err.message, status: 'oooKO'});
  //     }
  // }

  async createPost(req: ControllerRequest, res: Response) {
    try {
      const idCompte = req.id;
      const compte = await prisma.compte.findUnique({
        where: { id: idCompte },
      });
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
      // return res.json(fileNames);
      // Récupérer le tailleur avant de créer le post
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
              files: fileNames, // Sauvegarder les chemins des fichiers Cloudinary
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
        } else {
          return res.json({
            message:
              "Votre crédit est insuffisant et Vous avez déjà plus d'un post ce mois-ci, Achetez du crédit",
            status: "KO",
          });
        }
      } else {
        if (req.files.length > 1) {
          return res.json({
            message:
              "Vous ne pouvez poster plus de 1 file pour le moment, utilisez vos crédits",
            status: "KO",
          });
        }

        const newPost = await prisma.post.create({
          data: {
            content,
            title,
            files: fileNames, // Sauvegarder les chemins des fichiers Cloudinary
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
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message, status: "KO" });
    }
  }
//for update
async updatePost(req: ControllerRequest, res: Response) {
  try {
    const postId = parseInt(req.params.postId, 10);  // Convertir l'ID en entier
      const { content, title } = req.body;
      const tailleur_id = req.id;

      // Vérifier si le post existe et appartient au tailleur
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

      // Mettre à jour les champs de base
      const updatedPost = await prisma.post.update({
          where: { id: postId },
          data: {
              content: content ?? post.content,
              title: title ?? post.title,
              // files: image ?? post.files,
              updatedAt: new Date()
          }
      });

      // Mettre à jour les tissus
      // if (tissus && Array.isArray(tissus)) {
      //     // Supprimer les anciens tissus
      //     await prisma.tissuPost.deleteMany({ where: { post_id: postId } });

      //     // Ajouter les nouveaux tissus
      //     await prisma.$transaction(
      //         tissus.map(tissu => 
      //             prisma.tissuPost.create({
      //                 data: {
      //                     prixMetre: tissu.prixMetre,
      //                     nombreMetre: tissu.nombreMetre,
      //                     post_id: postId,
      //                     tissu_id: tissu.tissu_id
      //                 }
      //             })
      //         )
      //     );
      // }

      return res.status(200).json({ message: "Post updated successfully", status: 'OK', post: updatedPost });
  } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message, status: 'KO' });
  }
}

async deletePost(req: ControllerRequest, res: Response){
  try {
      const postId = parseInt(req.params.postId);
      const tailleur_id = req.id;

      // Vérifier si le post existe et appartient au tailleur
      const post = await prisma.Post.findUnique({
          where: {id: postId},
      });

      if (!post || post.tailleur_id !== tailleur_id) {
          return res.status(404).json({
              message: "Post not found or you don't have permission to delete it",
              status: 'KO'
          });
      }
      
      // Supprimer le post
      await prisma.Post.delete({
          where: {id: postId},
      });


      return res.status(200).json({message: "Post deleted successfully", status: 'OK'});
  } catch (err) {
      console.error(err);
      return res.status(500).json({message: err.message, status: 'KO'});
  }
}
 
  // async acheterCredit(req: ControllerRequest, res: Response){
  //     try {
  //         const {compteId, montant} = req.body;

  //         // Validation du montant
  //         if (typeof montant !== 'number' || montant <= 0) {
  //             return res.status(400).json({error: 'Montant invalide'});
  //         }

  //         // Calculer le crédit
  //         const regleConversion = await prisma.conversionCredit.findFirst();
  //         if (!regleConversion) {
  //             return res.status(500).json({error: 'Règle de conversion non trouvée'});
  //         }
  //         const credit = (montant * regleConversion.credit) / regleConversion.prix;

  //         // Trouver le compte
  //         const compte = await prisma.compte.findUnique({
  //             where: {id: compteId},
  //         });

  //         if (!compte) {
  //             return res.status(404).json({error: 'Compte non trouvé'});
  //         }

  //         // Vérifier si le compte est un "tailleur"
  //         if (compte.role !== 'tailleur') {
  //             return res.status(403).json({error: 'Seul un tailleur peut acheter des crédits'});
  //         }

  //         // Ajouter le crédit au crédit existant
  //         const updatedCompte = await prisma.compte.update({
  //             where: {id: compteId},
  //             data: {credit: credit + compte.credit},
  //         });

  //         // Envoyer la réponse
  //         return res.status(200).json({message: 'Crédit ajouté avec succès', compte: updatedCompte});
  //     } catch (error) {
  //         console.error('Erreur lors de l\'achat de crédits:', error);
  //         return res.status(500).json({
  //             error: 'Une erreur est survenue lors de l\'achat de crédits',
  //             details: error.message
  //         });
  //     }
  // }

  // async uploadProductImage(req: ControllerRequest, res: Response, fieldName: string){
  //     if (!req.files) {
  //         return res.status(500).json({message: "No File Uploaded", status: "KO"});
  //     }

  //     const productImage = req.files[fieldName];
  //     if (!productImage || !productImage.mimetype.startsWith('image/')) {
  //         return res.status(500).json({message: "Please Upload Image", status: "KO"});
  //     }

  //     const maxSize = 1024 * 1024;
  //     if (productImage.size > maxSize) {
  //         return res.status(500).json({message: "Please upload image smaller than 1MB", status: "KO"});
  //     }

  //     try {
  //         const result = await cloudinary.uploader.upload(productImage.tempFilePath, {
  //             use_filename: true,
  //             folder: 'status',
  //         });
  //         fs.unlinkSync(productImage.tempFilePath);
  //         return res.status(200).json({image: {src: result.secure_url}});
  //     } catch (error) {
  //         console.error('Error uploading image:', error);
  //         return res.status(500).json({message: 'Error uploading image', status: 'KO'});
  //     }
  // }
}

export default new TailleurController();
