import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { createJWT } from '../utils/jwt.js';
import {ControllerRequest} from "../interface/Interface.js";

const prisma = new PrismaClient();

class ClientController {
    constructor() {
        for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
            const val = (this as any)[key];
            if (key !== 'constructor' && typeof val === 'function') {
                (this as any)[key] = val.bind(this);
            }
        }
    }

    async getMyFollowersPost(compteId: number): Promise<any[]> {
        const myFollowers = await prisma.follow.findMany({
            where: {
                AND:[
                    {follower_id: compteId},
                    {status: "FOLLOWED"},
                ]
            },
            include: {
                followed: true,
            },
        });

        const myFollowersCompte = myFollowers
            .filter(follow => follow.followed?.etat === 'active')
            .map(follow => follow.followed_id);

        const myFollowersTailleur = await prisma.tailleur.findMany({
            where: {
                compte_id: { in: myFollowersCompte },
            },
        });

        const myFollowersTailleurIds = myFollowersTailleur.map(tailleur => tailleur.id);

        const myFollowersPost = await prisma.post.findMany({
            where: {
                AND: [
                    {tailleur_id: { in: myFollowersTailleurIds }},
                    {status: 'PUBLIE'}
                ]
            },
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
            .filter(follow => follow.followed?.etat === 'active')
            .map(follow => follow.followed_id);

        const myFollowersTailleur = await prisma.tailleur.findMany({
            where: {
                compte_id: { in: myFollowersCompte },
            },
        });

        const myFollowersTailleurIds = myFollowersTailleur.map(tailleur => tailleur.id);

        const myFollowersStatus = await prisma.status.findMany({
            where: {
                tailleur_id: { in: myFollowersTailleurIds },
            },
        });

        const myFollowersRecentStatus = myFollowersStatus.filter(status => {
            const createdAtMs = new Date(status.createdAt).getTime();
            const differenceInMs = now - createdAtMs;
            return differenceInMs <= twentyFourHoursInMs;
        });

        return myFollowersRecentStatus;
    }


    async getNewsFeed(req: ControllerRequest, res: Response){
        const compte_id = parseInt(req.id!);
        const now = Date.now();
        const twentyFourHoursInMs = 24 * 60 * 60 * 1000;

        try {
            const compte = await prisma.compte.findUnique({
                where: { id: compte_id },
            });

            if (!compte) {
                return res.status(404).json({ message: 'Compte non trouvé', status: 'KO' });
            }

            if (compte.role === 'tailleur') {
                const oneDayAgo = new Date(Date.now() - twentyFourHoursInMs);

                const tailleur = await prisma.tailleur.findUnique({
                    where: { compte_id },
                });

                const myOwnPost = await prisma.post.findMany({
                    where: {
                        AND: [
                            { tailleur_id: tailleur?.id },
                            { status: 'PUBLIE' }
                        ]
                    },
                });

                const myOwnStatus = await prisma.status.findMany({
                    where: { tailleur_id: tailleur?.id },
                });

                const myOwnRecentStatus = myOwnStatus.filter(status => {
                    const createdAtMs = new Date(status.createdAt).getTime();
                    const differenceInMs = now - createdAtMs;
                    return differenceInMs <= twentyFourHoursInMs;
                });

                const myFollowersPost = await this.getMyFollowersPost(compte_id);
                const posts = myOwnPost.concat(myFollowersPost);
                // return res.json(posts);

                const myFollowersRecentStatus = await this.getMyFollowersRecentStatus(compte_id);
                const recentStatus = myFollowersRecentStatus.concat(myOwnRecentStatus);

                return res.json({ posts, recentStatus, message: 'Fil d\'actualité chargé', status: 'OK' });
            } else {
                const posts = await this.getMyFollowersPost(compte_id);
                const recentStatus = await this.getMyFollowersRecentStatus(compte_id);
                return res.json({ posts, recentStatus, message: 'Fil d\'actualité chargé', status: 'OK' });
            }
        } catch (err) {
            if(err instanceof Error) {
                return res.status(500).json({ message: err.message, status: 'KO' });
            }
        }
    }

    // Afficher le profil de l'utilisateur
    async userProfile(req: ControllerRequest, res: Response) {
        try {
            const id = parseInt(req.id!);

            const compte = await prisma.compte.findUnique({
                where: { id },
            });

            const user = await prisma.user.findUnique({
                where: { id: compte?.user_id },
            });

            if (compte?.role === 'tailleur') {
                const tailleur = await prisma.tailleur.findUnique({
                    where: { compte_id: id },
                });

                const posts = await prisma.post.findMany({
                    where: {
                        AND: [
                            { tailleur_id: tailleur?.id },
                            { status: 'PUBLIE' }
                        ]
                    },
                });

                if (!tailleur || !user || !compte) {
                    return res.status(404).json({ message: 'Impossible de charger le profile demandé', status: 'KO' });
                }

                return res.json({ tailleur, user, compte,posts, status: 'OK' });
            }

            const client = await prisma.client.findUnique({
                where: { compte_id: id },
            });

            if (!client || !user || !compte) {
                return res.status(404).json({ message: 'Impossible de charger le profile demandé', status: 'KO' });
            }

            const followersPosts  = await this.getMyFollowersPost(compte.id);

            return res.json({ client, user, compte,followersPosts, status: 'OK' });
        } catch (error) {
            return res.status(500).json({ message: 'Erreur interne du serveur', status: 'KO' });
        }
    }

    // // Rechercher dans l'accueil
    // async accueilSearch(req: ControllerRequest, res: Response) {
    //     try {
    //         const { searchText } = req.body;
    //         const regex = new RegExp(searchText, 'i');
    //
    //         const users = await prisma.user.findMany({
    //             where: {
    //                 OR: [
    //                     { lastname: { contains: searchText, mode: 'insensitive' } },
    //                     { firstname: { contains: searchText, mode: 'insensitive' } }
    //                 ]
    //             }
    //         });
    //
    //         const userIds = users.map(user => user.id);
    //
    //         const comptes = await prisma.compte.findMany({
    //             where: {
    //                 OR: [
    //                     { userId: { in: userIds } },
    //                     { identifiant: { contains: searchText, mode: 'insensitive' } }
    //                 ],
    //                 etat: 'active'
    //             }
    //         });
    //
    //         const posts = await prisma.post.findMany({
    //             where: {
    //                 OR: [
    //                     { content: { contains: searchText, mode: 'insensitive' } },
    //                     { title: { contains: searchText, mode: 'insensitive' } }
    //                 ]
    //             }
    //         });
    //
    //         return res.json({ comptes, posts, message: 'Résultats de la recherche', status: 'OK' });
    //     } catch (error) {
    //         return res.status(500).json({ message: 'Erreur lors de la recherche', status: 'KO' });
    //     }
    // }
    //
    // async getPostById(req: ControllerRequest, res: Response) {
    //     try {
    //         const postId = req.params.id;
    //
    //         const post = await prisma.post.findUnique({
    //             where: { id: postId },
    //             include: { author: true },
    //         });
    //
    //         if (!post) {
    //             return res.status(404).json({ message: 'Post non trouvé', status: 'KO' });
    //         }
    //
    //         return res.status(200).json({ post, status: 'OK' });
    //     } catch (err) {
    //         return res.status(500).json({ message: 'Erreur interne du serveur', status: 'KO' });
    //     }
    // }

}
//
export default new ClientController();