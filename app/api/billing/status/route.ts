import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ hasAccess: false }, { status: 401 });
    }

    // Check billing access using the RPC function
    const { data: hasAccess, error: billingError } = await supabase.rpc('has_access', { uid: user.id });
    
    if (billingError) {
      console.error('Error checking billing access:', billingError);
      return NextResponse.json({ hasAccess: false }, { status: 500 });
    }

    // Get subscription details if user has access
    let subscription = undefined;
    if (hasAccess) {
      const { data: subData, error: subError } = await supabase
        .from('billing.subscriptions')
        .select('id, status, current_period_end, cancel_at_period_end')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();
      
      if (!subError && subData) {
        subscription = {
          id: subData.id,
          status: subData.status,
          currentPeriodEnd: subData.current_period_end,
          cancelAtPeriodEnd: subData.cancel_at_period_end,
        };
      }
    }

    return NextResponse.json({
      hasAccess: hasAccess === true,
      subscription,
    });

  } catch (error) {
    console.error('Billing status API error:', error);
    return NextResponse.json({ hasAccess: false }, { status: 500 });
  }
}
