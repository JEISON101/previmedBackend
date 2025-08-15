import RegistrosPagoController from "#controllers/RegistrosPagosController";
import router from "@adonisjs/core/services/router";

const controller = new RegistrosPagoController();
router.get('/registros-pago', (ctx) => controller.get_all_registros_pago(ctx));
router.get('/registro-pago/:id', (ctx) => controller.get_registro_pago_id(ctx));
router.post('/registro-pago', (ctx) => controller.create_registro_pago(ctx));
router.put('/registro-pago/:id', (ctx) => controller.update_registro_pago(ctx));
router.delete('/registro-pago/:id', (ctx) => controller.delete_registro_pago(ctx));
