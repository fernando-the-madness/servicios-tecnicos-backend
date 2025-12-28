import mongoose from 'mongoose'

const serviceRequestSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  clientName: {
    type: String,
    required: true
  },
  technicianId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  technicianName: {
    type: String,
    default: null
  },
  service: {
    type: String,
    required: true,
    enum: ['Limpieza', 'Plomería', 'Electricidad', 'Pintura']
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pendiente', 'aceptado', 'en camino', 'en proceso', 'finalizado', 'cancelado'],
    default: 'pendiente'
  },
  priority: {
    type: String,
    enum: ['normal', 'alta', 'urgente'],
    default: 'normal'
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String }
  },
  evidence: [{
    url: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  estimatedTime: {
    type: Number, // en minutos
    default: null
  },
  rating: {
    stars: { type: Number, min: 1, max: 5 },
    comment: String,
    createdAt: Date
  }
}, {
  timestamps: true
})

export default mongoose.model('ServiceRequest', serviceRequestSchema)