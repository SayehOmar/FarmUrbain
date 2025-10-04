import mongoose, { Schema, Document } from 'mongoose';

export interface IGeometry extends Document {
  type: string;
  coordinates: number[] | number[][];
  properties?: Record<string, any>;
}

const GeometrySchema: Schema = new Schema({
  type: {
    type: String,
    required: true,
    enum: ['Point', 'LineString', 'Polygon', 'MultiPoint', 'MultiLineString', 'MultiPolygon'],
  },
  coordinates: {
    type: Schema.Types.Mixed,
    required: true,
  },
  properties: {
    type: Schema.Types.Mixed,
  },
});

const Geometry = mongoose.models.Geometry || mongoose.model<IGeometry>('Geometry', GeometrySchema, 'UrbFarm');

export default Geometry;
