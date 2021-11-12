import user from "../models/user.js";
import role from "../models/role.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import moment from "moment";

const registerUser = async (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password)
    return res.status(400).send({ message: "Incomplete data" });

  const existingUser = await user.findOne({
    name: req.body.name,
    email: req.body.email,
    roleId: req.body.roleId,
  });
  if (existingUser)
    return res.status(400).send({ message: "The user is already registered" });

  //Parte cinco
  //Encriptación de contraseña desde el registro
  const hash = await bcrypt.hash(req.body.password, 10);

  const roleName = await role.findOne({ name: "user" });
  if (!role) return res.status(400).send({ message: "No role was assigned" });

  const userRegister = new user({
    name: req.body.name,
    email: req.body.email,
    //Parte cinco cambio a hash
    password: hash,
    roleId: roleName,
    dbStatus: true,
  });

  const result = await userRegister.save();
  return !result
    ? res.status(400).send({ message: "Failed to register user" })
    : res.status(200).send({ result });
};

const listUsers = async (req, res) => {
  const userList = await user.find();
  return userList.length === 0
    ? res.status(400).send({ message: "Empty users list" })
    : res.status(200).send({ userList });
};

const updateUser = async (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.roleId)
    return res.status(400).send({ message: "Incomplete data" });

  let pass = "";

  if (req.body.password) {
    pass = await bcrypt.hash(req.body.password, 10);
  } else {
    const userFind = await user.findOne({ email: req.body.email });
    pass = userFind.password;
  }

  // Validamos el correo del usuario
  const existingEmail = await user.findOne({ email: req.body.email });
  if (!existingEmail) {
    // si el email no existe sacamos el siguiente mensaje (significa que lo cambio y no se puede)
    return res.status(400).send({ message: "Email cannot be changed" });
  } else {
    // si existe y el id pertenece a otro usuario sacamos el siguiente mensaje
    if (existingEmail._id != req.body._id)
      return res
        .status(400)
        .send({ message: "the email already belongs to another user" });
  }

  const existingUser = await user.findOne({
    name: req.body.name,
    email: req.body.email,
    password: pass,
    roleId: req.body.roleId,
  });
  if (existingUser)
    return res.status(400).send({ message: "The email cannot be changed" });

  const userUpdate = await user.findByIdAndUpdate(req.body._id, {
    name: req.body.name,
    email: req.body.email,
    password: pass,
    roleId: req.body.roleId,
  });

  return !userUpdate
    ? res.status(400).send({ message: "Error editing user" })
    : res.status(200).send({ message: "User Updated" });
};

const deleteUser = async (req, res) => {
  const userDelete = await user.findByIdAndDelete({ _id: req.params["_id"] });
  return !userDelete
    ? res.status(400).send({ message: "User no found" })
    : res.status(200).send({ message: "User deleted" });
};

const findUser = async (req, res) => {
  const userfind = await user.findById({ _id: req.params["_id"] });
  return !userfind
    ? res.status(400).send({ message: "No search results" })
    : res.status(200).send({ userfind });
};

//Parte cinco
const login = async (req, res) => {
  //Validar si vienen los datos de email y password, si no saldra un mensaje de alerta
  if (!req.body.email || !req.body.password)
    return res.status(400).send({ message: "Incomplete data" });
  //Validar si el correo existe
  const userLogin = await user.findOne({ email: req.body.email });
  if (!userLogin)
    return res.status(400).send({ message: "Wrong email or password" });

  //Compara la contraseña del body con el hash que se genero
  const hash = await bcrypt.compare(req.body.password, userLogin.password);
  if (!hash)
    //Validar si el password es correcto
    //if (userLogin.password !== req.body.password)
    return res.status(400).send({ mesagge: "Wrong email or password" });

  try {
    return res.status(200).json({
      token: jwt.sign(
        {
          _id: userLogin._id,
          name: userLogin.name,
          roleId: userLogin.roleId,
          iat: moment().unix(),
        },
        process.env.SK_JWT
      ),
    });
  } catch (e) {
    return res.status(400).send({ message: "Login error" }, e);
  }
};

export default {
  registerUser,
  listUsers,
  updateUser,
  deleteUser,
  findUser,
  login,
};
