import multer from "multer";

// Disk storage config "how files are saved"
const storage = multer.diskStorage({
    filename: function(req, file, calllback) {
        calllback(null, file.originalname);
    }
})


// Multer instance
const upload = multer({storage});

export default upload;