import express from 'express'
import {
  createRequest,
  getRequests,
  getRequestById,
  updateRequest,
  deleteRequest,
  acceptRequest,
  uploadEvidence
} from '../controllers/requestController.js'
import { verifyToken } from '../middleware/auth.middleware.js' // Ajusta según tu middleware

const router = express.Router()

// ========== CRUD ROUTES ==========

// CREATE - Crear solicitud (Cliente)
router.post('/', verifyToken, createRequest)

// READ - Ver todas las solicitudes (Cliente ve las suyas, Técnico ve pendientes)
router.get('/', verifyToken, getRequests)

// READ - Ver una solicitud por ID
router.get('/:id', verifyToken, getRequestById)

// UPDATE - Actualizar solicitud (Cliente/Técnico)
router.put('/:id', verifyToken, updateRequest)

// DELETE - Eliminar solicitud (Cliente/Admin)
router.delete('/:id', verifyToken, deleteRequest)

// ========== SPECIAL ROUTES ==========

// ACCEPT - Técnico acepta solicitud
router.post('/:id/accept', verifyToken, acceptRequest)

// UPLOAD - Subir evidencia fotográfica
router.post('/evidence', verifyToken, uploadEvidence)

export default router