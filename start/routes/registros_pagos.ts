import RegistrosPagoController from "#controllers/RegistrosPagosController";
import router from "@adonisjs/core/services/router";

const controller = new RegistrosPagoController();
router.get('/registros-pago', (ctx) => controller.get_all_registros_pago(ctx));
router.get('/registro-pago/:id', (ctx) => controller.get_registro_pago_id(ctx));
router.post('/registro-pago', (ctx) => controller.create_registro_pago(ctx));
router.put('/registro-pago/:id', (ctx) => controller.update_registro_pago(ctx));
router.delete('/registro-pago/:id', (ctx) => controller.delete_registro_pago(ctx));
router.get('/registros-pago/membresia/:id', (ctx) => controller.get_pagos_by_membresia(ctx));

///registros-pago/ingresos/mes/2025-04
router.get('/registros-pago/ingresos/mes/:period', (ctx) => controller.ingresos_mes_total_slug(ctx)); // /YYYY-MM
router.get('/registros-pago/ingresos/mensual',           (ctx) => controller.ingresos_mensual(ctx));        // ?year=YYYY

router.get('/registros-pago/asignados/:id_usuario', (ctx) => controller.getPagosAsigandosByUser(ctx));
router.patch('/registros-pago/set/estado/:estado/:id_pago', (ctx) => controller.setEstadoPago(ctx));
router.patch('/registros-pago/subir/evidencia/:id_pago', (ctx) => controller.subirEvidencia(ctx));