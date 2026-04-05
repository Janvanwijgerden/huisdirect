import { NextResponse } from 'next/server';
import { createClient } from '../../../../lib/supabase/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  
  const { data: listing } = await supabase
    .from('listings')
    .select('views')
    .eq('id', params.id)
    .single();

  if (listing) {
    await supabase
      .from('listings')
      .update({ views: (listing.views || 0) + 1 })
      .eq('id', params.id);
  }

  return NextResponse.redirect(new URL(`/listings/${params.id}`, request.url));
}
