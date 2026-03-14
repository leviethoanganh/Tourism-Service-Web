const  router  =  require ( "express" ). Router ();
const  categoryController  =  require ( "../../controllers/admin/category.controller" );
const  multer   =  require ( 'multer' );
const  cloudinaryHelper  =  require ( "../../helpers/cloudinary.helper" );
const categoryValidate = require("../../validates/admin/category.validate");

const  upload  =  multer ({ storage: cloudinaryHelper.Storage });

router . get ( '/list' ,  categoryController.list );

router . get ( '/create' ,  categoryController.create );

router . post ( '/create' ,  upload.single('avatar'), categoryValidate.createPost, categoryController.createPost );

router . get ( '/edit/:id' ,  categoryController.edit )

router.patch( '/edit/:id', upload.single('avatar'), categoryValidate.createPost, categoryController.editPatch );

router.patch( '/delete/:id', categoryController.deletePatch );

router.patch( '/change-multi', categoryValidate.changeMultiPatch, categoryController.changeMultiPatch );

module.exports = router ;
