import jwt from "jsonwebtoken";

export const isAuthenticatedGlobal = (req, res, next) => {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.status(401).json({ message: 'Token is required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
       // return  res.json(user.id);
/*         req.params.id = user.id;
 */        req.id = user.id; // Stocker les informations de l'utilisateur dans req.user

        next();
    })
}