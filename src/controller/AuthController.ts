import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { verifyPassword, hashPassword } from "../utils/password.js";
import { createJWT } from "../utils/jwt.js";
import { ControllerRequest } from "../interface/Interface.js";
import { v2 as cloudinary } from "cloudinary";
import { env } from "process";
import { uploadImageCloud } from "../utils/uploadFile.js";
import { UploadedFile } from "express-fileupload";

const prisma = new PrismaClient();

class AuthController {
  async uploadProfile(req: ControllerRequest, res: Response) {
    try {
      if (!req.files) {
        return res
          .status(400)
          .json({ message: "Le fichier est requis", status: "KO" });
      }
      const imageUpload = req.files.image as UploadedFile;

      const result = await uploadImageCloud(imageUpload, "profiles");

      return result;
    } catch (error) {
      return "";
    }
  }

  async login(req: ControllerRequest, res: Response) {
    try {
      const { email, password } = req.body;

      /**
       * Faire ici la validation des champs
       **/
      const compte = await prisma.compte.findUnique({
        where: { email },
      });

      const user = await prisma.user.findUnique({
        where: { id: compte?.user_id },
      });

      if (!compte) {
        return res
          .status(404)
          .json({ message: "Utilisateur non trouvé", status: "KO" });
      }

      if (compte.etat === "desactive") {
        return res
          .status(200)
          .json({ message: "Votre compte est desactivé", status: "KO" });
      }

      // Vérifier le mot de passe
      const isMatch = await verifyPassword(password, compte.password);
      if (!isMatch) {
        return res.status(400).json({
          message: "l'email ou le mot de passe est incorrect",
          status: "KO",
        });
      }

      // Génération d'un token JWT
      const token = createJWT({
        id: compte.id,
        email: compte.email,
        identifiant: compte.identifiant,
        role: compte.role,
        picture: user?.picture,
      });

      res
        .status(200)
        .json({ token, status: "OK", message: "Connexion réussi" });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la connexion", error });
    }
  }

  logout(req: ControllerRequest, res: Response) {
    req.session.destroy((err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "La déconnexion a échoué", status: "KO" });
      }
      res.json({ message: "La déconnexion a réussi", status: "OK" });
    });
  }

  async register(req: ControllerRequest, res: Response) {
    try {
      const {
        lastname,
        firstname,
        email,
        password,
        confirm_password,
        identifiant,
        role,
        phone,
        city,
        bio,
      } = req.body;

      const pictureUpload = req.files?.picture as UploadedFile;

      const image: string = await uploadImageCloud(pictureUpload, "profiles");
      /**
       * Faire ici la validation des champs
       */

      // Vérifiez si l'utilisateur existe déjà
      const existingCompte = await prisma.compte.findFirst({
        where: {
          OR: [{ email }, { identifiant }],
        },
      });

      if (existingCompte) {
        return res
          .status(409)
          .json({ message: "Ce compte existe déjà", status: "KO" });
      }

      const existingUser = await prisma.user.findUnique({
        where: { phone },
      });

      if (existingUser) {
        return res
          .status(409)
          .json({ message: "Ce compte existe déjà", status: "KO" });
      }

      if (password !== confirm_password) {
        return res.status(400).json({
          message: "Les mots de passe ne correspondent pas à la confirmation",
          status: "KO",
        });
      }

      // Hachage du mot de passe
      const hashedPassword = await hashPassword(password);

      // Création d'un nouvel utilisateur
      const user = await prisma.user.create({
        data: {
          lastname,
          firstname,
          phone,
          city,
          picture: image,
          updatedAt: new Date(),
          createdAt: new Date(),
        },
      });

      const compte = await prisma.compte.create({
        data: {
          email,
          identifiant,
          role,
          password: hashedPassword!,
          user_id: user.id,
          updatedAt: new Date(),
          createdAt: new Date(),
          etat: "active",
          bio,
          credit: 20,
        },
      });

      if (role === "tailleur") {
        await prisma.tailleur.create({
          data: {
            compte_id: compte.id,
            updatedAt: new Date(),
            createdAt: new Date(),
          },
        });
      }

      if (role === "client") {
        await prisma.client.create({
          data: {
            compte_id: compte.id,
            updatedAt: new Date(),
            createdAt: new Date(),
          },
        });
      }

      if (role === "vendeur") {
        await prisma.vendeur.create({
          data: {
            compte_id: compte.id,
            updatedAt: new Date(),
            createdAt: new Date(),
          },
        });
      }
      if (role === "admin") {
        await prisma.admin.create({
          data: {
            compte_id: compte.id,
            nom: "NomDeExemple",
            prenom: "PrenomDeExemple",
            revenu: 0.0,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      }

      res.status(201).json({
        message: "L'inscription a réussi",
        status: "OK",
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de l'inscription", status: "KO", error });
    }
  }
  
}

export default new AuthController();
