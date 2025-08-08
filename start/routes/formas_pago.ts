import FormasPagosController from "#controllers/FormasPagosController";
import router from "@adonisjs/core/services/router";

const formaPago = new FormasPagosController();


router.post('/formapago', formaPago.createFormaPago);