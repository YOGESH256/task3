import mongoose from 'mongoose'


const  commentSchema = mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'User'

  },
  commentName : {
    type:String,
    required:true
  },

  blog:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'Blog'

  },

} , {
  timestamps:true
})


const Comment = mongoose.model('Comment' , commentSchema)
export default Comment