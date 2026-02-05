import express from "express"; 
import userController from "../controllers/user.controller";

const router = express.Router();

router.get("/", userController.userInfo);
router.post("/", userController.createUser);
router.put("/update/:id", userController.updateUser);
router.delete("/delete/:id", userController.deleteUser);

export default router;