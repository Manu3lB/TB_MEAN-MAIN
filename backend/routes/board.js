import express from "express";
import board from "../controllers/board.js";
const router = express.Router();

router.post("/saveTask", board.saveTask);
router.get("/listTask", board.listTask);
router.put("/updateTask", board.updateTask);
router.delete("/deleteTask/:_id", board.deleteTask);

export default router;
