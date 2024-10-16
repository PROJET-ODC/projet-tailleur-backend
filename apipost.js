import apiBase from "./apiBase"; // Assurez-vous que le chemin est correct

const getPosts = async () => {
  try {
    const response = await apiBase.get("/tailleur/posts");
    return response.data; // Renvoie les données des posts
  } catch (error) {
    // Gérer les erreurs, vous pouvez lancer l'erreur ou renvoyer un message d'erreur
    throw new Error(error.response?.data?.message || "Erreur lors de la récupération des posts");
  }
};

export { getPosts };
