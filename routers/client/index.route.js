const  router  =  require ( "express" ). Router ();
const  homeRoutes  =  require ( "./home.router" );
const  tourRoutes  =  require ( "./tour.router" );
const  cartRoutes  =  require ( "./cart.router" );
const categoryRoutes = require("./category.router");
const settingMiddleware  = require("../../middlewares/client/setting.middleware");
const categoryMiddleware = require("../../middlewares/client/category.middleware");
const cityMiddleware = require("../../middlewares/client/city.middleware");
const  searchRoutes  =  require ( "./search.router" );
const  orderRoutes  =  require ( "./order.router" );

router.use(settingMiddleware.websiteInfo);
router.use(categoryMiddleware.list);

// Sử dụng middleware cho tất cả các route bên dưới tệp này
router.use(cityMiddleware.list);

router . use ( '/' ,  homeRoutes )
router . use ( '/tours' ,  tourRoutes )
router . use ( '/cart' ,  cartRoutes )
router.use('/order', orderRoutes);
router.use('/category', categoryRoutes);
router . use ( '/search' ,  searchRoutes )

module.exports = router ;
