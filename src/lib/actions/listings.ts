'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { ListingInsert } from '@/types/database';

export async function getListings(limit?: number, featuredOnly?: boolean) {
  const supabase = await createClient();

  let query = supabase
    .from('listings')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (featuredOnly) query = query.eq('featured', true);
  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getListing(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('listings')
    .select('*, profiles(full_name)')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function getUserListings(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createListing(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  const listing: ListingInsert = {
    user_id: user.id,
    title: formData.get('title') as string,
    price: parseInt(formData.get('price') as string),
    description: formData.get('description') as string,
    location: formData.get('location') as string,
    city: formData.get('city') as string,
    bedrooms: parseInt(formData.get('bedrooms') as string) || null,
    bathrooms: parseInt(formData.get('bathrooms') as string) || null,
    area_m2: parseInt(formData.get('area_m2') as string) || null,
    property_type: formData.get('property_type') as string,
    images: [],
    status: 'active',
    featured: false,
  };

  const { data, error } = await supabase
    .from('listings')
    .insert(listing)
    .select()
    .single();

  if (error) throw error;

  revalidatePath('/listings');
  revalidatePath('/dashboard');
  redirect(`/listings/${data.id}`);
}

export async function deleteListing(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('listings').delete().eq('id', id);
  if (error) throw error;
  revalidatePath('/dashboard');
  revalidatePath('/listings');
}
