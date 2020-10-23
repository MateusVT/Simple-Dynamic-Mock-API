import { Router } from 'express';
import * as newRouteController from '../controllers/new-route/new-route';
function generateStaticRoutes(router: Router) {
    //                   ----- GETs -----
    // router.get('/example', exampleController.example);

    //                   ----- POSTs -----
    router.post('/new-route', newRouteController.create);
    // router.post('/example', exampleController.validator, exampleController.example);

    //                   ----- PATCHs -----
    // router.patch('/example', exampleController.validator, exampleController.example);
}

export default generateStaticRoutes;
