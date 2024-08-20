// import multer, { StorageEngine } from 'multer';
// import path from 'path';
// import fs from "fs";

// // Configuration de Multer
// const storage: StorageEngine = {
//     _handleFile(req, file, cb) {
//         const filePath = path.join('uploads/', Date.now() + path.extname(file.originalname));
//         file.stream.pipe(fs.createWriteStream(filePath));
//         cb(null, { path: filePath });
//     },
//     _removeFile(req, file, cb) {
//         fs.unlink(file.path, cb);
//     }
// };

// const uploadMiddleware = multer({ storage });

// export default uploadMiddleware;
