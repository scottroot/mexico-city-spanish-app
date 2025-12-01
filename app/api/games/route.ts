import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
// import { getUser } from '@/utils/supabase/auth';

// GET /api/games - List all games
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching games:', error);
      return NextResponse.json({ error: 'Failed to fetch games' }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error in games API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// // POST /api/games - Create a new game (admin only)
// export async function POST(request: NextRequest) {
//   try {
//     const supabase = await createClient();
    
//     // Get authenticated user
//     const { error: authError, ...user } = await getUser();
//     if (authError || !user) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     // TODO: Add admin check here
//     // For now, we'll allow any authenticated user to create games
//     // You should add proper admin authorization

//     const body = await request.json();
//     const { id, title, type, difficulty, content } = body;

//     if (!id || !title || !type || !difficulty || !content) {
//       return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
//     }

//     const { data, error } = await supabase
//       .from('games')
//       .insert([{ id, title, type, difficulty, content }])
//       .select()
//       .single();

//     if (error) {
//       console.error('Error creating game:', error);
//       return NextResponse.json({ error: 'Failed to create game' }, { status: 500 });
//     }

//     return NextResponse.json({ data }, { status: 201 });
//   } catch (error) {
//     console.error('Error in games POST API:', error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }
