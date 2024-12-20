import multer from "multer";
import path from "path";
import { __dirname } from "../utils/dirnameAndPathname.js";

console.log(__dirname);
const storage = multer.diskStorage({
  // dosya yükleme yapılandırması
  destination: function (req, file, cb) {
    // destination: Yüklenen dosyaların nereye kaydedileceğini belirler.
    const uploadPath = path.join(__dirname, "../public/uploads/profiles");
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // filename: Yüklenen dosyaların adını nasıl oluşturacağını tanımlar.
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, path.parse(file.originalname).name + "-" + uniqueName + path.extname(file.originalname));
  },
});
/*
    {
        fieldname: 'uploadedFile', // Formdaki input'un name değeri
        originalname: 'example.png', // Dosyanın orijinal adı
        encoding: '7bit', // Dosya kodlaması
        mimetype: 'image/png' // Dosyanın türü
    }
*/
const upload = multer({ storage });

export default upload;
