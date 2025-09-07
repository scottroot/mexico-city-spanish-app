import { NextResponse } from 'next/server';
import { getVerbByInfinitive } from '../../../utils/verbs';

export async function GET(
  request: Request,
  context: { params: { infinitive: string } }
) {
  try {
    const { params } = await Promise.resolve(context);
    const infinitive = decodeURIComponent(params.infinitive);
    const verb = await getVerbByInfinitive(infinitive);
    
    if (!verb) {
      return NextResponse.json(
        { error: 'Verb not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(verb);
  } catch (error) {
    console.error('Error loading verb:', error);
    return NextResponse.json(
      { error: 'Failed to load verb' },
      { status: 500 }
    );
  }
} 