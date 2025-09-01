import Role from "#models/role";

class RolesServices{
    
    async crear(data:{
        nombre_rol:string,
         estado:boolean
    }){
        return await Role.create(data)
    }

    async listar(){
        return await Role.query()
    }

    async listarId(id:number){
        return await Role.find(id)
    }

    async actualizarRol(id:number, data:{
     nombre_rol?:string,
     estado?:boolean
    }){
        const rol = await Role.query().where('id_rol',id).firstOrFail()
        return await rol.merge(data).save()
    }

    async eliminar(id:number){
    const encontrado = await Role.find(id)
            if (encontrado) {
              await encontrado.delete()
              return 'Rol eliminado correctamente'
            } else {
              return 'No se eliminó'
            }
        }

    async conteo(){
        const resultado = await Role.query().count('* as total')
        return resultado[0].$extras.total
    }
    }

    export default RolesServices;