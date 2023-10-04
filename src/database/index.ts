import mongoose from 'mongoose'
import { env } from "@/env";

mongoose.set('strictQuery', true);
const { MONGODB_USER } = env
const MONGODB_PASSWORD = encodeURIComponent(env.MONGODB_PASSWORD ? env.MONGODB_PASSWORD : '') || env.MONGODB_PASSWORD

const MONGODB_URI = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@sitecompet.nk50e.mongodb.net/site_compet?retryWrites=true&w=majority`

if (!MONGODB_USER || MONGODB_URI == '' || !MONGODB_PASSWORD || MONGODB_PASSWORD == '') {
  mongoose.connect('mongodb://localhost:27017/test').then(() => {
    console.log('Banco de dados conectado à porta 27017')
  })
} else {
  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      console.log('Banco de dados conectado à nuvem')
    })
    .catch((err) => console.error(err))
}
export default mongoose
