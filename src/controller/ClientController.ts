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
import { io } from "../app.js";
import { log } from "console";

// const socket = io("http://localhost:5000");

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

  // Ajouter un like
  async addLike(req: ControllerRequest, res: Response) {
    try {
      const postId = parseInt(req.body.post_id);
      const compteId = parseInt(req.body.compte_id);

      if (isNaN(postId) || isNaN(compteId)) {
        return res
          .status(400)
          .json({ message: "ID de post ou de compte invalide", status: "KO" });
      }

      const existingLike = await prisma.like.findFirst({
        where: { post_id: postId, compte_id: compteId },
      });

      if (existingLike) {
        if (existingLike.etat === "LIKE") {
          await prisma.like.delete({ where: { id: existingLike.id } });
          console.log(
            `Like supprimé par l'utilisateur ${compteId} pour le post ${postId}`
          );
          return res
            .status(200)
            .json({ message: "Like supprimé avec succès", status: "OK" });
        } else if (existingLike.etat === "DISLIKE") {
          const updatedLike = await prisma.like.update({
            where: { id: existingLike.id },
            data: { etat: "LIKE", updatedAt: new Date() },
          });

          const notification = await prisma.notification.create({
            data: {
              content: "a aimé votre post",
              compte_id: postId,
              notifier_id: compteId,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          });

          const notificationResult = await prisma.notification.findUnique({
            where: { id: notification.id },
            include: {
              notifier: {
                include: {
                  user: true,
                },
              },
            },
          });

          io.emit("newFollow", notificationResult);

          console.log(
            `État changé de dislike à like par l'utilisateur ${compteId} pour le post ${postId}`
          );

          return res.status(200).json({
            message: "État changé de dislike à like",
            data: updatedLike,
            status: "OK",
          });
        }
      } else {
        const newLike = await prisma.like.create({
          data: {
            post_id: postId,
            compte_id: compteId,
            etat: "LIKE",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });

        const notification = await prisma.notification.create({
          data: {
            content: "a aimé votre post",
            compte_id: postId,
            notifier_id: compteId,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });

        const notificationResult = await prisma.notification.findUnique({
          where: { id: notification.id },
          include: {
            notifier: {
              include: {
                user: true,
              },
            },
          },
        });

        io.emit("newFollow", notificationResult);

        console.log(
          `Nouveau like ajouté par l'utilisateur ${compteId} pour le post ${postId}`
        );

        return res.status(201).json({
          message: "Like ajouté avec succès",
          data: newLike,
          status: "OK",
        });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: err instanceof Error ? err.message : "Erreur inconnue",
        status: "KO",
      });
    }
  }

  async getAllFollowers(req: ControllerRequest, res: Response) {
    try {
      // On récupère l'utilisateur connecté à partir du token (supposé être stocké dans req.id)
      const idCompte = parseInt(req.id as string, 10);

      // Requête pour récupérer les détails du compte utilisateur
      const userAccount = await prisma.compte.findUnique({
        where: { id: idCompte }, // Récupérer le compte utilisateur
        include: { user: true }, // Inclure les détails de l'utilisateur
      });

      // Vérifier si le compte utilisateur existe
      if (!userAccount) {
        return res
          .status(404)
          .json({ message: "Compte utilisateur non trouvé", status: "KO" });
      }

      // Requête pour récupérer les followers de l'utilisateur connecté (follower_id)
      const followers = await prisma.follow.findMany({
        where: { followed_id: idCompte }, // Filtrer par ceux qui suivent l'utilisateur connecté
        include: {
          follower: {
            // Inclure les détails du follower (celui qui suit)
            include: {
              user: true, // Inclure les détails de l'utilisateur qui est le follower
            },
          },
        },
      });

      // Vérifier si des followers existent
      if (followers.length === 0) {
        return res.json({
          userAccount, // Détails du compte utilisateur
          followers: [], // Liste vide des followers
          message: "Aucun follower trouvé",
          status: "OK",
        });
      }

      return res.json({
        userAccount, // Détails du compte utilisateur
        followers, // Liste des followers avec leurs détails
        message: "Followers récupérés avec succès",
        status: "OK",
      });
    } catch (error) {
      // Meilleure gestion des erreurs pour un retour d'information plus précis
      if (error instanceof Error) {
        return res.status(500).json({
          message: "Erreur lors de la récupération des followers",
          error: error.message,
        });
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
            etat: "DISLIKE",
            createdAt: new Date(),
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
        where: { compte_id: userId },
        include: {
          notifier: {
            include: {
              user: true,
            },
          },
        },
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

      const messageForRefresh = await prisma.message.findUnique({
        where: { id: newMessage.id },
        include: {
          messager: {
            include: {
              user: true,
            },
          },
          messaged: {
            include: {
              user: true,
            },
          },
        },
      });

      io.emit("newMessage", messageForRefresh);

      res.status(201).json({ message: "Message envoyé", status: newMessage });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message, status: "KO" });
      }
    }
  }

  async getMesssage(req: ControllerRequest, res: Response): Promise<Response> {
    const { id } = Number(req.id!);
    try {
      // Récupération de l'ID utilisateur à partir des paramètres de la requête
      const userId = Number(req.params.user_id);

      // Vérification que l'ID utilisateur est valide
      if (isNaN(userId)) {
        return res
          .status(400)
          .json({ message: "ID utilisateur invalide", status: "KO" });
      }

      const messages = await prisma.message.findMany({
        where: {
          OR: [
            {
              messager_id: id, // Connected user sent the message
              messaged_id: userId, // Target user received the message
            },
            {
              messager_id: userId, // Target user sent the message
              messaged_id: id, // Connected user received the message
            },
          ],
        },
        include: {
          messager: {
            include: {
              user: true,
            },
          },
          messaged: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      // Vérification si l'utilisateur a des messages
      if (messages.length === 0) {
        return res.status(404).json({
          message: "Aucune discussion trouvée pour cet utilisateur",
          status: "KO",
        });
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

      // Vérifiez si le favori existe déjà
      const existingFavorite = await prisma.favori.findFirst({
        where: {
          post_id: post_id,
          compte_id: compte_id,
        },
      });

      if (existingFavorite) {
        // Si le favori existe, le supprimer
        await prisma.favori.delete({
          where: {
            id: existingFavorite.id, // Supprimez par ID
          },
        });
        return res
          .status(200)
          .json({ message: "Favori supprimé", status: "OK" });
      } else {
        // Si le favori n'existe pas, l'ajouter
        const newFavorite = await prisma.favori.create({
          data: {
            post_id,
            compte_id,
            createdAt: new Date(),
          },
        });
        return res.status(201).json({ favorite: newFavorite, status: "OK" });
      }
    } catch (err: any) {
      return res.status(500).json({ message: err.message, status: "KO" });
    }
  }

  async getAllFavorites(
    req: ControllerRequest,
    res: Response
  ): Promise<Response> {
    try {
      const id = parseInt(req.id!);
      console.log(id);

      if (!id) {
        return res.status(400).json({ message: "ID utilisateur invalide" });
      }

      const user = await prisma.compte.findUnique({
        where: { id: id },
      });

      console.log(user);

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
      const compte_id = parseInt(req.id!);

      if (!compte_id) {
        return res
          .status(400)
          .json({ message: "ID du compte ou ID du favori invalide" });
      }

      const result = await prisma.favori.deleteMany({
        where: {
          compte_id: compte_id,
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
      const compte_id = parseInt(req.id!);

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

      // Créer une notification pour le propriétaire du post
      const notification = await prisma.notification.create({
        data: {
          content: "a commenté votre post",
          compte_id: post_id, // ID du compte qui reçoit la notification
          notifier_id: idCompte, // ID de l'utilisateur qui effectue l'action
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Récupérer les détails de la notification et émettre un événement pour informer le propriétaire du post
      const notificationResult = await prisma.notification.findUnique({
        where: { id: notification.id },
        include: {
          notifier: {
            include: {
              user: true,
            },
          },
        },
      });

      io.emit("newFollow", notificationResult);

      return res.json({
        comment: newComment,
        message: "Commentaire ajouté",
        status: "OK",
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: err instanceof Error ? err.message : "Erreur inconnue",
        status: "KO",
      });
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
      include: {
        tags: true,
        tailleur: {
          include: {
            compte: {
              include: {
                user: true, // Include user information related to your own compte
              },
            },
          },
        },
      },
    });
    //
    return myFollowersPost;
  }

  async getMyFollowersRecentStatus(compteId: number): Promise<any[]> {
    const now = Date.now();
    const twentyFourHoursInMs = 24 * 60 * 60 * 1000;

    // Step 1: Find all followers of the user by compteId
    const myFollowers = await prisma.follow.findMany({
      where: {
        follower_id: compteId,
      },
      include: {
        followed: {
          include: {
            user: true, // Include user information related to the Compte
          },
        },
      },
    });

    // Step 2: Filter only active followers
    const myFollowersCompte = myFollowers
      .filter((follow) => follow.followed?.etat === "active")
      .map((follow) => follow.followed_id);

    // Step 3: Find the followers that are also tailors (tailleurs)
    const myFollowersTailleur = await prisma.tailleur.findMany({
      where: {
        compte_id: { in: myFollowersCompte },
      },
    });

    const myFollowersTailleurIds = myFollowersTailleur.map(
      (tailleur) => tailleur.id
    );

    // Step 4: Find all statuses of those tailors
    const myFollowersStatus = await prisma.status.findMany({
      where: {
        tailleur_id: { in: myFollowersTailleurIds },
      },
      include: {
        tailleur: {
          include: {
            compte: {
              include: {
                user: true, // Include user information here as well
              },
            },
          },
        },
        status_like: {
          include: {
            compte: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    // Step 5: Filter statuses created within the last 24 hours
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
          include: {
            tags: true,
            tailleur: {
              include: {
                compte: {
                  include: {
                    user: true, // Include user information related to your own compte
                  },
                },
              },
            },
          },
        });

        const myOwnStatus = await prisma.status.findMany({
          where: { tailleur_id: tailleur?.id },
          include: {
            tailleur: {
              include: {
                compte: {
                  include: {
                    user: true, // Include user information related to your own compte
                  },
                },
              },
            },
            status_like: {
              include: {
                compte: {
                  include: {
                    user: true,
                  },
                },
              },
            },
          },
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
    // try {
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

  async unfollow(req: ControllerRequest, res: Response) {
    try {
      const { idFollowedCompte } = req.body;
      const idCompte = req.id ? parseInt(req.id, 10) : undefined;

      if (idCompte === undefined) {
        return res
          .status(400)
          .json({ message: "ID de compte invalide", status: "KO" });
      }

      // Vérifier si la relation de suivi existe
      const follow = await prisma.follow.findUnique({
        where: {
          follower_id_followed_id: {
            follower_id: idCompte,
            followed_id: idFollowedCompte,
          },
        },
      });

      // Si la relation de suivi n'existe pas, renvoyer une erreur 404
      if (!follow) {
        return res
          .status(404)
          .json({ message: "Relation de suivi non trouvée", status: "KO" });
      }

      // Supprimer la relation de suivi
      await prisma.follow.delete({
        where: {
          id: follow.id,
        },
      });

      // Créer une notification pour l'unfollow (optionnel)
      await prisma.notification.create({
        data: {
          content: `Vous a unfollow`,
          compte_id: idFollowedCompte,
          notifier_id: idCompte,
          createdAt: new Date(),
        },
      });

      return res.json({
        message: "Vous avez unfollow l'utilisateur",
        status: "OK",
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({
          message: "Erreur lors de la suppression du suivi",
          error: error.message,
        });
      }
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

      // Vérifier si l'utilisateur tente de suivre son propre compte
      if (idCompte === idFollowedCompte) {
        return res.status(400).json({
          message: "Vous ne pouvez pas suivre votre propre compte",
          status: "KO",
        });
      }

      // Vérifier si l'utilisateur suit déjà ce compte
      const existingFollow = await prisma.follow.findUnique({
        where: {
          follower_id_followed_id: {
            follower_id: idCompte,
            followed_id: idFollowedCompte,
          },
        },
      });

      if (existingFollow) {
        return res
          .status(400)
          .json({ message: "Vous suivez déjà ce compte", status: "KO" });
      }

      // Créer une nouvelle relation de suivi
      const follow = await prisma.follow.create({
        data: {
          followed_id: idFollowedCompte,
          follower_id: idCompte,
          status: "FOLLOWED",
        },
      });

      if (!follow) {
        return res
          .status(500)
          .json({ message: "Le follow a échoué", status: "KO" });
      }

      // Mettre à jour le compte suivi
      await prisma.compte.update({
        where: { id: idFollowedCompte },
        data: {
          followeds: {
            connect: { id: follow.id },
          },
          updatedAt: new Date(),
        },
      });

      // Mettre à jour le compte follower
      await prisma.compte.update({
        where: { id: idCompte },
        data: {
          followers: {
            connect: { id: follow.id },
          },
          updatedAt: new Date(),
        },
      });

      const notification = await prisma.notification.create({
        data: {
          content: `Vous a suivi`,
          compte_id: idFollowedCompte,
          notifier_id: idCompte,
          createdAt: new Date(),
        },
      });

      const notificationResult = await prisma.notification.findUnique({
        where: {
          id: notification.id,
        },
        include: {
          notifier: {
            include: {
              user: true,
            },
          },
        },
      });

      io.emit("newFollow", notificationResult);

      return res.json({
        message: "Vous avez suivi l'utilisateur",
        status: "OK",
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({
          message: "Erreur lors de l'ajout du suivi",
          error: error.message,
        });
      }
    }
  }

  async addNote(req: ControllerRequest, res: Response) {
    try {
      // Récupérer l'ID de l'utilisateur connecté à partir de req.id (déjà authentifié via middleware)
      const noter_id = Number(req.id);

      // Récupérer les données de la requête
      const { noted_id, note } = req.body;

      // Vérifier que le tailleur (noted_id) existe
      const tailleurExists = await prisma.tailleur.findUnique({
        where: {
          id: Number(noted_id),
        },
      });

      if (!tailleurExists) {
        return res.status(404).json({ message: "Le tailleur n'existe pas." });
      }

      // Vérifier que la note est valide (par exemple, entre 1 et 5)
      if (note < 1 || note > 5) {
        return res
          .status(400)
          .json({ message: "La note doit être comprise entre 1 et 5." });
      }

      // Ajouter la note dans la base de données
      const newNote = await prisma.note.create({
        data: {
          noter_id: noter_id, // ID de l'utilisateur connecté
          noted_id: Number(noted_id), // ID du tailleur à noter
          note: note, // La valeur de la note
        },
      });

      // Réponse de succès
      return res.status(201).json({
        message: "Note ajoutée avec succès.",
        data: newNote,
      });
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
    const connectedUserId = Number(req.id);

    if (isNaN(connectedUserId)) {
      return res
        .status(400)
        .json({ message: "ID de compte invalide", status: "KO" });
    }

    try {
      // Fetch the Compte based on identifiant or id
      const targetCompte = await prisma.compte.findFirst({
        where: {
          OR: [
            { identifiant: identifiant },
            {
              id: isNaN(Number(identifiant)) ? undefined : Number(identifiant),
            },
          ],
        },
        include: {
          user: true,
          tailleur: true,
          client: true,
        },
      });

      if (!targetCompte) {
        return res
          .status(404)
          .json({ message: "Profil non trouvé", status: "KO" });
      }

      // Check if the connected user follows the target user
      const follow = await prisma.follow.findFirst({
        where: {
          follower_id: connectedUserId,
          followed_id: targetCompte.id,
          status: "FOLLOWED",
        },
      });

      const isFollowing = !!follow;

      let additionalData = {};
      if (targetCompte.role === "tailleur") {
        const posts = await prisma.post.findMany({
          where: {
            AND: [
              { tailleur_id: targetCompte.tailleur?.id },
              { status: "PUBLIE" },
            ],
          },
        });

        const notes = await prisma.note.findMany({
          where: {
            noted_id: targetCompte.id,
          },
          select: {
            note: true,
          },
        });

        const totalDesNotes = notes.reduce(
          (somme, note) => somme + parseFloat(note.note),
          0
        );
        const noteToShow = notes.length > 0 ? totalDesNotes / notes.length : 0;

        const followeds = await prisma.follow.count({
          where: {
            AND: [{ followed_id: targetCompte.id }, { status: "FOLLOWED" }],
          },
        });

        const followers = await prisma.follow.count({
          where: {
            AND: [{ follower_id: targetCompte.id }, { status: "FOLLOWED" }],
          },
        });

        additionalData = {
          posts,
          noteToShow,
          nbrAbonnee: followers,
          nbrAbonnement: followeds,
        };
      } else if (targetCompte.role === "client") {
        // Add any client-specific data here if needed
      }

      return res.json({
        compte: targetCompte,
        ...additionalData,
        isFollowing,
        message: "Données du profil reçues",
        status: "OK",
      });
    } catch (err) {
      console.error(err);
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
            {
              role: "tailleur",
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

  async getDiscussionData(req: ControllerRequest, res: Response) {
    try {
      // On récupère l'utilisateur connecté à partir du token (supposé être stocké dans req.id)
      const idCompte = parseInt(req.id as string, 10);

      // Requête pour récupérer les détails du compte utilisateur
      const userAccount = await prisma.compte.findUnique({
        where: { id: idCompte }, // Récupérer le compte utilisateur
        include: { user: true }, // Inclure les détails de l'utilisateur
      });

      // Vérifier si le compte utilisateur existe
      if (!userAccount) {
        return res
          .status(404)
          .json({ message: "Compte utilisateur non trouvé", status: "KO" });
      }

      // Requête pour récupérer les followers de l'utilisateur connecté (follower_id)
      const followers = await prisma.follow.findMany({
        where: { followed_id: idCompte }, // Filtrer par ceux qui suivent l'utilisateur connecté
        include: {
          follower: {
            // Inclure les détails du follower (celui qui suit)
            include: {
              user: true, // Inclure les détails de l'utilisateur qui est le follower
            },
          },
        },
      });

      // Vérifier si des followers existent
      if (followers.length === 0) {
        return res.json({
          userAccount, // Détails du compte utilisateur
          followers: [], // Liste vide des followers
          message: "Aucun follower trouvé",
          status: "OK",
        });
      }

      const recentDiscussions = await prisma.message.findMany({
        where: {
          OR: [
            { messager: { followers: { some: { followed_id: idCompte } } } },
            { messaged: { followers: { some: { followed_id: idCompte } } } },
          ],
        },
        include: {
          messager: {
            include: {
              user: true,
            },
          },
          messaged: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      });

      return res.json({
        userAccount, // Détails du compte utilisateur
        followers, // Liste des followers avec leurs détails
        recentDiscussions,
        message: "Followers récupérés avec succès",
        status: "OK",
      });
    } catch (error) {
      // Meilleure gestion des erreurs pour un retour d'information plus précis
      if (error instanceof Error) {
        return res.status(500).json({
          message: "Erreur lors de la récupération des followers",
          error: error.message,
        });
      }
    }
  }

  // add paiement commande
  async addPaiementCommande(req: ControllerRequest, res: Response) {
    const { post_id, qte, taille, montant } = req.body;
    const compte_id = req.id; // ou req.user.id, selon votre implémentation d'authentification

    // Vérification si compte_id est défini
    if (!compte_id) {
      return res.status(400).json({
        message: "Utilisateur non authentifié, compte_id manquant",
        status: "KO",
      });
    }

    try {
      const result = await prisma.$transaction(async (prisma) => {
        // Créer la commande d'abord
        const nouvelleCommande = await prisma.commande.create({
          data: {
            post: { connect: { id: parseInt(post_id) } }, // Lier le produit à la commande
            qte: parseInt(qte),
            taille,
            compte: { connect: { id: parseInt(compte_id) } }, // Lier l'utilisateur connecté
          },
        });

        // Créer le paiement pour la commande nouvellement créée
        const paiement = await prisma.paiement.create({
          data: {
            montant: parseFloat(montant),
            commande: { connect: { id: nouvelleCommande.id } }, // Lier le paiement à la commande créée
          },
        });

        // Mettre à jour la commande avec le paiement
        const updatedCommande = await prisma.commande.update({
          where: { id: nouvelleCommande.id },
          data: {
            paiement: { connect: { id: paiement.id } },
          },
        });

        return { paiement, commande: updatedCommande };
      });

      return res.status(200).json({
        message: "Commande et paiement ajoutés avec succès",
        status: "OK",
        data: result,
      });
    } catch (error) {
      console.error(
        "Erreur lors de l'ajout de la commande ou du paiement:",
        error
      );
      return res.status(400).json({
        message:
          error instanceof Error
            ? error.message
            : "Une erreur est survenue lors de l'ajout de la commande ou du paiement",
        status: "KO",
      });
    }
  }

  async getTaille(req: ControllerRequest, res: Response) {
    const taille = await prisma.taille.findMany();

    if (!taille) {
      return res.status(404).json({
        message: "Taille introuvable",
        status: "KO",
      });
    }
    return res.status(200).json({
      taille: taille,
      message: "Taille récupérée avec succès",
      status: "OK",
    });
  }

  async getAllStatusLikes(req: ControllerRequest, res: Response) {
    const idCompte = parseInt(req.id!);
    const { status_id } = req.params;

    const userAccount = await prisma.compte.findUnique({
      where: { id: idCompte },
    });

    if (!userAccount) {
      return res.status(404).json({
        message: "Utilisateur introuvable",
        status: "KO",
      });
    }

    const statusLikes = await prisma.statusLikes.findMany({
      where: { status_id: parseInt(status_id), compte_id: userAccount.id },
    });

    if (!statusLikes) {
      return res.status(404).json({
        message: "Status likes introuvables",
        status: "KO",
      });
    }

    return res.status(200).json({
      statusLikes: statusLikes,
      message: "Status likes récupérés avec succès",
      status: "OK",
    });
  }

  async updateStatusLikes(req: ControllerRequest, res: Response) {
    const idCompte = parseInt(req.id!);
    const { status_id, compte_id } = req.body;

    const userAccount = await prisma.compte.findUnique({
      where: { id: idCompte },
    });
    if (!userAccount) {
      return res.status(404).json({
        message: "Utilisateur introuvable",
        status: "KO",
      });
    }

    let statusLikes = await prisma.statusLikes.findFirst({
      where: { status_id: parseInt(status_id), compte_id: parseInt(compte_id) },
    });

    if (!statusLikes) {
      statusLikes = await prisma.statusLikes.create({
        data: {
          status_id: parseInt(status_id),
          compte_id: parseInt(compte_id),
        },
      });
    } else {
      await prisma.statusLikes.delete({
        where: {
          status_id_compte_id: {
            status_id: parseInt(status_id),
            compte_id: parseInt(compte_id),
          },
        },
      });
    }
    return res.status(200).json({
      message: "Status like mis à jour avec succès",
      status: "OK",
    });
  }

  async getAllPost(req: ControllerRequest, res: Response) {
    try {
      const posts = await prisma.post.findMany({
        include: {
          comments: {
            include: {
              compte: {
                include: {
                  user: true, // Include user information related to your own compte
                },
              },
            },
          },
          likes: true,
          favoris: true,
          tailleur: {
            include: {
              compte: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" }, // Order by createdAt in descending order
      });

      return res.status(200).json({
        message: "Posts retrieved successfully",
        status: "OK",
        posts: posts.map((post) => ({
          ...post,
          user: {
            firstname: post.tailleur.compte.user.firstname,
            lastname: post.tailleur.compte.user.lastname,
          },
        })),
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Erreur lors de la récupération des posts:", error);
        return res.status(500).json({
          error: "Une erreur est survenue lors de la récupération des posts",
          details: error.message,
        });
      }
    }
  }
}

export default new ClientController();
