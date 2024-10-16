import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { verifyPassword, hashPassword } from "../utils/password.js";
import { createJWT } from "../utils/jwt.js";
import { ControllerRequest } from "../interface/Interface.js";
import { v2 as cloudinary } from "cloudinary";
import { env } from "process";

const prisma = new PrismaClient();

class AuthController {
  uploadProfile(req: ControllerRequest, res: Response) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    if (!req.files || Object.keys(req.files).length === 0) {
      return res
        .status(400)
        .json({ message: "Aucun fichier uploadé", status: "KO" });
    }

    const file = req.files["picture"];
    const uploadedFile = Array.isArray(file) ? file[0] : file;

    // Upload the file to Cloudinary
    cloudinary.uploader.upload(
      uploadedFile.tempFilePath, // Use tempFilePath for express-fileupload
      { folder: "profile_pictures" },
      (error, result) => {
        if (error) {
          return res
            .status(500)
            .json({ message: "Erreur lors de l'upload", status: "KO", error });
        }
        if (result) {
          res.status(200).json({
            message: "Upload réussi",
            status: "OK",
            url: result.secure_url,
          });
        } else {
          res.status(500).json({
            message: "Erreur lors de l'upload",
            status: "KO",
            error: "Résultat de l'upload non défini",
          });
        }
      }
    );
  }

  async login(req: ControllerRequest, res: Response) {
    try {
      const { email, password } = req.body;

      /**
       * Faire ici la validation des champs
       */

      // Trouver l'utilisateur par e-mail
      const compte = await prisma.compte.findUnique({
        where: { email },
      });

      if (!compte) {
        return res
          .status(404)
          .json({ message: "Utilisateur non trouvé", status: "KO" });
      }

      if (compte.etat === "DESACTIVE") {
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
        picture,
        bio,
      } = req.body;

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
          picture,
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
          etat: "ACTIVE",
          bio,
          credit: 0,
        },
      });

      if (role === "TAILLEUR") {
        await prisma.tailleur.create({
          data: {
            compte_id: compte.id,
            updatedAt: new Date(),
            createdAt: new Date(),
          },
        });
      }

      if (role === "USER") {
        await prisma.client.create({
          data: {
            compte_id: compte.id,
            updatedAt: new Date(),
            createdAt: new Date(),
          },
        });
      }

      if (role === "VENDEUR") {
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
