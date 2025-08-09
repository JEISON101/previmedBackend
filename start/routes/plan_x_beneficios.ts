import PlanXBeneficiosController from "#controllers/PlanXBeneficiosController";
import router from "@adonisjs/core/services/router";

const planxBeneficio = new PlanXBeneficiosController();


router.post('/planxbeneficio', planxBeneficio.createPlanBeneficio);