import Post from "../model/Post.js";
import Status from "../model/Status.js";
import Notification from '../model/Notification.js';
import Message from "../model/Message.js";
import Favorite from "../model/Favorite.js";
import Compte from "../model/Compte.js";  // Importer le modèle Compte
import { createJWT } from '../utils/jwt.js';
import Tailleur from '../model/Tailleur.js';
import "dotenv/config";


const BASE_API = process.env.PREFIX_URI;

class ClientController {

    async createAccount(req, res) {
        try {
            // Créez un nouveau compte
            const newAccount = new Compte({ ...req.body, createdAt: new Date(), updatedAt: new Date() });
            await newAccount.save();

            // Générer un token JWT contenant l'ID du compte et le rôle
            const token = createJWT({ payload: { id: newAccount._id, role: newAccount.role } });

            return res.status(201).json({ account: newAccount, token, status: 'OK' });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 'KO' });
        }
    }

    async getNewsFeed(req, res) {
        try {
            const Posts = await Post.find().populate('author_id').lean();
            const statuses = await Status.find().populate('tailleur_id').lean();
            
            const notifications = await Notification.find().populate('post_id').lean();
          /*   const messages = await Message.find({ receiver_id: req.user.id }).populate('sender_id').lean();
            const favorites = await Favorite.find({ compte_id: req.user.id }).populate('post_id').lean();
     */
            // Créer un tableau de liens pour les notifications
          /*   const notificationLinks = notifications.map(notification => {
                return `${req.protocol}://${req.get('host')}${BASE_API}/notifications/:${notification._id}`;
            });
     */
            // Créer un tableau de liens pour les messages
          /*   const messageLinks = messages.map(message => {
                return `${req.protocol}://${req.get('host')}/messages/${message._id}`;
            });
    
            // Créer un tableau de liens pour les favoris
            const favoriteLinks = favorites.map(favorite => {
                return `${req.protocol}://${req.get('host')}/favorites/${favorite._id}`;
            }); */
    
            const newsFeed = {
                Posts,
                statuses,
                notificationLinks,  // Inclure uniquement les liens des notifications
               /*  messageLinks,       // Inclure uniquement les liens des messages
                favoriteLinks  */      // Inclure uniquement les liens des favoris
            };
    
            return res.status(200).json({ newsFeed, status: 'OK' });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 'KO' });
        }
    }
    


    async getAccount(req, res) {
        try {
            const account = await Compte.findById(req.params.id).populate('user_id').populate('comment_ids').populate('favorite_ids').populate('follower_ids').populate('report_ids').populate('note_ids');
            if (!account) {
                return res.status(404).json({ message: 'Account not found', status: 'KO' });
            }
            return res.status(200).json({ account, status: 'OK' });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 'KO' });
        }
    }

    async listStatus(req, res) {
        try {
            const statuses = await Status.find().populate('tailleur_id');
            return res.status(200).json({ statuses, status: 'OK' });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 'KO' });
        }
    }

 async getNotificationById(req, res) {
    try {
        const notification = await Notification.findById(req.params.id).populate('post_id').lean();
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found', status: 'KO' });
        }
        return res.status(200).json({ notification, status: 'OK' });
    } catch (err) {
        return res.status(500).json({ message: err.message, status: 'KO' });
    }
}

// De même, ajouter les méthodes pour getMessageById et getFavoriteById
async getMessageById(req, res) {
    try {
        const message = await Message.findById(req.params.id).populate('sender_id').lean();
        if (!message) {
            return res.status(404).json({ message: 'Message not found', status: 'KO' });
        }
        return res.status(200).json({ message, status: 'OK' });
    } catch (err) {
        return res.status(500).json({ message: err.message, status: 'KO' });
    }
}

async getFavoriteById(req, res) {
    try {
        const favorite = await Favorite.findById(req.params.id).populate('post_id').lean();
        if (!favorite) {
            return res.status(404).json({ message: 'Favorite not found', status: 'KO' });
        }
        return res.status(200).json({ favorite, status: 'OK' });
    } catch (err) {
        return res.status(500).json({ message: err.message, status: 'KO' });
    }
}


    async listFavorites(req, res) {
        try {
            const favorites = await Favorite.find({ compte_id: req.user.id }).populate('post_id');
            return res.status(200).json({ favorites, status: 'OK' });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 'KO' });
        }
    }

    async addFavorite(req, res) {
        try {
            const newFavorite = new Favorite({ ...req.body, createdAt: new Date(), updatedAt: new Date() });
            await newFavorite.save();
            return res.status(201).json({ favorite: newFavorite, status: 'OK' });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 'KO' });
        }
    }
    
}

export default new ClientController();
