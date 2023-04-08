
import User from '../models/userModel.js'
import Blog from '../models/blogModel.js'
import Comment  from '../models/commentModel.js'





//@desc Register anew user
//@route POST /api/user
//@access  Public
const createUser = async(req, res) => {
  const {name ,email , password} = req.body
  console.log(req.body)

  const userExists = await User.findOne({email})
  if(userExists)
  {
    res.status(400)
    throw new Error('User already Exists')
  }

    const user = await  User.create({
      name ,
      email,
      password
    });


  if(user)
  {
    res.status(201).json({
      _id:user._id,
      name:user.name,
      email:user.email,
    })

  }
  else {
    res.status(404)
    throw new Error('User not found')
  }
}

//blog by a user
const createBlog = async(req, res) => {
    const {blogName , user_id , description} = req.body
    console.log(req.body)
    let blog;

    
    try
    {
       blog = await  Blog.create({
        blogName ,
        user: user_id,
        description
      });

  
    }
    catch(e)
    {
      console.log(e);
    }
  
    
    
      res.status(201).json({
        blog
      })
  
    
   
  }

  //comment by a user on a blog
  const createComment = async(req, res) => {
    const {user_id ,blog_id , description} = req.body
  
    
  
      const comment = await  Comment.create({
        commentName: description ,
        user: user_id,
        blog: blog_id
      });

  
  
      res.status(201).json({
        comment
      })
  
    
  }


//blogs by a user
const allBlogsByUser = async(req , res) => {
  try {
    const {user_id} = req.body;
    const allblogs = await Blog.find({user : user_id});

    return res.json(allblogs);
  } catch (error) {
    res.json(error.message)
  }

}


const Final = async(req , res) => {

try{
  
  const {userId , levelno} = req.params;
  //getting in params
  

  //finding all the blogs
  const blogsofAllUser = await Blog.find({});
  
  const obj = {};
  let commentsofAllUser;

  //making adjacency list type of object 
  // {
  //   '64312029977371c8100c6b0c': [ '643159f7a39a05f5d59022c5', '64313f1e55e75c569c8e4109' ],
  //   '643159f7a39a05f5d59022c5': [ '64312029977371c8100c6b0c' ],
  //   '64313f1e55e75c569c8e4109': [ '64312029977371c8100c6b0c' ]
  // }

  //here for http://localhost:5000/api/user/64313f1e55e75c569c8e4109/level/2
  // we get  [
  //   "643159f7a39a05f5d59022c5"
  // ]

  //http://localhost:5000/api/user/643159f7a39a05f5d59022c5/level/2
//   [
//     "64313f1e55e75c569c8e4109"
// ]

//http://localhost:5000/api/user/64312029977371c8100c6b0c/level/1
// [
//   "643159f7a39a05f5d59022c5",
//   "64313f1e55e75c569c8e4109"
// ]

  // here they are ids of the userId
  await Promise.all(blogsofAllUser.map(async(blog) => {
   
    commentsofAllUser = await Comment.find({blog : blog._id.toString()})
    
    
    for(let i = 0; i < commentsofAllUser.length; i++)
    {
      //getting userId of a particular comment
      let id = commentsofAllUser[i].user.toString();
      
      //assuming all are friends that have written comment in a particular blog excluding oneself.
      let allfriends = commentsofAllUser.filter(a => a.user.toString() !== id)
      //getting only userId 
      allfriends = allfriends.map((ab) => { return ab.user.toString()});
      

      if(obj[id]!== undefined)
      {
        // if they are already there add those which are not there.
        allfriends.map((allf) => {
          if(!obj[id].includes(allf))
        {
          obj[id].push(allf)   
        }
        })
      
      }
      else
      {
        //adding all friends in the same comment 
        obj[id] = allfriends;
      }

      console.log(obj)
  }

  }))


  const graph = obj;
  console.log(obj , "obj")
  //userId is trhe target 
  const queue = [userId]
  const result = []
  const visited = new Set()
  //here K is the level
  let K = Number(levelno);
  //current Distance is 0
  let currentDistance = 0

  
  //here we are doing simple BFS alomg while keeping track of distance at the same time.
  while (queue.length > 0 && currentDistance <= K) {
      const size = queue.length
      
      for (let i = 0; i < size; i++) {
          const node = queue.shift()
          
          if (currentDistance === K) {
              result.push(node)
          }
          
          if (graph[node] !== undefined) {
              for (const neighbor of graph[node]) {
                  if (!visited.has(neighbor)) {
                      queue.push(neighbor)
                  }
              }
          }

          visited.add(node)
      }
      
      currentDistance += 1
  }

  // sending out the nth level friends. sending only the users ids 
  return res.json(result)
}
catch(e) {
   return res.json(e.message)
}
  


}//getting comments by a particular user
const allCommentsByUserOnBlog = async(req , res) => {
  try {
    const {user_id} = req.body;
    const allcomments = await Comment.find({user : user_id});

    return res.json(allcomments);
  } catch (error) {
    res.json(error.message)
  }



}




export {Final , createBlog , createUser , createComment , allBlogsByUser , allCommentsByUserOnBlog}