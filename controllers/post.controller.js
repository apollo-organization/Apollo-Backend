const {formatResult} = require("../utils/formatter")
const {Post, postValidation} = require("../models/post.model")
const _ = require("lodash")

exports.createPost = async(req, res) =>{
    console.log(req.file)
    try {
        const {error} = postValidation(req.body)
        if(error) return res.status(400).send(error.details)
        const newPost = new Post({
            postImage: req.file.path,
            caption : req.body.caption,
            location : req.body.location,
            postedBy : req.body.postedBy
        })
        console.log(newPost)
        try{
            await newPost.save()
            res.send(formatResult({
                status: 201,
                message: "Playlist created successfully",
                data: newPost
            }))
        }catch (ex) {
            return res.send(formatResult({
                status: 400,
                message: ex.message
            }))
        }
}
    catch(err){
        return res.send(formatResult({
            status: 400,
            message: err.message
        }))
    }
}

exports.getAllPosts = async(req, res) =>{
    try {
        const posts = await Post.find()
        return res.send(formatResult({
            status: 200,
            message: "Ok",
            data: posts
        }))
    } catch (error) {
        return res.send(formatResult({
            status: 400,
            message: error.message
        }))
    }
}

exports.getPost = async(req, res) => {
    try{
        const post = await Post.findById(req.params.id)
        if(!post){
            return res.send(formatResult({
                status: 404,
                message: "Post not found"
            }))
        }
        return res.send(formatResult({
            status: 200,
            message: "Ok",
            data: post
        }))
    }
    catch (error) {
        return res.send(formatResult({
            status: 404,
            message: error.message
        }))
    }
}

exports.updatePost = async(req, res) =>{
    let post = await Post.findById(req.params.id);

    if(!post){
        res.send(formatResult({
            status:404,
            message: "Post not found"
        }))
    }

    if(req.user.id.toString()!== post.user.toString() && req.user.role !== 'admin') {
        res.send(formatResult({
            status:404,
            message: "Not Authorized to update this post"
        }))
    }

    post = await Post.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(201).json({
        success: true,
        data: post
    })
}

exports.deletePost = async(req, res) =>{
    try {
        let post = await Post.findById(req.params.id);
    
        if(!post) {
            res.send(formatResult({
                status: 404,
                message: "Post not found"
            }))
        }
    
        // if(req.user.id.toString() !== post.user.toString() && req.user.role !== 'admin'){
        //     res.send(formatResult({
        //         status: 404,
        //         message: "Not Authorized to delete this post"
        //     }))
        // }
    
        await Post.findByIdAndDelete(req.params.id)
    
        return res.send(formatResult({
            status: 400,
            message: "Post deleted successfully"
        }))
    } catch (error) {
        return res.send(formatResult({
            status: 400,
            message: error.message
        }))
    }
}

exports.likePost = async(req, res) =>{
    try {
        const id = req.params.id;
        console.log(id)

        let post  = await Post.findById(req.params.id)

        console.log(post)

        if(!post){
            res.send(formatResult({
                status:404,
                message: "Post Not Found"
            }))
        }
        else
    
        if(post.likes.includes(req.body.userId)){
            res.send(formatResult({
                status: 401,
                message: "Already likes post"
            }))
        }
    
        else{
            post = await Post.findByIdAndUpdate(
                req.params.id,
                {
                    $push:{
                        likes: req.body.userId
                    }
                },
                {
                    new: true,
                    runValidators: true
                }
            )
            res.status(201).json({
                success: true,
                message: "You liked post"
            })
        }
    } catch (error) {
        return res.send(formatResult({
            status: 400,
            message: error.message
        }))
    }
}

// exports.likePost = async(req, res)=>{
//    Post.findByIdAndUpdate(req.body.postId,{
//     $push:{likes:req.user._id}
// },{
//     new:true
// }).exec((err,result)=>{
//     if(err){
//         return res.status(422).json({error:err})
//     }else{
//         res.json(result)
//     }
// })
// }

exports.unlikePost = async(req, res) =>{ try {
    const id = req.params.id;
    console.log(id)

    let post  = await Post.findById(req.params.id)

    console.log(post)

    if(!post){
        res.send(formatResult({
            status:404,
            message: "Post Not Found"
        }))
    }
    else

    if(!(post.likes.includes(req.body.userId))){
        res.send(formatResult({
            status: 401,
            message: "You do not like this post"
        }))
    }

    else{
        post = await Post.findByIdAndUpdate(
            req.params.id,
            {
                $pull:{
                    likes: req.body.userId
                }
            },
            {
                new: true,
                runValidators: true
            }
        )
        res.status(201).json({
            success: true,
            message: "You unliked post"
        })
    }
} catch (error) {
    return res.send(formatResult({
        status: 400,
        message: error.message
    }))
}
}
