import  express from 'express';
// import products from './data/products.js'
import dotenv from 'dotenv'
import ConnectDB from './config/db.js'
import blogRoutes from "./routes/blogRoutes.js"



dotenv.config()

ConnectDB()
const app = express()

app.use(express.json())

app.get("/" , (req , res) =>{
  res.send("Api is running....")
})

app.use('/api' , blogRoutes)






const PORT = process.env.PORT || 5000

app.listen(PORT , () =>{
  console.log(`Server is listening in  ${process.env.NODE_ENV} on ${PORT}` );
})