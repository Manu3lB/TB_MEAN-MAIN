import express from "express";
import user from "../controllers/user.js";
const router = express.Router();

router.post("/registerUser", user.registerUser);
router.get("/listUsers", user.listUsers);
router.get("/findUser/:_id", user.findUser);
router.put("/updateUser", user.updateUser);
router.delete("/deleteUser/:_id", user.deleteUser);
router.post("/loginUser", user.login);

export default router;
