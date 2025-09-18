import PlanXBeneficiosController from "#controllers/PlanXBeneficiosController";
import router from "@adonisjs/core/services/router";

const planxBeneficio = new PlanXBeneficiosController();

router.group(() => {
    router.post('/', planxBeneficio.create.bind(PlanXBeneficiosController))
    router.get('/', planxBeneficio.getAllPlanBeneficios.bind(PlanXBeneficiosController))
    router.get('/:id', planxBeneficio.getPlanBeneficioById.bind(PlanXBeneficiosController))
    router.put('/:id', planxBeneficio.updatePlanBeneficio.bind(PlanXBeneficiosController))
    router.delete('/:id', planxBeneficio.deletePlanBeneficio.bind(PlanXBeneficiosController))

}).prefix('/planxbeneficios');