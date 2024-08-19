import jwt from "jsonwebtoken";
export const isVendeurAuthenticated = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.status(401).json({ message: 'Token is required', status: 'KO' });
    }
    jwt.verify(token, process.env.JWT_SECRET + "", (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token', status: 'KO' });
        }
        const user = decoded;
        if (user && user.role === 'vendeur') {
            req.id = user.id;
            next();
        }
        else {
            res.status(403).json({ message: 'No Authorization', status: 'KO' });
        }
    });
};
