import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['cliente', 'tecnico'], required: true },
    phone: String,
    location: {
      type: { type: String, default: 'Point' },
      coordinates: [Number]
    },
    isAvailable: { type: Boolean, default: false }
  },
  { timestamps: true }
)

// ✅ Hook OFICIAL y limpio
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  try {
    this.password = await bcrypt.hash(this.password, 10)
    next()
  } catch (err) {
    next(err)
  }
})

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

export default mongoose.model('User', userSchema)