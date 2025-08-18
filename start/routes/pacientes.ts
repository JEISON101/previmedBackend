import PacientesController from "#controllers/PacientesController";
import router from "@adonisjs/core/services/router";


const paciente = new PacientesController();

router.post('/pacientes', paciente.create);
router.get('/pacientes', paciente.readAll);
router.get('/pacientes/:id', paciente.readById);
router.delete('/pacientes/:id', paciente.deleteById);
router.put('/pacientes/:id', paciente.updateById);