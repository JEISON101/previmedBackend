import FormasPagosController from "#controllers/FormasPagosController";
import router from "@adonisjs/core/services/router";

//rutas formas de pago
router.group(() => {
    //liostar todas 
    router.get('/read', [FormasPagosController, 'read'])
    router.get('/read/:id', [FormasPagosController, 'readId'])
    router.post('/register',[FormasPagosController, 'register'])
    router.put('/update', [FormasPagosController, 'update'])
    router.delete('/delete/:id', [FormasPagosController, 'delete'])
    
}).prefix('/formas_pago')