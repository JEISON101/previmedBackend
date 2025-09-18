import PlanXBeneficio from "#models/plan_x_beneficio";
import { DataPlanXBeneficios } from "../interfaces/plan_x_beneficios.js";

export default class PlanXBeneficiosServices{
    async create(data:DataPlanXBeneficios){
        return PlanXBeneficio.create(data)
    }
    async list(){
        return PlanXBeneficio.all()
    }
    async findById(id:number){
        return PlanXBeneficio.findOrFail(id)
    }

    async update(id:number,data:Partial<DataPlanXBeneficios>){
        const planXBeneficio = await PlanXBeneficio.findOrFail(id)
        planXBeneficio.merge(data)
        await planXBeneficio.save()
        return planXBeneficio
    }

    async delete(id:number){
        const planXBeneficio = await PlanXBeneficio.findOrFail(id)
        await planXBeneficio.delete()
        return {message:'Plan x Beneficio eliminado correctamente'}
    }
}