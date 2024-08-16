// import jwt from "jsonwebtoken";
//
// import {verifyPassword, hashPassword} from "../utils/password.js";
// import {createJWT} from "../utils/jwt.js";
//
// class AuthController {
//
//     async login(req, res) {
//         try {
//             const {email, password} = req.body;
//
//             /**
//              * Faire ici la validation des champs
//              */
//
//             // Trouver l'utilisateur par e-mail
//             const compte = await Compte.findOne({email});
//
//             // return res.json(compte);
//
//             if (!compte) {
//                 return res.status(404).json({message: 'Utilisateur non trouvé', status: 'KO'});
//             }
//
//             // Vérifier le mot de passe
//            /*  const isMatch = await verifyPassword(password, compte.password);
//             if (!isMatch) {
//                 return res.status(400).json({message: 'Mot de passe incorrect', status: 'KO'});
//             } */
//
//             if(compte.etat === 'desactiver'){
//                 return res.status(200).json({message: 'Votre compte est desactivé', status: 'KO'});
//             }
//
//             // Génération d'un token JWT
//             const token = createJWT({id: compte._id, role: compte.role});
//
//             res.status(200).json({token, status: 'OK', message: 'Connexion réussi'});
//         } catch (error) {
//             res.status(500).json({message: 'Erreur lors de la connexion', error});
//         }
//     }
//
//     logout(req, res) {
//         req.session.destroy((err) => {
//             if (err) {
//                 return res.status(500).json({message: 'La déconnection a échoué', status: 'KO'});
//             }
//             res.json({message: 'La déconnection a réussi', status: 'OK'});
//         });
//     }
//
//     async register(req, res) {
//         try {
//
//             const {
//                 lastname,
//                 firstname,
//                 email,
//                 password,
//                 confirm_password,
//                 identifiant,
//                 role,
//                 phone,
//                 city,
//                 picture,
//             } = req.body;
//
//             /**
//              * Faire ici la validation des champs
//              */
//
//             // Vérifiez si l'utilisateur existe déjà
//             const existingCompte = await Compte.findOne({
//                 $or: [
//                     { email},
//                     { identifiant}
//                 ]
//             });
//             if (existingCompte) {
//                 return res.status(409).json({message: 'Ce compte existe déjà', status: 'KO',});
//             }
//             const existingUser = await User.findOne({phone});
//             if (existingUser){
//                 return res.status(409).json({message: 'Ce compte existe déjà', status: 'KO',});
//             }
//
//             if (password !== confirm_password){
//                 return res.status(400).json({message: 'Les mots de passe ne correspondent pas à la confirmation', status: 'KO'});
//             }
//             // Hachage du mot de passe
//             const hashedPassword = await hashPassword(password);
//
//             // Création d'un nouvel utilisateur
//             const user = new User({
//                 lastname,
//                 firstname,
//                 phone,
//                 city,
//                 picture,
//                 updatedAt: new Date(),
//                 createdAt: new Date()
//             });
//             // return res.json(user);
//             await user.save();
//
//             const compte = new Compte({
//                 email,
//                 identifiant,
//                 role,
//                 password: hashedPassword,
//                 user_id: user._id,
//                 updatedAt: new Date(),
//                 createdAt: new Date(),
//                 etat: 'active',
//                 credit: 0
//             })
//             await compte.save();
//
//             if (role === 'tailleur'){
//                 const tailleur = new Tailleur({
//                     compte_id: compte._id,
//                     updatedAt: new Date(),
//                     createdAt: new Date(),
//                 });
//                 await tailleur.save();
//             }
//             if (role === 'client'){
//                 const client = new Client({
//                     compte_id: compte._id,
//                     updatedAt: new Date(),
//                     createdAt: new Date(),
//                 });
//                 await client.save();
//             }
//
//             res.status(201).json({message: 'L\'inscription a réussi', status: 'OK'});
//         } catch (error) {
//             res.status(500).json({message: 'Erreur lors de l\'inscription', status: 'KO', error});
//         }
//     }
//
//     async getLoginUser(req, res) {
//         try {
//             return res.json(1);
//             const {id} = req.params;
//             // Trouver le client par ID
//             const user = await User.findById(id);
//             if (!user) {
//                 return res.status(404).json({message: 'User non trouvé'});
//             }
//             res.status(200).json(user);
//         } catch (error) {
//             res.status(500).json({message: 'Erreur lors de la récupération du user', error});
//         }
//     }
//
//
//
//
// //bloquer utilisateur
//
// }
//
//
// // Autres méthodes...
//
//
// export default new AuthController();
//
// // jwtwebtoken
// // bcryptjs