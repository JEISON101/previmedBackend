import EpsController from "#controllers/EpsController";
import router from "./medicos.js";


//rutas eps
router.group(() => {
    //liostar todas
    router.get('/read', [EpsController, 'read'])
    router.get('/read/:id', [EpsController, 'readId'])
    router.post('/register',[EpsController, 'register'])
    router.put('/update/:id', [EpsController, 'update'])
    router.delete('/delete/:id', [EpsController, 'delete'])
}).prefix('/eps')