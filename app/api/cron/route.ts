import { NextRequest, NextResponse } from 'next/server';


export async function GET(_request: NextRequest) {
  try {
    return NextResponse.json({ });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
