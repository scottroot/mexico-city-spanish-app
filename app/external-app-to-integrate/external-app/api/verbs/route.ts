import { NextResponse } from 'next/server';
import { getAllVerbs } from '../../utils/verbs';

export async function GET() {
  try {
    console.log('Loading verbs from SQLite...');
    const verbs = await getAllVerbs();
    console.log('Loaded verbs count:', verbs.length);
    console.log('First verb:', verbs[0]);
    return NextResponse.json(verbs);
  } catch (error) {
    console.error('Error loading verbs:', error);
    return NextResponse.json(
      { error: 'Failed to load verbs' },
      { status: 500 }
    );
  }
} 