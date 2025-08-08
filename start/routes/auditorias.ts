import AuditoriasController from "#controllers/AuditoriasController";
import router from "@adonisjs/core/services/router";

const auditoria = new AuditoriasController();

router.post('/auditoria', auditoria.createAuditoria);