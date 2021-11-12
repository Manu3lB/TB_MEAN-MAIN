import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import moment from "moment";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  roleId: { type: mongoose.Schema.ObjectId, ref: "roles" },
  dbStatus: Boolean,
  registerDate: { type: Date, default: Date.now },
});
//Generar un JWT cuando un usuario hace login
// userSchema.methods.generateJWT = function () {
//    //Generar el Payload con el .sing
//   return jwt.sign(
//     {
//       //Referencia que estoy sacando de las variables del esquema userSchema
//       _id: this._id,
//       name: this.name,
//       roleId: this.roleId,
//       iat: moment().unix(),
//     },
//     process.env.SK_JWT
//   );
// };
const user = mongoose.model("users", userSchema);
export default user;
