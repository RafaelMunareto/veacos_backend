import { Document } from 'mongoose';

export interface Grupo extends Document {
  id: string;
  grupo: string;
}
