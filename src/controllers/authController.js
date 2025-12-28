import User from '../models/User.model.js'
import jwt from 'jsonwebtoken'

// ✅ Generar token con TODOS los datos del usuario
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role 
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

// ========== REGISTRO ==========
export const register = async (req, res) => {
  console.log('BODY recibido:', req.body)
  const { name, email, password, role } = req.body

  try {
    // Validar campos requeridos
    if (!name || !email || !password || !role) {
      return res.status(400).json({ msg: 'Todos los campos son requeridos' })
    }

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ msg: 'El usuario ya existe' })
    }

    // Crear usuario
    const user = await User.create({ name, email, password, role })

    // Generar token
    const token = generateToken(user)

    res.status(201).json({
      msg: 'Usuario registrado exitosamente',
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      }
    })
  } catch (err) {
    console.log('ERROR en register:', err.message)
    res.status(500).json({ msg: 'Error al registrar', error: err.message })
  }
}

// ========== LOGIN ==========
export const login = async (req, res) => {
  const { email, password } = req.body

  try {
    // Validar campos
    if (!email || !password) {
      return res.status(400).json({ msg: 'Email y contraseña son requeridos' })
    }

    // Buscar usuario
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ msg: 'Credenciales incorrectas' })
    }

    // Verificar contraseña
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({ msg: 'Credenciales incorrectas' })
    }

    // Generar token
    const token = generateToken(user)

    res.json({
      msg: 'Inicio de sesión exitoso',
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      }
    })
  } catch (err) {
    console.log('ERROR en login:', err.message)
    res.status(500).json({ msg: 'Error al iniciar sesión', error: err.message })
  }
}

// ========== VERIFICAR TOKEN ==========
export const verifyUser = async (req, res) => {
  try {
    // El usuario ya fue agregado por el middleware verifyToken
    const user = await User.findById(req.user.id).select('-password')
    
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' })
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (err) {
    res.status(500).json({ msg: 'Error al verificar usuario', error: err.message })
  }
}