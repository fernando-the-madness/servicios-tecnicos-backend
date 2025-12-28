// backend/src/utils/aiPredictor.js
import { prediction } from 'simple-ml'

export const predictDemand = (historical) => {
  return prediction.linear(historical)
}