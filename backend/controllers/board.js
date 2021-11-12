import board from "../models/board.js";

const saveTask = async (req, res) => {
  if (!req.body.name || !req.body.description)
    return res.status(400).send({ message: "Incomplete data" });

  const boardSchema = new board({
    name: req.body.name,
    description: req.body.description,
    taskStatus: "to-do",
    imageUrl: "NoImage",
  });

  const result = await boardSchema.save();
  return !result
    ? res.status(400).send({ message: "Error registering task" })
    : res.status(200).send({ result });
};

const listTask = async (req, res) => {
  const taskList = await board.find();
  return taskList.length === 0
    ? res.status(400).send({ message: "You have no assigned tasks" })
    : res.status(200).send({ taskList });
};

const updateTask = async (req, res) => {
  if (!req.body.name || !req.body.description)
    return res.status(400).send({ message: "Incomplete data" });

    const existingTask = await board.findOne({
      name: req.body.name,
      description: req.body.description,
    });

    if (existingTask)
    return res.status(400).send({ message: "The task already exist" });

  const taskUpdate = await board.findByIdAndUpdate(req.body._id, {
    name: req.body.name,
    description: req.body.description,
  });

  return !taskUpdate
    ? res.status(400).send({ message: "Task not found" })
    : res.status(200).send({ taskUpdate });
};

const deleteTask = async (req, res) => {
  const taskDelete = await board.findByIdAndDelete(req.params._id);
  return !taskDelete
    ? res.status(400).send({ message: "Task not found" })
    : res.status(200).send({ message: "Task deleted" });
};

export default { saveTask, listTask, updateTask, deleteTask };
