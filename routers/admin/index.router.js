const  router  =  require ( "express" ). Router ();
const  accountRoutes  =  require ( "./account.router" );
const  dashboardRoutes  =  require ( "./dashboard.router" );
const  categoryRoutes  =  require ( "./category.router" );
const  tourRoutes  =  require ( "./tour.router" );
const  orderRoutes  =  require ( "./order.router" );
const  contactRoutes  =  require ( "./contact.router" );
const  userRoutes  =  require ( "./user.router" );
const  settingRoutes  =  require ( "./setting.router" );
const  profileRoutes  =  require ( "./profile.router" );
const  uploadRoutes  =  require ( "./upload.router" );

const authMiddleware = require("../../middlewares/admin/auth.middleware");

router.use( "/account" ,  accountRoutes )
router.use( "/dashboard" ,  authMiddleware.verifyToken, dashboardRoutes )
router.use( "/category" ,  authMiddleware.verifyToken, categoryRoutes )
router.use( "/tour" ,   authMiddleware.verifyToken, tourRoutes )
router.use( "/order" ,   authMiddleware.verifyToken, orderRoutes )
router.use( "/contact" ,   authMiddleware.verifyToken, contactRoutes )
router.use( "/user" ,   authMiddleware.verifyToken, userRoutes )
router.use( "/setting" ,   authMiddleware.verifyToken, settingRoutes )
router.use( "/profile" ,   authMiddleware.verifyToken, profileRoutes )
router.use("/upload", uploadRoutes);

// Route 404 này phải nằm ở cuối cùng của file index/app
router.use(authMiddleware.verifyToken, (req, res) => {
    res.status(404).render('admin/pages/error-404', {
        pageTitle: "404 Not Found" // Đã sửa lỗi khoảng trắng
    });
});

module.exports = router ;
