import jwt from "jsonwebtoken";

export const isTailleurAuthenticated = (req, res, next) => {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.status(401).json({ message: 'Token is required', status: 'KO' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' , status: 'KO'});
        }
        // res.json({ message: 'Access granted', user });
        if(user && user.role === 'tailleur'){
            req.id = user.id;
            next();
        }else {
            res.status(403).json({message: 'No Authorization', status: 'KO'});
        }
    })
}