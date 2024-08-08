// import {userInToken} from "../utils/utils.js";

class TailleurController{

    listMyAllPosts(req, res) {
        try {

        } catch (err) {
            return res.status(500).json({message: err.message,status: 'KOk'});
        }
    }

    async createPost(req, res) {
        try {
            // const user = userInToken(req,res);

        } catch (err) {
            return res.status(500).json({message: err.message, status: 'KO'});
        }
    }
}

export default new TailleurController();
