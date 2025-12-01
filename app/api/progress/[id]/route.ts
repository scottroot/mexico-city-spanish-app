import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getUser } from '@/utils/supabase/auth';

// PUT/PATCH - Update existing progress
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Get current user
    const { error: userError, ...user } = await getUser();
    if (userError || !user.isLoggedIn) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Parse request body
    const updateData = await request.json();

    const { data, error } = await supabase
      .from('progress')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id) // Ensure user can only update their own progress
      .select()
      .single();

    if (error) {
      console.error('Error updating progress:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in PUT /api/progress/[id]:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete progress record
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Get current user
    const { error: userError, ...user } = await getUser();
    if (userError || !user.isLoggedIn) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    const { error } = await supabase
      .from('progress')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id); // Ensure user can only delete their own progress

    if (error) {
      console.error('Error deleting progress:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/progress/[id]:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
