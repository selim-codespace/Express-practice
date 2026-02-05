import express from "express"; 
import userController from "../controllers/user.controller";

const router = express.Router();

router.get("/", userController.userInfo);
router.post("/", userController.createUser);
router.put("/", userController.updateUser);
router.delete("/", userController.deleteUser);

export default router;