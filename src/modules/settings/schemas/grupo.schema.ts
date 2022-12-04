import * as mongoose from 'mongoose';

export const GrupoSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  grupo: {
    type: String,
  },
});
