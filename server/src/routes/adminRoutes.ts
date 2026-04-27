import express from "express";
import { 
  createCompany, 
  getAllCompanies, 
  getCompanyById 
} from "../controllers/companyController";
import { 
  getDepartments, 
  createDepartment,
  updateDepartment,
  deleteDepartment
} from "../controllers/departmentController";
import { protect, authorize } from "../middleware/authMiddleware";
import multer from "multer";
import path from "path";

const router = express.Router();

// Multer Configuration for Logos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/logos");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "logo-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) return cb(null, true);
    cb(new Error("Only images (jpg, png, webp) are allowed"));
  },
});

// All routes here require God Mode or Admin Client
router.use(protect);
router.use(authorize("GOD_MODE", "CLIENT_A"));

router.route("/companies")
  .get(getAllCompanies)
  .post(upload.single("logo"), createCompany);

router.route("/companies/:id")
  .get(getCompanyById);

router.route("/departments")
  .get(getDepartments)
  .post(createDepartment);

router.route("/departments/:id")
  .put(updateDepartment)
  .delete(deleteDepartment);

export default router;
