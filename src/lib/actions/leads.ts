'use server';

import { createClient } from '../supabase/server';
import { sendLeadNotification } from './email';
import { revalidatePath } from 'next/cache';

export async function submitLead(formData: FormData) {
  const supabase = await createClient();

  const listingId = formData.get('listingId') as string;
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const requestType = formData.get('requestType') as string;
  const message = formData.get('message') as string;

  if (!listingId || !name || !email || !requestType) {
    return { error: 'Verplichte velden ontbreken.' };
  }

  // Find the seller ID cleanly based on listing ID. This avoids trusting the client with the seller ID.
  const { data: listing, error: listingError } = await supabase
    .from('listings')
    .select('user_id, title')
    .eq('id', listingId)
    .single();

  if (listingError || !listing) {
    return { error: 'Kon de listing niet vinden. Het adres is wellicht verwijderd of offline.' };
  }

  if (!listing.user_id) {
    return { error: 'Kan geen aanvraag versturen omdat de verkoper niet bekend is.' };
  }

  // Prepare Lead Insert
  const { error: insertError } = await supabase
    .from('leads')
    .insert({
      listing_id: listingId,
      seller_user_id: listing.user_id,
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : null,
      request_type: requestType as 'bezichtiging' | 'informatie' | 'terugbellen',
      message: message ? message.trim() : null,
      status: 'new'
    });

  if (insertError) {
    console.error('Failed to insert lead', insertError);
    return { error: 'Er was een probleem met uw aanvraag opslaan. Probeer het later nog eens.' };
  }

  let sellerEmail = 'fallback@example.com'; 
  
  if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const { createClient: createAdminClient } = await import('@supabase/supabase-js');
    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    const { data: adminData } = await supabaseAdmin.auth.admin.getUserById(listing.user_id);
    if (adminData?.user?.email) sellerEmail = adminData.user.email;
  } else {
    console.warn("⚠️ SUPABASE_SERVICE_ROLE_KEY ontbreekt in .env; admin bypass fallback is gebruikt.");
  }

  await sendLeadNotification(
    sellerEmail,
    name.trim(),
    email.trim(),
    phone ? phone.trim() : null,
    requestType,
    message ? message.trim() : null,
    listing.title || 'Uw woning'
  );

  return { success: true };
}

export async function getUserLeads(sellerUserId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('leads')
    .select('*, listing:listings(title)')
    .eq('seller_user_id', sellerUserId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching leads:", error);
    return [];
  }
  return data || [];
}

export async function updateLeadStatus(leadId: string, status: 'new' | 'contacted' | 'closed') {
  console.log(`[updateLeadStatus] Aangeroepen voor leadId: ${leadId} met status: ${status}`);

  if (!leadId || !status) {
    throw new Error("Lead ID of status ontbreekt.");
  }

  const supabase = await createClient();
  
  // .select() toegevoegd zodat we data teruggrijpen. Zero rows = RLS blokkade!
  const { data, error } = await supabase
    .from('leads')
    .update({ status })
    .eq('id', leadId)
    .select();

  console.log(`[updateLeadStatus] Resultaat:`, {
    error: error?.message || null,
    aantalGeupdateRows: data?.length || 0,
    retourData: data
  });

  if (error) {
    console.error("Supabase Database Error:", error);
    throw new Error("Database fout bij het updaten.");
  }

  if (!data || data.length === 0) {
    console.warn("⚠️ Geen rijen geüpdatet! Betekent bijna altijd: Supabase Row Level Security (RLS) UPDATE policy mist of blokkeert.");
    throw new Error("Update genegeerd (waarschijnlijk RLS blokkade).");
  }
  
  revalidatePath('/dashboard');
}
