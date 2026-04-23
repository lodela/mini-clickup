import express from "express";
import { 
  createCompany, 
  getAllCompanies, 
  getCompanyById 
} from "../controllers/companyController";
import { 
  getDepartments, 
  createDepartment 
} from "../controllers/departmentController";
import { protect, authorize } from "../middleware/authMiddleware";

// ... Multer config unchanged ...

router.route("/companies")
  .get(getAllCompanies)
  .post(upload.single("logo"), createCompany);

router.route("/companies/:id")
  .get(getCompanyById);

router.route("/departments")
  .get(getDepartments)
  .post(createDepartment);

export default router;
