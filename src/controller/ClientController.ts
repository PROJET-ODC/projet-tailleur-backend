import {
  Favori,
  Comment,
  CommentResponse,
  Post,
  Report,
  Compte,
} from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { ControllerRequest } from "../interface/Interface.js";
import { Response } from "express";

const prisma = new PrismaClient();

class ClientController {
  constructor() {
    for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
      const val = (this as any)[key];
      if (key !== "constructor" && typeof val === "function") {
        (this as any)[key] = val.bind(this);
      }
    }
  }

  async getAuthUser(req: ControllerRequest, res: Response) {}

  // Ajouter un like$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
  async addLike(req: ControllerRequest, res: Response) {
    try {
      const postId = parseInt(req.body.postId);
      const compteId = parseInt(req.body.compteId);

      // Vérifie si un like/dislike existe déjà pour ce post et ce compte
      const existingLike = await prisma.like.findFirst({
        where: { post_id: postId, compte_id: compteId },
      });

      if (existingLike) {
        if (existingLike.etat === "LIKE") {
          // Si l'état est LIKE, supprimer le like
          await prisma.like.delete({
            where: { id: existingLike.id },
          });

          return res.status(200).json({
            message: "Like supprimé avec succès",
            status: "OK",
          });
        } else if (existingLike.etat === "DISLIKE") {
          // Si l'état est DISLIKE, le mettre à jour en LIKE
          const updatedLike = await prisma.like.update({
            where: { id: existingLike.id },
            data: { etat: "LIKE", updatedAt: new Date() },
          });

          return res.status(200).json({
            message: "État changé de dislike à like",
            data: updatedLike,
            status: "OK",
          });
        }
      } else {
        // Crée un nouveau like si aucun n'existe
        const newLike = await prisma.like.create({
          data: {
            post_id: postId,
            compte_id: compteId,
            etat: "LIKE",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });

        return res.status(201).json({
          message: "Like ajouté avec succès",
          data: newLike,
          status: "OK",
        });
      }
    } catch (err) {
      if (err instanceof Error) {
        return res.status(500).json({ message: err.message, status: "KO" });
      }
    }
  }

  // Ajouter un dislike$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
  async addDislike(req: ControllerRequest, res: Response) {
    try {
      const postId = parseInt(req.body.postId);
      const compteId = parseInt(req.body.compteId);


      const existingDislike = await prisma.like.findFirst({
        where: { post_id: postId, compte_id: compteId },
      });

      if (existingDislike) {
        if (existingDislike.etat === "DISLIKE") {
          await prisma.like.delete({
            where: { id: existingDislike.id },
          });

          return res.status(200).json({
            message: "Dislike supprimé avec succès",
            status: "OK",
          });
        } else if (existingDislike.etat === "LIKE") {
          await prisma.like.update({
            where: { id: existingDislike.id },
            data: { etat: "DISLIKE", updatedAt: new Date() },
          });

          return res.status(200).json({
            message: "État changé de like à dislike",
            data: existingDislike,
            status: "OK",
          });
        }
      } else {

        const newDislike = await prisma.like.create({
          data: {
            post_id: postId,
            compte_id: compteId,
            etat: "DISLIKE",            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });

        return res.status(201).json({
          message: "Dislike ajouté avec succès",
          data: newDislike,
          status: "OK",
        });
      }
    } catch (err) {
      if (err instanceof Error) {
        return res.status(500).json({ message: err.message, status: "KO" });
      }

    }
  }

  // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
  async getNotificationsForUser(req: ControllerRequest, res: Response) {
    const userId = parseInt(req.id!);

    try {
      const notifications = await prisma.notification.findMany({
        where: { compte_id: userId }, // Utilisation du champ correct `compte_id`
      });

      return res.status(200).json({
        notifications,
        message: "Notifications chargées.",
        status: "OK",
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message, status: "KO" });
      }
    }
  }

  async sendMessage(req: ControllerRequest, res: Response) {
    try {
      const { messaged_id, texte } = req.body;
      const messager_id = parseInt(req.id!); // Obtenez l'ID du client connecté depuis la requête `req.id`
      // Utilisation du champ correct `id` du client connecté

      const messaged_id1 = parseInt(messaged_id);

      // Vérifiez que tous les champs requis sont présents
      if (
        typeof messager_id !== "number" ||
        typeof messaged_id1 !== "number" ||
        typeof texte !== "string"
      ) {
        return res.status(400).json({
          message:
            "Les champs messager_id, messaged_id et texte sont requis et doivent être du bon type.",
          status: "KO",
        });
      }

      // Créez un nouveau message
      const newMessage = await prisma.message.create({
        data: {
          messager_id,
          messaged_id: messaged_id1,
          texte,
        },
      });

      console.log(newMessage);

      res.status(201).json({ message: "Message envoyé", status: newMessage });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message, status: "KO" });
      }
    }
  }


