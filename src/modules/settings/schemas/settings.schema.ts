import * as mongoose from 'mongoose';
export const SettingsSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  foto: {
    type: String,
  },
  grupo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Grupo',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});
