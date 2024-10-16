import React, { useEffect, useState } from "react";
import { getPosts } from "../api/postApi"; // Assurez-vous que le chemin est correct
import CommentsSection from "./CommentsSection";
import PostInput from "../components/principal/section/PostInput";

function PostPage() {
  const [posts, setPosts] = useState([]); // État pour stocker les posts
  const [loading, setLoading] = useState(true); // État de chargement
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsData = await getPosts();
        console.log("Données récupérées :", postsData); // Vérifiez les données ici
        // Extraire le tableau des posts à partir de postsData
        setPosts(postsData.posts); // Mettre à jour l'état avec le tableau des posts
      } catch (error) {
        console.error("Erreur lors de la récupération des posts:", error);
      } finally {
        setLoading(false); // Arrêter le chargement
      }
    };

    fetchPosts();
  }, []); // Le tableau vide [] signifie que cela ne s'exécute qu'une seule fois après le premier rendu

  if (loading) {
    return <div>Chargement des posts...</div>; // Message de chargement
  }


  return (
    <>
      <div id="compose-card" className="card is-new-content">
        <PostInput />
      </div>

      {posts.map((post) => (
         <div id="feed-post-1" className="card is-post">
         <div className="content-wrap">
           <div className="card-heading">
             <div className="user-block">
               <div className="image">
                 <img
                   src="../via.placeholder.com/300x300.png"
                   data-demo-src="../src/assets/img/avatars/dan.jpg"
                   data-user-popover="1"
                   alt=""
                 />
               </div>
               <div className="user-info">
               <p>{post.user.firstname}</p>     
               createdAt

               <p>{post.createdAt}</p>     

               </div>
             </div>
 
             <div className="dropdown is-spaced is-right is-neutral dropdown-trigger">
               <div>
                 <div className="button">
                   <i data-feather="more-vertical"></i>
                 </div>
               </div>
               <div className="dropdown-menu" role="menu">
                 <div className="dropdown-content">
                   <a href="#" className="dropdown-item">
                     <div className="media">
                       <i data-feather="bookmark"></i>
                       <div className="media-content">
                       <p>{post.title}</p>
                       <small>Add this post to your bookmarks.</small>
                       </div>
                     </div>
                   </a>
                   <a className="dropdown-item">
                     <div className="media">
                       <i data-feather="bell"></i>
                       <div className="media-content">
                         <h3>Notify me</h3>
                         <small>Send me the updates.</small>
                       </div>
                     </div>
                   </a>
                   <hr className="dropdown-divider" />
                   <a href="#" className="dropdown-item">
                     <div className="media">
                       <i data-feather="flag"></i>
                       <div className="media-content">
                         <h3>Flag</h3>
                         <small>In case of inappropriate content.</small>
                       </div>
                     </div>
                   </a>
                 </div>
               </div>
             </div>
           </div>
 
           <div className="card-body">
             <div className="post-text">
             <p>{post.content}</p>     

             </div>
             <div className="post-image">
               <a
                 data-fancybox="post1"
                 data-lightbox-type="comments"
                 data-thumb="../src/assets/img/demo/unsplash/1.jpg"
                 href="../via.placeholder.com/1600x900.png"
                 data-demo-href="../src/assets/img/demo/unsplash/1.jpg"
               >
                 <img src="../src/assets/img/demo/unsplash/1.jpg" alt="kk" />
               </a>
 
               <div className="like-wrapper">
                 <a href="javascript:void(0);" className="like-button">
                   <i className="mdi mdi-heart not-liked bouncy"></i>
                   <i className="mdi mdi-heart is-liked bouncy"></i>
                   <span className="like-overlay"></span>
                 </a>
               </div>
 
               <div className="fab-wrapper is-share">
                 <a
                   href="javascript:void(0);"
                   className="small-fab share-fab modal-trigger"
                   data-modal="share-modal"
                 >
                   <i data-feather="link-2"></i>
                 </a>
               </div>
 
              
             </div>
           </div>
 
           <div className="card-footer">
             <div className="likers-text">
               <div className="right">
                 <a className="btn button is-solid accent-button raised">
                   <h3 className="p"> </h3>
                   <i className=" foot mdi mdi-cart-plus"></i>
                 </a>
               </div>
             </div>
             <div className="social-count">
               <div className="likes-count">
                 <i data-feather="heart"></i>
                 <p>{post.likes}</p>     
               </div>
               <div className="shares-count">
                 <i data-feather="link-2"></i>
                 <p>{post.viewNb}</p>     
                 </div>
               <div className="comments-count">
                 <i data-feather="message-circle"></i>
                 <p>{post.comments}</p>     
               </div>
             </div>
           </div>
         </div>
 
       </div>
      ))}
    </>
  );
}

export default PostPage;
