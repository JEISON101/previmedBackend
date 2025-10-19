import PacientesController from '#controllers/PacientesController'
import router from '@adonisjs/core/services/router'

const paciente = new PacientesController()

//  crear paciente
router.post('/pacientes', paciente.create)

//  listar todos los pacientes
router.get('/pacientes', paciente.readAll)

//  listar todos los beneficiarios
router.get('/pacientes/beneficiarios', paciente.readBeneficiarios)

//  asociar beneficiario a titular
router.put('/pacientes/asociar/:id', paciente.asociarBeneficiario)

//  listar todos los titulares
router.get('/pacientes/titular', paciente.readByITitular)

//lista los beneficiarios de un titular
router.get('/pacientes/beneficiarios/:paciente_id', paciente.readBeneficiarios)

// listar paciente del usuario autenticado
router.get('/pacientes/mi-perfil', paciente.readByUsuarioLogueado)

// Buscar paciente por usuario_id (por beneficiario ojo)
router.get('/pacientes/por-usuario/:usuario_id', paciente.readByUsuarioId)

router.get('/pacientes/:id', paciente.readById)
router.put('/pacientes/:id', paciente.updateById)
router.delete('/pacientes/:id', paciente.deleteById)