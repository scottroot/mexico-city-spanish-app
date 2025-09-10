import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// GET /api/games/[id] - Get a specific game
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Game not found' }, { status: 404 });
      }
      console.error('Error fetching game:', error);
      return NextResponse.json({ error: 'Failed to fetch game' }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error in game GET API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/games/[id] - Update a specific game (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Add admin check here
    // For now, we'll allow any authenticated user to update games
    // You should add proper admin authorization

    const body = await request.json();
    const { title, type, difficulty, content } = body;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (type !== undefined) updateData.type = type;
    if (difficulty !== undefined) updateData.difficulty = difficulty;
    if (content !== undefined) updateData.content = content;

    const { id } = await params;
    
    const { data, error } = await supabase
      .from('games')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Game not found' }, { status: 404 });
      }
      console.error('Error updating game:', error);
      return NextResponse.json({ error: 'Failed to update game' }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error in game PUT API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/games/[id] - Delete a specific game (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Add admin check here
    // For now, we'll allow any authenticated user to delete games
    // You should add proper admin authorization

    const { id } = await params;
    
    const { error } = await supabase
      .from('games')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting game:', error);
      return NextResponse.json({ error: 'Failed to delete game' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Game deleted successfully' });
  } catch (error) {
    console.error('Error in game DELETE API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
