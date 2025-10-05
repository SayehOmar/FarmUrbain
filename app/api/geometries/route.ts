import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Geometry from '@/lib/models/Geometry';

export async function GET() {
  try {
    await connectDB();
    const geometries = await Geometry.find({});
    return NextResponse.json(geometries, { status: 200 });
  } catch (error) {
    console.error('Error fetching geometries:', error);
    return NextResponse.json({ message: 'Error fetching geometries', error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { type, coordinates, properties } = body;

    if (!type || !coordinates) {
      return NextResponse.json({ message: 'Type and coordinates are required' }, { status: 400 });
    }

    const newGeometry = new Geometry({ type, coordinates, properties });
    await newGeometry.save();

    return NextResponse.json({ message: 'Geometry saved successfully', geometry: newGeometry }, { status: 201 });
  } catch (error) {
    console.error('Error saving geometry:', error);
    return NextResponse.json({ message: 'Error saving geometry', error: (error as Error).message }, { status: 500 });
  }
}
