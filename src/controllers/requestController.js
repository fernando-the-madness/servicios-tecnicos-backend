import ServiceRequest from '../models/ServiceRequest.js'
import cloudinary from 'cloudinary'

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// ========== CREATE ==========
export const createRequest = async (req, res) => {
  try {
    const { service, description, location, priority } = req.body
    const clientId = req.user.id // Desde el middleware de autenticación
    const clientName = req.user.name

    if (!service || !description || !location) {
      return res.status(400).json({ msg: 'Faltan datos requeridos' })
    }

    const newRequest = new ServiceRequest({
      clientId,
      clientName,
      service,
      description,
      location,
      priority: priority || 'normal',
      status: 'pendiente'
    })

    await newRequest.save()

    res.status(201).json({
      msg: 'Solicitud creada exitosamente',
      request: newRequest
    })
  } catch (err) {
    res.status(500).json({ msg: 'Error al crear solicitud', error: err.message })
  }
}

// ========== READ ALL ==========
export const getRequests = async (req, res) => {
  try {
    const { status, service, userId, role } = req.query

    let filter = {}

    // Filtrar por estado
    if (status) filter.status = status

    // Filtrar por servicio
    if (service) filter.service = service

    // Si es cliente, solo ver sus solicitudes
    if (role === 'cliente') {
      filter.clientId = userId
    }

    // Si es técnico, ver solo pendientes o sus asignadas
    if (role === 'tecnico') {
      filter.$or = [
        { status: 'pendiente' },
        { technicianId: userId }
      ]
    }

    const requests = await ServiceRequest.find(filter)
      .populate('clientId', 'name email')
      .populate('technicianId', 'name email')
      .sort({ createdAt: -1 })

    res.json({
      total: requests.length,
      requests
    })
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener solicitudes', error: err.message })
  }
}

// ========== READ ONE ==========
export const getRequestById = async (req, res) => {
  try {
    const { id } = req.params

    const request = await ServiceRequest.findById(id)
      .populate('clientId', 'name email phone')
      .populate('technicianId', 'name email phone')

    if (!request) {
      return res.status(404).json({ msg: 'Solicitud no encontrada' })
    }

    res.json(request)
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener solicitud', error: err.message })
  }
}

// ========== UPDATE ==========
export const updateRequest = async (req, res) => {
  try {
    const { id } = req.params
    const { status, technicianId, technicianName, estimatedTime, rating } = req.body

    const request = await ServiceRequest.findById(id)

    if (!request) {
      return res.status(404).json({ msg: 'Solicitud no encontrada' })
    }

    // Actualizar campos
    if (status) request.status = status
    if (technicianId) request.technicianId = technicianId
    if (technicianName) request.technicianName = technicianName
    if (estimatedTime) request.estimatedTime = estimatedTime
    if (rating) {
      request.rating = {
        ...rating,
        createdAt: new Date()
      }
    }

    await request.save()

    res.json({
      msg: 'Solicitud actualizada',
      request
    })
  } catch (err) {
    res.status(500).json({ msg: 'Error al actualizar solicitud', error: err.message })
  }
}

// ========== DELETE ==========
export const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params

    const request = await ServiceRequest.findByIdAndDelete(id)

    if (!request) {
      return res.status(404).json({ msg: 'Solicitud no encontrada' })
    }

    res.json({ msg: 'Solicitud eliminada exitosamente' })
  } catch (err) {
    res.status(500).json({ msg: 'Error al eliminar solicitud', error: err.message })
  }
}

// ========== ACCEPT REQUEST (Técnico) ==========
export const acceptRequest = async (req, res) => {
  try {
    const { id } = req.params
    const technicianId = req.user.id
    const technicianName = req.user.name

    const request = await ServiceRequest.findById(id)

    if (!request) {
      return res.status(404).json({ msg: 'Solicitud no encontrada' })
    }

    if (request.status !== 'pendiente') {
      return res.status(400).json({ msg: 'La solicitud ya fue aceptada' })
    }

    request.status = 'aceptado'
    request.technicianId = technicianId
    request.technicianName = technicianName

    await request.save()

    res.json({
      msg: 'Solicitud aceptada exitosamente',
      request
    })
  } catch (err) {
    res.status(500).json({ msg: 'Error al aceptar solicitud', error: err.message })
  }
}

// ========== UPLOAD EVIDENCE ==========
export const uploadEvidence = async (req, res) => {
  try {
    const { requestId, data } = req.body

    const uploadedResponse = await cloudinary.v2.uploader.upload(data, {
      folder: 'evidencias'
    })

    const request = await ServiceRequest.findById(requestId)

    if (!request) {
      return res.status(404).json({ msg: 'Solicitud no encontrada' })
    }

    request.evidence.push({
      url: uploadedResponse.secure_url,
      uploadedAt: new Date()
    })

    await request.save()

    res.json({
      msg: 'Evidencia subida exitosamente',
      url: uploadedResponse.secure_url
    })
  } catch (err) {
    res.status(500).json({ msg: 'Error al subir imagen', error: err.message })
  }
}