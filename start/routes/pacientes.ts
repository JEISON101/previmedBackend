import router from "@adonisjs/core/services/router";

import PacientesController from "#controllers/PacientesController";

router.get('/pacientes', [PacientesController, 'index'])
router.get('/pacientes/:id', [PacientesController, 'show'])
router.post('/pacientes', [PacientesController, 'store'])
router.put('/pacientes/:id', [PacientesController, 'update'])
router.delete('/pacientes/:id', [PacientesController, 'destroy'])