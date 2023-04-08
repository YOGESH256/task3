import mongoose from 'mongoose'

const ConnectDB = async () => {
  try {
    const  conn = await mongoose.connect(process.env.MONGO_URI).catch(e => console.log(e.message))


    console.log(`MongoDB Connected ${conn.connection.host}`);
  } catch (e) {
    console.log(`Error : ${e.message}`);
    process.exit(1);

  }
}

export default ConnectDB;