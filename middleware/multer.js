// gestion des requêtes HTTP avec envoie de fichier

const multer = require("multer");

//MIME TYPES
const MIME_TYPES = {
    "image/jpg" : "jpg",
    "image/jpeg" : "jpg",
    "image/gif" : "gif",
    "image/png" : "png",
    "image/webp" : "webp",
};

// diskStorage => destination du fichier / générer un nom de fichier unique
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    console.log(file.originalname)
    const name = file.originalname.split(" ").join("_").split(".")[0]
    console.log(name)
    const extension = MIME_TYPES[file.mimetype]
    callback(null, name +  "_" + Date.now() + "." + extension);
  },
});



module.exports = multer({storage: storage}).single("image");