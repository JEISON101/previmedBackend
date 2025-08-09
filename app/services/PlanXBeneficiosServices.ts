import PlanXBeneficio from "#models/plan_x_beneficio";
import { DataPlanXBeneficios } from "../interfaces/plan_x_beneficios.js";

export default class PlanXBeneficiosServices{
    async create(data:DataPlanXBeneficios){
        return PlanXBeneficio.create(data)
    }
}