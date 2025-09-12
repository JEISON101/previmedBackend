import EpsController from "#controllers/EpsController";
import router from "./medicos.js";

const Eps = new EpsController();

//rutas eps
router.get('/read', Eps.read)
router.get('/listar/:id',Eps.readId)
router.post('/register', Eps.register)
router.put('/update', Eps.update)
router.delete('/delete/:id', Eps.update)