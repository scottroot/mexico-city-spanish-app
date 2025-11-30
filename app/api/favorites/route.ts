import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getUser } from '@/utils/supabase/auth';

// GET - Get user's favorite verbs
export async function GET() {
  try {
    const supabase = await createClient();

    // Get current user
    const { error: userError, ...user } = await getUser();
    if (userError || !user.isLoggedIn) {
      // Return empty array for unauthenticated users (graceful degradation)
      return NextResponse.json({ favorites: [] });
    }

    // Get user favorites
    const { data, error } = await supabase
      .from('user_favorites')
      .select('verb_infinitive')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      // If table doesn't exist yet, return empty favorites (graceful degradation)
      const errorMessage = error.message || error.toString() || '';
      if (errorMessage.includes('relation "user_favorites" does not exist') ||
          errorMessage.includes('does not exist') ||
          errorMessage.includes('relation')) {
        console.log('User favorites table does not exist yet, returning empty favorites');
        return NextResponse.json({ favorites: [] });
      }
      console.error('Error getting favorites:', error);
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      );
    }

    const favorites = data?.map(fav => fav.verb_infinitive) || [];
    return NextResponse.json({ favorites });
  } catch (error) {
    console.error('Error in GET /api/favorites:', error);
    return NextResponse.json(
      { error: 'Failed to get favorites' },
      { status: 500 }
    );
  }
}

// POST - Add a verb to favorites
export async function POST(request: Request) {
  try {
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
    const { verbInfinitive } = await request.json();

    if (!verbInfinitive) {
      return NextResponse.json(
        { error: 'verbInfinitive is required' },
        { status: 400 }
      );
    }

    // Check if already favorited
    const { data: existing, error: checkError } = await supabase
      .from('user_favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('verb_infinitive', verbInfinitive)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking existing favorite:', checkError);
      return NextResponse.json(
        { error: checkError.message },
        { status: 500 }
      );
    }

    if (existing) {
      return NextResponse.json(
        { error: 'Already favorited' },
        { status: 400 }
      );
    }

    // Add to favorites
    const { data, error } = await supabase
      .from('user_favorites')
      .insert([{
        user_id: user.id,
        verb_infinitive: verbInfinitive
      }])
      .select()
      .single();

    if (error) {
      // If table doesn't exist yet, return error
      const errorMessage = error.message || error.toString() || '';
      if (errorMessage.includes('relation "user_favorites" does not exist') ||
          errorMessage.includes('does not exist') ||
          errorMessage.includes('relation')) {
        console.log('User favorites table does not exist yet');
        return NextResponse.json(
          { error: 'Table not ready' },
          { status: 503 }
        );
      }
      console.error('Error adding favorite:', error);
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in POST /api/favorites:', error);
    return NextResponse.json(
      { error: 'Failed to add favorite' },
      { status: 500 }
    );
  }
}

// DELETE - Remove a verb from favorites
export async function DELETE(request: Request) {
  try {
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
    const { verbInfinitive } = await request.json();

    if (!verbInfinitive) {
      return NextResponse.json(
        { error: 'verbInfinitive is required' },
        { status: 400 }
      );
    }

    // Remove from favorites
    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('verb_infinitive', verbInfinitive);

    if (error) {
      // If table doesn't exist yet, return success (graceful degradation)
      const errorMessage = error.message || error.toString() || '';
      if (errorMessage.includes('relation "user_favorites" does not exist') ||
          errorMessage.includes('does not exist') ||
          errorMessage.includes('relation')) {
        console.log('User favorites table does not exist yet');
        return NextResponse.json({ success: true });
      }
      console.error('Error removing favorite:', error);
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/favorites:', error);
    return NextResponse.json(
      { error: 'Failed to remove favorite' },
      { status: 500 }
    );
  }
}