async getMesssage(req: ControllerRequest, res: Response): Promise<Response> {
  try {
      // Récupération de l'ID utilisateur à partir des paramètres de la requête
      const userId = Number(req.params.user_id);

      // Vérification que l'ID utilisateur est valide
      if (isNaN(userId)) {
          return res.status(400).json({ message: "ID utilisateur invalide", status: "KO" });
      }

      // Récupération des messages associés à cet utilisateur
      const messages = await prisma.message.findMany({
          where: { messager_id: userId },
          orderBy: { createdAt: 'desc' } 
      });

      // Vérification si l'utilisateur a des messages
      if (messages.length === 0) {
          return res
            .status(404)
            .json({ message: "Aucune discussion trouvée pour cet utilisateur", status: "KO" });
      }

      // Renvoie des messages avec un statut de succès
      return res.status(200).json({ messages, status: "OK" });
  } catch (err: any) {
      return res.status(500).json({ message: err.message, status: "KO" });
  }
}

  async getFavoriteById(
    req: ControllerRequest,
    res: Response
  ): Promise<Response> {
    try {
      const favorite = await prisma.favori.findUnique({
        where: { id: Number(req.id) },
        include: { post: true },
      });

      if (!favorite) {
        return res
          .status(404)
          .json({ message: "Favori non trouvé", status: "KO" });
      }

      return res.status(200).json({ favorite, status: "OK" });
    } catch (err: any) {
      return res.status(500).json({ message: err.message, status: "KO" });
    }
  }

  async listFavorites(
    req: ControllerRequest,
    res: Response
  ): Promise<Response> {
    try {
      const favorites = await prisma.favori.findMany({
        where: { compte_id: Number(req.id) },
        include: { post: true },
      });

      return res.status(200).json({ favorites, status: "OK" });
    } catch (err: any) {
      return res.status(500).json({ message: err.message, status: "KO" });
    }
  }

  async addFavorite(req: ControllerRequest, res: Response): Promise<Response> {
    try {
      const { post_id } = req.body;
      const compte_id = Number(req.id);

      const newFavorite = await prisma.favori.create({
        data: {
          post_id,
          compte_id,
          createdAt: new Date(),
        },
      });

      return res.status(201).json({ favorite: newFavorite, status: "OK" });
    } catch (err: any) {
      return res.status(500).json({ message: err.message, status: "KO" });
    }
  }

  async getAllFavorites(
    req: ControllerRequest,
    res: Response
  ): Promise<Response> {
    try {
      const id = req.id;

      if (!id) {
        return res.status(400).json({ message: "ID utilisateur invalide" });
      }

      const user = await prisma.compte.findUnique({
        where: { id: Number() },
      });

      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      const favorites = await prisma.favori.findMany({
        where: { compte_id: user.id },
      });

      return res.status(200).json({ favorites, status: "OK" });
    } catch (error: any) {
      return res.status(500).json({
        message: "Erreur lors de la récupération des favoris",
        status: "KO",
        error: error.message,
      });
    }
  }

  async deleteFavorite(
    req: ControllerRequest,
    res: Response
  ): Promise<Response> {
    try {
      const { favorite_id } = req.body;
      const compte_id = Number(req.id);
      console.log(favorite_id);

      if (!compte_id || !favorite_id) {
        return res
          .status(400)
          .json({ message: "ID du compte ou ID du favori invalide" });
      }

      const result = await prisma.favori.deleteMany({
        where: {
          compte_id,
          id: favorite_id,
        },
      });

      if (result.count === 0) {
        return res
          .status(404)
          .json({ message: "Favori non trouvé ou déjà supprimé" });
      }

      return res
        .status(200)
        .json({ message: "Favori supprimé avec succès", status: "OK" });
    } catch (error: any) {
      return res.status(500).json({
        message: "Erreur lors de la suppression du favori",
        status: "KO",
        error: error.message,
      });
    }
  }

  async signaler(req: ControllerRequest, res: Response): Promise<Response> {
    try {
      const { reporter_id, motif } = req.body;
      const compte_id = Number(req.id);

      if (!compte_id) {
        return res.status(400).json({ message: "ID utilisateur invalide" });
      }

      const compte = await prisma.compte.findUnique({
        where: { id: compte_id },
      });
      if (!compte) {
        return res
          .status(404)
          .json({ message: "Compte non trouvé", status: "KO" });
      }

      const rapport = await prisma.report.create({
        data: {
          reporter_id: compte_id, // Utilisez `compte_id` pour `reporter_id`
          reported_id: reporter_id,
          motif,
        },
      });

      return res
        .status(201)
        .json({ message: "Compte signalé avec succès", rapport, status: "OK" });
    } catch (error: any) {
      return res.status(500).json({
        message: "Erreur lors du signalement du compte",
        status: "KO",
        error: error.message,
      });
    }
  }

  async ajoutComment(req: ControllerRequest, res: Response): Promise<Response> {
    const { content, post_id } = req.body;
    const idCompte = Number(req.id);

    if (!content || !post_id) {
      return res
        .status(400)
        .json({ message: "Données invalides", status: "KO" });
    }

    try {
      const newComment = await prisma.comment.create({
        data: {
          content,
          compte_id: idCompte,
          post_id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      const post = await prisma.post.update({
        where: { id: post_id },
        data: {
          comments: {
            connect: { id: newComment.id },
          },
          updatedAt: new Date(),
        },
      });

      if (!post) {
        return res
          .status(404)
          .json({ message: "Post non trouvé", status: "KO" });
      }

      return res.json({
        comment: newComment,
        message: "Commentaire ajouté",
        status: "OK",
      });
    } catch (error: any) {
      return res.status(500).json({ message: "Erreur serveur", status: "KO" });
    }
  }

  async reponseComment(
    req: ControllerRequest,
    res: Response
  ): Promise<Response> {
    const { content, comment_id } = req.body;
    const idCompte = req.id;

    if (!content || !comment_id) {
      return res
        .status(400)
        .json({ message: "Données invalides", status: "KO" });
    }

    try {
      const newCommentResponse = await prisma.commentResponse.create({
        data: {
          content,
          comment_id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      await prisma.comment.update({
        where: { id: comment_id },
        data: {
          updatedAt: new Date(),
        },
      });

      return res.json({
        commentResponse: newCommentResponse,
        message: "Réponse ajoutée",
        status: "OK",
      });
    } catch (error: any) {
      return res.status(500).json({ message: "Erreur serveur", status: "KO" });
    }
  }

  async deleteComment(
    req: ControllerRequest,
    res: Response
  ): Promise<Response> {
    const { comment_id } = req.body;
    const idCompte = req.id;

    try {
      const commentDelete = await prisma.comment.delete({
        where: { id: comment_id },
      });

      if (!commentDelete) {
        return res
          .status(404)
          .json({ message: "Commentaire non trouvé", status: "KO" });
      }

      return res.json({ message: "Commentaire supprimé", status: "OK" });
    } catch (error: any) {
      return res.status(500).json({
        message: "Erreur lors de la suppression du commentaire",
        status: "KO",
      });
    }
  }

  async getMyFollowersPost(compteId: number): Promise<any[]> {
    const myFollowers = await prisma.follow.findMany({
      where: {
        AND: [{ follower_id: compteId }, { status: "FOLLOWED" }],
      },
      include: {
        followed: true,
      },
    });

    const myFollowersCompte = myFollowers
      .filter((follow) => follow.followed?.etat === "active")
      .map((follow) => follow.followed_id);

    const myFollowersTailleur = await prisma.tailleur.findMany({
      where: {
        compte_id: { in: myFollowersCompte },
      },
    });

    const myFollowersTailleurIds = myFollowersTailleur.map(
      (tailleur) => tailleur.id
    );

    const myFollowersPost = await prisma.post.findMany({
      where: {
        AND: [
          { tailleur_id: { in: myFollowersTailleurIds } },
          { status: "PUBLIE" },
        ],
      },
      include: { tags: true },
    });
    //
    return myFollowersPost;
  }

  async getMyFollowersRecentStatus(compteId: number): Promise<any[]> {
    const now = Date.now();
    const twentyFourHoursInMs = 24 * 60 * 60 * 1000;

    const myFollowers = await prisma.follow.findMany({
      where: {
        follower_id: compteId,
      },
      include: {
        followed: true,
      },
    });

    const myFollowersCompte = myFollowers
      .filter((follow) => follow.followed?.etat === "active")
      .map((follow) => follow.followed_id);

    const myFollowersTailleur = await prisma.tailleur.findMany({
      where: {
        compte_id: { in: myFollowersCompte },
      },
    });

    const myFollowersTailleurIds = myFollowersTailleur.map(
      (tailleur) => tailleur.id
    );

    const myFollowersStatus = await prisma.status.findMany({
      where: {
        tailleur_id: { in: myFollowersTailleurIds },
      },
    });

    const myFollowersRecentStatus = myFollowersStatus.filter((status) => {
      const createdAtMs = new Date(status.createdAt).getTime();
      const differenceInMs = now - createdAtMs;
      return differenceInMs <= twentyFourHoursInMs;
    });

    return myFollowersRecentStatus;
  }

  async getNewsFeed(req: ControllerRequest, res: Response) {
    const compte_id = parseInt(req.id!);
    const now = Date.now();
    const twentyFourHoursInMs = 24 * 60 * 60 * 1000;

    try {
      const compte = await prisma.compte.findUnique({
        where: { id: compte_id },
      });

      if (!compte) {
        return res
          .status(404)
          .json({ message: "Compte non trouvé", status: "KO" });
      }

      if (compte.role === "tailleur") {
        const oneDayAgo = new Date(Date.now() - twentyFourHoursInMs);

        const tailleur = await prisma.tailleur.findUnique({
          where: { compte_id },
        });

        const myOwnPost = await prisma.post.findMany({
          where: {
            AND: [{ tailleur_id: tailleur?.id }, { status: "PUBLIE" }],
          },
          include: { tags: true },
        });

        const myOwnStatus = await prisma.status.findMany({
          where: { tailleur_id: tailleur?.id },
        });

        const myOwnRecentStatus = myOwnStatus.filter((status) => {
          const createdAtMs = new Date(status.createdAt).getTime();
          const differenceInMs = now - createdAtMs;
          return differenceInMs <= twentyFourHoursInMs;
        });

        const myFollowersPost = await this.getMyFollowersPost(compte_id);

        // return res.json(myFollowersPost);

        const posts = myOwnPost.concat(myFollowersPost);

        const myFollowersRecentStatus = await this.getMyFollowersRecentStatus(
          compte_id
        );
        const recentStatus = myFollowersRecentStatus.concat(myOwnRecentStatus);

        return res.json({
          posts,
          recentStatus,
          message: "Fil d'actualité chargé",
          status: "OK",
        });
      } else {
        const posts = await this.getMyFollowersPost(compte_id);
        const recentStatus = await this.getMyFollowersRecentStatus(compte_id);
        return res.json({
          posts,
          recentStatus,
          message: "Fil d'actualité chargé",
          status: "OK",
        });
      }
    } catch (err) {
      if (err instanceof Error) {
        return res.status(500).json({ message: err.message, status: "KO" });
      }
    }
  }

  async ShareNb(req: ControllerRequest, res: Response) {
    try {
      const postId = parseInt(req.id!);

      const post = await prisma.post.update({
        where: { id: postId },
        data: { shareNb: { increment: 1 } },
        select: { shareNb: true },
      });

      if (!post) {
        return res
          .status(404)
          .json({ message: "Post non trouvé après mise à jour", status: "KO" });
      }

      return res.status(200).json({
        message: "Partage réussi.",
        data: { shareNb: post.shareNb },
        status: "OK",
      });
    } catch (error: any) {
      return res.status(500).json({
        message: "Erreur lors du partage.",
        error: error.message,
        status: "KO",
      });
    }
  }

  async ViewsNb(req: ControllerRequest, res: Response) {
    try {
      const postId = parseInt(req.id!);

      const post = await prisma.post.update({
        where: { id: postId },
        data: { viewNb: { increment: 1 } },
        select: { viewNb: true },
      });

      return res.json({ message: "Post Vu", status: "OK", post });
    } catch (error: any) {
      // Vérifie si l'erreur est liée à l'absence du post
      if (error.code === "P2025") {
        return res
          .status(404)
          .json({ message: "Post non trouvé", status: "KO" });
      }
      return res.status(500).json({ message: error.message, status: "KO" });
    }
  }

  async createCommande(req: ControllerRequest, res: Response) {
    try {
      // const id = req.id;
      const id = parseInt(req.id as string, 10);

      const compte = await prisma.compte.findUnique({
        where: { id },
      });

      const user = await prisma.user.findUnique({
        where: { id: compte?.user_id },
      });

      if (compte?.role === "tailleur") {
        const tailleur = await prisma.tailleur.findUnique({
          where: { compte_id: id },
        });

        const posts = await prisma.post.findMany({
          where: {
            AND: [{ tailleur_id: tailleur?.id }, { status: "PUBLIE" }],
          },
        });
    }
  }


        if (!tailleur || !user || !compte) {
          return res.status(404).json({
            message: "Impossible de charger le profile demandé",
            status: "KO",
          });
        }

        return res.json({ tailleur, user, compte, posts, status: "OK" });
      }


  async accueilSearch(req: ControllerRequest, res: Response) {
    try {
      const { searchText } = req.body;
      const regex = new RegExp(searchText, "i");

      // Rechercher des utilisateurs par prénom ou nom de famille
      const users = await prisma.user.findMany({
        where: {
          OR: [
            { lastname: { contains: searchText } },
            { firstname: { contains: searchText } },
          ],
        },
      });

      const userIds = users.map((user) => user.id);

      // Rechercher des comptes par identifiant ou par l'ID utilisateur
      const comptes = await prisma.compte.findMany({
        where: {
          OR: [
            { user_id: { in: userIds } },
            { identifiant: { contains: searchText } },
          ],
          etat: "active",
        },
      });

      // Rechercher des posts par titre ou contenu
      const posts = await prisma.post.findMany({
        where: {
          OR: [
            {
              content: { contains: searchText },
            },
            {
              title: { contains: searchText },
            },
            {
              tags: {
                some: {
                  libelle: { contains: searchText },
                },
              },
            },
          ],
        },
        include: { tags: true },
      });

      return res.json({
        comptes,
        posts,
        message: "Résultats de la recherche",
        status: "OK",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erreur lors de la recherche", status: "KO" });
    }
  }

  async follow(req: ControllerRequest, res: Response) {
    try {
      const { idFollowedCompte } = req.body;
      const idCompte = req.id ? parseInt(req.id, 10) : undefined;

      if (idCompte === undefined) {
        return res
          .status(400)
          .json({ message: "ID de compte invalide", status: "KO" });
      }

      // Create a new follow relationship
      const follow = await prisma.follow.create({
        data: {
          followed_id: idFollowedCompte,
          follower_id: idCompte,
          status: "FOLLOWED", // Ajout du champ status requis
        },
      });

      if (!follow) {
        return res
          .status(500)
          .json({ message: "Le follow a échoué", status: "KO" });
      }

      // Update the followed account
      await prisma.compte.update({
        where: { id: idFollowedCompte },
        data: {
          followeds: {
            connect: { id: follow.id },
          },
          updatedAt: new Date(),
        },
      });

      // Update the follower account
      await prisma.compte.update({
        where: { id: idCompte },
        data: {
          followers: {
            connect: { id: follow.id },
          },
          updatedAt: new Date(),
        },
      });

      return res.json({
        message: "Vous avez suivi l'utilisateur",
        status: "OK",
      });
    } catch (error) {
      if (error instanceof Error) {
        return res
          .status(500)
          .json({ message: "Error adding measure", error: error.message });
      }
    }
  }

  async addNote(req: ControllerRequest, res: Response) {
    try {
      const { noter_id, noted_id, note } = req.body;

      const notes = await prisma.note.create({
        data: {
          noter_id: parseInt(noter_id, 10),
          noted_id: parseInt(noted_id, 10),
          note: note, // Assurez-vous que la valeur est correcte
        },
      });

      return res
        .status(201)
        .json({ message: "Note ajoutée avec succès.", data: notes });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }
    }
  }

  async userProfile(req: ControllerRequest, res: Response) {
    try {
      const id = parseInt(req.id!);
      const compte = await prisma.compte.findUnique({
        where: { id },
      });
      const user = await prisma.user.findUnique({
        where: { id: compte?.user_id },
      });
      if (compte?.role === "tailleur") {
        const tailleur = await prisma.tailleur.findUnique({
          where: { compte_id: id },
        });
        const posts = await prisma.post.findMany({
          where: {
            AND: [{ tailleur_id: tailleur?.id }, { status: "PUBLIE" }],
          },
        });

        const notes = await prisma.note.findMany({
          where: {
            noted_id: id,
          },
          select: {
            note: true,
          },
        });

        const followeds = await prisma.follow.findMany({
          where: {
            AND: [{ followed_id: id }, { status: "FOLLOWED" }],
          },
        });

        const followers = await prisma.follow.findMany({
          where: {
            AND: [{ follower_id: id }, { status: "FOLLOWED" }],
          },
        });

        const totalDesNotes = notes.reduce((somme, note) => {
          return somme + parseFloat(note.note); // Convertit chaque note en nombre et fait la somme
        }, 0);

        const noteToShow = totalDesNotes / notes.length || 0;

        if (!tailleur || !user || !compte) {
          return res.status(404).json({
            message: "Impossible de charger le profile demandé",
            status: "KO",
          });
        }
        return res.json({
          tailleur,
          user,
          compte,
          posts,
          noteToShow,
          nbrAbonnee: followers.length,
          nbrAbonnement: followeds.length,
          message: "Donnée du profil retrouvé",
          status: "OK",
        });
      }
      const client = await prisma.client.findUnique({
        where: { compte_id: id },
      });
      if (!client || !user || !compte) {
        return res.status(404).json({
          message: "Impossible de charger le profile demandé",
          status: "KO",
        });
      }
      const followersPosts = await this.getMyFollowersPost(compte.id);
      return res.json({ client, user, compte, followersPosts, status: "OK" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erreur interne du serveur", status: "KO" });
    }
  }

  async getPostById(req: ControllerRequest, res: Response) {
    try {
      const postId = parseInt(req.params.id, 10); // Conversion de l'ID en nombre

      const post = await prisma.post.findUnique({
        where: { id: postId },
        include: { tailleur: true }, // Inclusion de la relation 'tailleur' à la place de 'author'
      });

      if (!post) {
        return res
          .status(404)
          .json({ message: "Post non trouvé", status: "KO" });
      }

      return res.status(200).json({ post, status: "OK" });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Erreur interne du serveur", status: "KO" });
    }
  }

  async deleteResponseComment(
    req: ControllerRequest,
    res: Response
  ): Promise<Response> {
    const { idCommentResponse } = req.body;

    try {
      const commentResponse = await prisma.commentResponse.delete({
        where: { id: idCommentResponse },
      });

      if (!commentResponse) {
        return res.status(404).json({
          message: "Réponse de commentaire non trouvée",
          status: "KO",
        });
      }

      return res.json({
        message: "Réponse de commentaire supprimée",
        status: "OK",
      });
    } catch (error: any) {
      return res.status(500).json({
        message: "Erreur lors de la suppression de la réponse de commentaire",
        status: "KO",
      });
    }
  }

  async getSomeProfile(req: ControllerRequest, res: Response) {
    const { identifiant } = req.params;
    const idCompte = Number(req.id); // Convert idCompte to a number

    if (isNaN(idCompte)) {
      return res
        .status(400)
        .json({ message: "ID de compte invalide", status: "KO" });
    }

    try {
      // Fetch the Compte based on identifiant
      const compte = await prisma.compte.findUnique({
        where: { identifiant },
      });

      // Fetch the User associated with the Compte
      const user = await prisma.user.findUnique({
        where: { id: compte?.user_id }, // Corrected to user_id
      });

      // If the Compte's role is 'tailleur'
      if (compte?.role === "tailleur") {
        const tailleur = await prisma.tailleur.findUnique({
          where: { compte_id: idCompte }, // Corrected to compte_id, now a number
        });

        // If any of the required entities are not found
        if (!tailleur || !user || !compte) {
          return res.status(404).json({
            message: "Impossible de charger le profile demandé",
            status: "KO",
          });
        }

        // Return the Tailleur's profile
        return res.json({ tailleur, user, compte, status: "OK" });
      }

      // If the Compte's role is not 'tailleur', assume it is a 'client'
      const client = await prisma.client.findUnique({
        where: { compte_id: idCompte }, // Corrected to compte_id, now a number
      });

      // If any of the required entities are not found
      if (!client || !user || !compte) {
        return res.status(404).json({
          message: "Impossible de charger le profile demandé",
          status: "KO",
        });
      }

      // Return the Client's profile
      return res.json({ client, user, compte, status: "OK" });
    } catch (err) {
      // Handle any errors that occur during the process
      return res
        .status(500)
        .json({ message: "Erreur interne du serveur", status: "KO" });
    }
  }


  async bloquer(req: ControllerRequest, res: Response) {
    try {
      const { userIdToBlock } = req.body; // L'ID de l'utilisateur à bloquer
      const tailleurId = req.id; // L'ID de l'utilisateur connecté (doit être un tailleur)

      if (!tailleurId) {
        return res
          .status(401)
          .json({ message: "Utilisateur non authentifié", status: "KO" });
      }

      // Vérifier si le tailleur est connecté
      const tailleur = await prisma.compte.findUnique({
        where: { id: parseInt(tailleurId, 10) },
        // Assuming the role is stored as a string in the 'role' field
        select: { role: true },
      });

      if (!tailleur || tailleur.role !== "tailleur") {
        return res.status(403).json({
          message:
            "Accès refusé. Seuls les tailleurs peuvent bloquer des utilisateurs.",
          status: "KO",
        });
      }

      // Vérifier si l'utilisateur à bloquer existe
      const userToBlock = await prisma.compte.findUnique({
        where: { id: parseInt(userIdToBlock, 10) },
      });

      if (!userToBlock) {
        return res.status(404).json({
          message: "Utilisateur à bloquer introuvable.",
          status: "KO",
        });
      }

      // Vérifier si le tailleur suit l'utilisateur à bloquer
      const isFollowed = await prisma.follow.findFirst({
        where: {
          follower_id: parseInt(tailleurId, 10),
          followed_id: parseInt(userIdToBlock, 10),
        },
      });

      if (!isFollowed) {
        return res.status(403).json({
          message:
            "Vous ne pouvez bloquer que des utilisateurs que vous suivez.",
          status: "KO",
        });
      }

      // Créer l'enregistrement de blocage
      const newBloquer = await prisma.bloquer.create({
        data: {
          blocker_id: parseInt(tailleurId, 10),
          blocked_id: parseInt(userIdToBlock, 10),
        },
      });

      res.status(200).json({
        message: "L'utilisateur a été bloqué avec succès.",
        status: "OK",
      });
    } catch (error) {
      console.error("Erreur lors du blocage de l'utilisateur:", error);
      res.status(500).json({
        message: "Erreur lors du blocage de l'utilisateur",
        status: "KO",
      });
    }
  }

  async getSuggestions(req: ControllerRequest, res: Response) {
    const idCompte = Number(req.id);

    try {
      if (!idCompte) {
        return res
          .status(401)
          .json({ message: "Utilisateur non authentifié", status: "KO" });
      }


      const compte = await prisma.compte.findUnique({
        where: { id: idCompte },
      });

      if (!compte) {
        return res
          .status(404)
          .json({ message: "Utilisateur introuvable", status: "KO" });
      }

      const comptesNonSuivis = await prisma.compte.findMany({
        where: {
          AND: [
            {
              id: {
                notIn: (
                  await prisma.follow.findMany({
                    where: { follower_id: idCompte },
                    select: { followed_id: true },
                  })
                ).map((follow) => follow.followed_id),
              },
            },
            {
              id: {
                not: idCompte, // Exclure le compte connecté lui-même
              },
            },
          ],
        },
        select: {
          id: true,
          email: true,
          identifiant: true,
          user: {
            select: {
              firstname: true,
              lastname: true,
              picture: true,
            },
          },
          noteds: {
            select: {
              note: true,
            },
          },
        },
      });

      const comptesAvecSommeDesNotes = comptesNonSuivis.map((compte) => {
        const sommeDesNotes = compte.noteds.reduce(
          (total, note) => total + parseInt(note.note, 10),
          0
        );
        return {
          ...compte,
          sommeDesNotes,
        };
      });

      comptesAvecSommeDesNotes.sort(
        (a, b) => b.sommeDesNotes - a.sommeDesNotes
      );

      return res.status(200).json({
        suggestions: comptesAvecSommeDesNotes,
        message: "liste de suggestions",
        status: "OK",
      });
    } catch (error) {
      res.status(500).json({
        message: "Erreur lors de la récupération des suggestions",
        status: "KO",
      });
    }
  }
}

export default new ClientController();
