import ContactosController from "#controllers/ContactosController";
import router from "./medicos.js";

const contactos = new ContactosController();


router.post('/contactos/create', contactos.create);
router.get('/contactos/read', contactos.read);
router.put('/contactos/update/fields/:id', contactos.update);
