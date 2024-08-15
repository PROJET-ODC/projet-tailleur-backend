// import mongoose from 'mongoose';
//
// import { v2 as cloudinary } from 'cloudinary';
// import fs from "fs";
//
// class TailleurController {
//
//     constructor() {
//         for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
//             const val = this[key];
//             if (key !== 'constructor' && typeof val === 'function') {
//                 this[key] = val.bind(this);
//             }
//         }
//     }
//
//     async listMyAllPosts(req, res) {
//         try {
//             const { tailleurId } = req.params; // ID de l'utilisateur connecté (qu'il soit tailleur ou client)
//             // Assurez-vous que l'ID est valide
//             if (!mongoose.Types.ObjectId.isValid(tailleurId)) {
//                 return res.status(400).json({ message: 'ID invalide', status: 'KO' });
//             }
//
//             // Récupérer le compte de l'utilisateur connecté
//             const account = await Compte.findById(tailleurId).populate('user_id').lean();
//             if (!account) {
//                 return res.status(404).json({ message: 'Compte introuvable', status: 'KO' });
//             }
//
//             const userType = account.user_id.type; // Type d'utilisateur ('client' ou 'tailleur')
//
//             let statuses = [];
//
//             if (userType === 'client') {
//                 // Récupérer les posts des tailleurs auxquels ce client est abonné (si leur compte est activé)
//                 const tailleursSuivis = account.follower_ids.map(follower => follower._id);
//                 statuses = await Status.find({
//                     tailleur_id: { $in: tailleursSuivis },
//                     'tailleur_id.compte_id': { isActive: true }  // Vérifier que le compte du tailleur est activé
//                 }).populate('tailleur_id').lean();
//             } else if (userType === 'tailleur') {
//                 // Récupérer ses propres posts et ceux des tailleurs auxquels il est abonné (si leur compte est activé)
//                 const tailleursSuivis = account.follower_ids.map(follower => follower._id);
//                 statuses = await Status.find({
//                     $or: [
//                         { tailleur_id: { $in: tailleursSuivis }, 'tailleur_id.compte_id': { isActive: true } }, // Posts des tailleurs suivis
//                         { tailleur_id: tailleurId } // Ses propres posts
//                     ]
//                 }).populate('tailleur_id').lean();
//             }
//
//             if (statuses.length === 0) {
//                 return res.status(404).json({ message: 'Aucun post trouvé', status: 'KO' });
//             }
//
//             res.status(200).json({ statuses, status: 'OK' });
//         } catch (err) {
//             return res.status(500).json({ message: err.message, status: 'KO' });
//         }
//     }
//
//     //le tailleur pourra bloquer  un autre tailleur abonné
//
//     /* ainsi qu’un client abonnée aussi
//          */
//
//     // Créer un nouveau statut
//     async createStatus(req, res) {
//         try {
//             const idCompte = req.id;
//             const tailleur = await Tailleur.findOne({ compte_id: idCompte });
//
//             const { description, categories } = req.body;
//
//             const image = await this.uploadProductImage(req, res, "image");
//             // return res.json(image);
//
//             const newStatus = new Status({
//                 files: image,
//                 description: description || 'Model du jour',
//                 duration: 24, // durée automatiquement définie
//                 viewsNB: 0,
//                 categories: categories || 'video',
//                 tailleur_id: tailleur._id
//             });
//
//             // Sauvegarder le nouveau statut dans la base de données
//             const savedStatus = await newStatus.save();
//
//             res.status(201).json({ message: 'Statut créé', status: savedStatus });
//         } catch (error) {
//             console.error('Erreur lors de la création du statut:', error);
//             res.status(500).json({ message: error.message, status: 'KO' });
//         }
//     }
//
//     async listStatus(req, res) {
//         try {
//             const userId = req.id;  // ID de l'utilisateur connecté passé en paramètre
//             const now = new Date();
//
//             // Récupérer le compte de l'utilisateur connecté
//             const account = await Compte.findById(userId).populate('follower_ids').lean();
//
//
//             if (!account) {
//                 return res.status(404).json({ message: 'Compte introuvable', status: 'KO' });
//             }
//
//             /*             console.log(account)
//              */
//             const userType = account.role;
//
//             // Type d'utilisateur ('client' ou 'tailleur')
//             let statuses = [];
//
//             if (userType === 'client') {
//                 // Si c'est un client, récupérer les statuts des tailleurs qu'il suit
//                 const tailleursSuivis = account.follower_ids.map(follower => follower._id); // Liste des ID des tailleurs suivis
//                 statuses = await Status.find({ tailleur_id: { $in: tailleursSuivis } }).populate('tailleur_id').lean();
//             } else if (userType === 'tailleur') {
//                 // Si c'est un tailleur, récupérer les statuts des tailleurs qu'il suit et ses propres statuts
//                 const tailleursSuivis = account.follower_ids.map(follower => follower._id); // Liste des ID des tailleurs suivis
//                 statuses = await Status.find({
//                     $or: [
//                         { tailleur_id: { $in: tailleursSuivis } }, // Statuts des tailleurs suivis
//                         { tailleur_id: userId } // Ses propres statuts
//                     ]
//                 }).populate('tailleur_id').lean();
//             }
//
//
//             // Filtrer les statuts non expirés
//             const activeStatuses = statuses.filter(status => {
//                 const createdAt = new Date(status.createdAt);
//                 const durationInSeconds = status.duration * 60; // Durée du statut en secondes
//                 const differenceInSeconds = (now - createdAt) / 1000; // Conversion des millisecondes en secondes
//
//                 // Garder les statuts qui ne sont pas expirés
//                 return (differenceInSeconds <= durationInSeconds && differenceInSeconds <= 86400); // Moins de 24 heures
//             });
//
//             console.log('Statuts actifs:', activeStatuses);
//
//
//             return res.status(200).json({ statuses: activeStatuses, status: 'OK' });
//         } catch (err) {
//             return res.status(500).json({ message: err.message, status: 'oooKO' });
//         }
//     }
//
//     async createPost(req, res) {
//         try {
//             const idCompte = req.id;
//             const compte = await Compte.findById(idCompte);
//             const now = new Date();
//             const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
//             const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
//
//             // Valider les champs
//             const { content, title, image, tissus, useCredit } = req.body;
//
//             if (!content || typeof content !== 'string') {
//                 return res.status(400).json({ message: "Content must be a non-empty string", status: 'KO' });
//             }
//
//             if (!title || typeof title !== 'string') {
//                 return res.status(400).json({ message: "Title must be a non-empty string", status: 'KO' });
//             }
//
//             if (!image || !Array.isArray(image) || image.length === 0) {
//                 return res.status(400).json({ message: "Image must be a non-empty array", status: 'KO' });
//             }
//
//             // const validCategories = ['video', 'image'];
//             // if (!image.every(item => validCategories.includes(item))) {
//             //     return res.status(400).json({
//             //         message: "Image array must only contain 'video' or 'image'",
//             //         status: 'KO'
//             //     });
//             // }
//
//             if (!tissus || !Array.isArray(tissus) || tissus.length === 0) {
//                 return res.status(400).json({ message: "Tissus must be a non-empty array", status: 'KO' });
//             }
//
//             // Récupérer le tailleur avant de créer le post
//
//             const tailleur = await Tailleur.findOne({ compte_id: idCompte });
//             if (!tailleur) {
//                 return res.status(404).json({ message: "Tailleur not found", status: 'KO' });
//             }
//             const allMyPosts = await Post.find({
//                 author_id: tailleur._id,
//                 cout: 0,
//                 createdAt: { $gte: startOfMonth, $lte: endOfMonth }
//             });
//             // return res.json(allMyPosts.length >= 1 || useCredit == true);
//             // return res.json(allMyPosts);
//             if (allMyPosts.length >= 1 || useCredit == true) {
//                 if (parseInt(compte.credit) >= 2) {
//                     compte.credit -= 2;
//                     await compte.save();
//                     const newPost = new Post({
//                         content,
//                         title,
//                         image,
//                         createdAt: new Date(),
//                         updatedAt: new Date(),
//                         shareNb: 0,
//                         viewsNb: 0,
//                         cout: 2,
//                         author_id: tailleur._id,
//                         tissus: []
//                     });
//
//                     await newPost.save();
//
//                     // Créer les TissuPost et les lier au Post
//                     for (let tissu of tissus) {
//                         const newTissuPost = new TissuPost({
//                             prixMetre: tissu.prixMetre,
//                             nombreMetre: tissu.nombreMetre,
//                             post_id: newPost._id,
//                             tissu_id: tissu.tissu_id,
//                             createdAt: new Date(),
//                             updatedAt: new Date()
//                         });
//                         await newTissuPost.save();
//                         await Post.findByIdAndUpdate(newPost._id, {
//                             $push: {
//                                 tissus: {
//                                     tissu_id: tissu.tissu_id,
//                                     prixMetre: tissu.prixMetre,
//                                     nombreMetre: tissu.nombreMetre,
//                                     tissuPost_id: newTissuPost._id
//                                 }
//                             }
//                         });
//                     }
//                     return res.status(201).json({ message: "Post created successfully", status: 'OK', post: newPost });
//                 } else {
//                     return res.json({ message: "Votre crédit est insufisant et Vous avez déjà plus d'un post ce mois-ci, Achetez du crédit", status: 'KO' });
//                 }
//             } else {
//
//                 if (image.length > 1) {
//                     return res.json({ message: "Vous ne pouvez poster plus de 1 image pour le moment, utiliser vos crédit pour", status: 'KO' });
//                 }
//
//                 const newPost = new Post({
//                     content,
//                     title,
//                     image,
//                     createdAt: new Date(),
//                     updatedAt: new Date(),
//                     shareNb: 0,
//                     viewsNb: 0,
//                     cout: 0,
//                     author_id: tailleur._id,
//                     tissus: []
//                 });
//
//                 await newPost.save();
//
//                 // Créer les TissuPost et les lier au Post
//                 for (let tissu of tissus) {
//                     const newTissuPost = new TissuPost({
//                         prixMetre: tissu.prixMetre,
//                         nombreMetre: tissu.nombreMetre,
//                         post_id: newPost._id,
//                         tissu_id: tissu.tissu_id,
//                         createdAt: new Date(),
//                         updatedAt: new Date()
//                     });
//                     await newTissuPost.save();
//                     await Post.findByIdAndUpdate(newPost._id, {
//                         $push: {
//                             tissus: {
//                                 tissu_id: tissu.tissu_id,
//                                 prixMetre: tissu.prixMetre,
//                                 nombreMetre: tissu.nombreMetre,
//                                 tissuPost_id: newTissuPost._id
//                             }
//                         }
//                     });
//                 }
//
//                 return res.status(201).json({ message: "Post created successfully", status: 'OK', post: newPost });
//             }
//
//         } catch (err) {
//             console.error(err);
//             return res.status(500).json({ message: err.message, status: 'KO' });
//         }
//     }
//
//     async updatePost(req, res) {
//         try {
//             const { postId } = req.params;
//             const { content, title, image, tissus } = req.body;
//             const idTailleur = req.id;
//
//             // Vérifier si le post existe et appartient au tailleur
//             const post = await Post.findOne({ _id: postId, author_id: idTailleur });
//             if (!post) {
//                 return res.status(404).json({
//                     message: "Post not found or you don't have permission to edit it",
//                     status: 'KO'
//                 });
//             }
//
//             // Mettre à jour les champs de base
//             if (content) post.content = content;
//             if (title) post.title = title;
//             if (image) post.image = image;
//             post.updatedAt = new Date();
//
//             // Mettre à jour les tissus
//             if (tissus && Array.isArray(tissus)) {
//                 // Supprimer les anciens TissuPost
//                 await TissuPost.deleteMany({ post_id: post._id });
//
//                 // Vider le tableau de tissus du post
//                 post.tissus = [];
//
//                 // Créer les nouveaux TissuPost et les lier au Post
//                 for (let tissu of tissus) {
//                     const newTissuPost = new TissuPost({
//                         prixMetre: tissu.prixMetre,
//                         nombreMetre: tissu.nombreMetre,
//                         post_id: post._id,
//                         tissu_id: tissu.tissu_id,
//                         createdAt: new Date(),
//                         updatedAt: new Date()
//                     });
//                     await newTissuPost.save();
//
//                     post.tissus.push({
//                         tissu_id: tissu.tissu_id,
//                         prixMetre: tissu.prixMetre,
//                         nombreMetre: tissu.nombreMetre,
//                         tissuPost_id: newTissuPost._id
//                     });
//                 }
//             }
//
//             await post.save();
//
//             res.status(200).json({ message: "Post updated successfully", status: 'OK', post });
//         } catch (err) {
//             console.error(err);
//             return res.status(500).json({ message: err.message, status: 'KO' });
//         }
//     }
//
//
//     async deletePost(req, res) {
//         try {
//             const { postId } = req.params;
//             const idTailleur = req.id;
//
//             // Vérifier si le post existe et appartient au tailleur
//             const post = await Post.findOne({ _id: postId, author_id: idTailleur });
//             if (!post) {
//                 return res.status(404).json({
//                     message: "Post not found or you don't have permission to delete it",
//                     status: 'KO'
//                 });
//             }
//
//             // Supprimer le post
//             await Post.deleteOne({ _id: postId });
//
//             // Retirer l'ID du post de la liste des posts du tailleur
//             await Tailleur.updateOne(
//                 { compte_id: idTailleur },
//                 { $pull: { post_ids: postId } }
//             );
//             res.status(200).json({ message: "Post deleted successfully", status: 'OK' });
//         } catch (err) {
//             return res.status(500).json({ message: err.message, status: 'KO' });
//         }
//     }
//
//     async acheterCredit(req, res) {
//         try {
//             // Extraire les informations du corps de la requête
//             const { compteId, montant } = req.body;
//
//             console.log('Données reçues:', { compteId, montant });
//
//             // Validation du montant
//             if (typeof montant !== 'number' || montant <= 0) {
//                 return res.status(400).json({ error: 'Montant invalide' });
//             }
//
//             // Calculer le crédit
//             const regleconversion = await Conversioncredit.findOne();
//
//             const credit = (montant * regleconversion.credit) / regleconversion.prix;
//
//             // Trouver le compte
//             const compte = await Compte.findById(compteId);
//             if (!compte) {
//                 return res.status(404).json({ error: 'Compte non trouvé' });
//             }
//
//             // Vérifier si le compte est un "tailleur"
//             if (compte.role !== 'tailleur') {
//                 return res.status(403).json({ error: 'Seul un tailleur peut acheter des crédits' });
//             }
//
//
//             // Ajouter le crédit au crédit existant
//             const updatedCompte = await Compte.findByIdAndUpdate(
//                 compteId,
//                 { $set: { credit: credit + compte.credit } },
//                 { new: true }
//             );
//
//
//             // Envoyer la réponse
//             res.status(200).json({ message: 'Crédit ajouté avec succès', compte: updatedCompte });
//         } catch (error) {
//             // Gérer les erreurs
//             console.error('Erreur lors de l\'achat de crédits:', error);
//             res.status(500).json({
//                 error: 'Une erreur est survenue lors de l\'achat de crédits',
//                 details: error.message
//             });
//         }
//     }
//
//     async uploadProductImage(req, res, fieldName) {
//         if (!req.files) {
//             return res.status(500).json({ message: "No File Uploaded", status: "KO" })
//         }
//         const productImage = req.files[`${fieldName}`];
//         if (!productImage.mimetype.startsWith(`${fieldName}`)) {
//             return res.status(500).json({ message: "Please Upload Image", status: "KO" })
//         }
//         const maxSize = 1024 * 1024;
//         if (productImage.size > maxSize) {
//             return res.status(500).json({ message: "Please upload image smaller 1MB", status: "KO" })
//         }
//         // return res.json(productImage);
//         const result = await cloudinary.uploader.upload(
//             productImage.tempFilePath,
//             {
//                 use_filename: true,
//                 folder: 'status',
//             }
//         );
//         fs.unlinkSync(productImage.tempFilePath);
//         return productImage.name;
//         // return res.status(200).json({ image: { src: result.secure_url } });
//     };
// }
//
// export default new TailleurController();
