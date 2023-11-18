const multer =require('multer');

//  const imgconfig=multer.diskStorage({
//     destination:(req,file,callback)=>{
//         callback(null,"./uploads")
//     },
//     filename:(req,file,callback)=>{
//          callback(null,`image-${Date.now()}.${file.originalname}`)
//     }
//  });


// const isImage=(req,file,callback)=>{
//     if(file.mimetype.startsWith("image")){
//         callback(null,true)
//     }
//     else{
//         callback(new Error("Only image is Allowed"));
//     }
// }

// const upload=multer({
//     storage:imgconfig,
//     fileFilter:isImage
// })

// module.exports=upload;