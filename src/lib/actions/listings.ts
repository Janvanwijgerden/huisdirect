'use server';

import { createClient } from '../supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function getListings(limit?: number, featuredOnly?: boolean) {
  const supabase = await createClient();

  let query = supabase
    .from('listings')
    .select(`
      *,
      listing_images(id, public_url, is_cover, position)
    `)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (featuredOnly) query = query.eq('is_featured', true);
  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw error;

  const mapped = (data ?? []).map((listing: any) => {
    const cover =
      listing.listing_images?.find((img: any) => img.is_cover) ||
      listing.listing_images?.[0];

    return {
      ...listing,
      image: cover?.public_url || null,
    };
  });

  return mapped;
}

export async function getListing(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function getListingWithImages(id: string) {
  const supabase = await createClient();

  const { data: listing, error: listingError } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .single();

  if (listingError) throw listingError;

  const { data: images, error: imagesError } = await supabase
    .from('listing_images')
    .select('*')
    .eq('listing_id', id)
    .order('position', { ascending: true });

  if (imagesError) throw imagesError;

  return { ...listing, images: images || [] };
}

export async function getUserListings(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('listings')
    .select(`
      *,
      listing_images(id, public_url, is_cover)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  const mapped = (data ?? []).map((listing: any) => {
    const cover =
      listing.listing_images?.find((img: any) => img.is_cover) ||
      listing.listing_images?.[0];

    return {
      ...listing,
      image: cover?.public_url || null,
    };
  });

  return mapped;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .trim();
}

export async function createDraftListing(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Je bent niet ingelogd.');

  const title = String(formData.get('title') || '').trim();
  if (!title) throw new Error('Geef in ieder geval een werk- of projecttitel op.');

  const { data, error } = await supabase
    .from('listings')
    .insert({
      user_id: user.id,
      title,
      slug: slugify(title),
      status: 'draft',
      is_featured: false,
    })
    .select()
    .single();

  if (error) throw new Error(`Opslaan mislukt: ${error.message}`);

  revalidatePath('/dashboard');
  redirect(`/listings/${data.id}/edit`);
}

export async function updateDraftListing(
  id: string,
  prevState: any,
  formData: FormData
): Promise<{ error?: string; success?: boolean } | void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'Je bent niet ingelogd.' };

  const title = String(formData.get('title') || '').trim();

  const updates: any = {
    updated_at: new Date().toISOString(),
  };

  if (title) {
    updates.title = title;
    updates.slug = slugify(title);
  }

  const desc = formData.get('description');
  if (desc !== null) updates.description = String(desc).trim() || null;

  const askingPrice = formData.get('asking_price');
  if (askingPrice !== null) updates.asking_price = Number(askingPrice) || null;

  const city = formData.get('city');
  if (city !== null) updates.city = String(city).trim() || null;

  const street = formData.get('street');
  if (street !== null) updates.street = String(street).trim() || null;

  const livingArea = formData.get('living_area');
  if (livingArea !== null) updates.living_area = parseInt(livingArea as string, 10) || null;

  const plotSize = formData.get('plot_size');
  if (plotSize !== null) updates.plot_size = parseInt(plotSize as string, 10) || null;

  const bedrooms = formData.get('bedrooms');
  if (bedrooms !== null) updates.bedrooms = parseInt(bedrooms as string, 10) || null;

  const energyLabel = formData.get('energy_label');
  if (energyLabel !== null) updates.energy_label = String(energyLabel).trim() || null;

  const yearBuilt = formData.get('year_built');
  if (yearBuilt !== null) updates.year_built = parseInt(yearBuilt as string, 10) || null;

  const propType = formData.get('property_type');
  if (propType !== null) updates.property_type = String(propType).trim() || null;

  const { error } = await supabase
    .from('listings')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) return { error: `Concept opslaan mislukt: ${error.message}` };

  revalidatePath('/dashboard');
  revalidatePath(`/listings/${id}`);
  revalidatePath(`/listings/${id}/edit`);

  return { success: true };
}

export async function attemptPublishListing(id: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Niet ingelogd.');

  const [listingRes, imagesRes] = await Promise.all([
    supabase.from('listings').select('*').eq('id', id).eq('user_id', user.id).single(),
    supabase.from('listing_images').select('*').eq('listing_id', id),
  ]);

  if (listingRes.error || !listingRes.data) throw new Error('Woning niet gevonden.');

  const listing = listingRes.data;
  const images = imagesRes.data || [];

  if (!listing.title || listing.title.length < 5) throw new Error('Titel mist.');
  if (!listing.asking_price || listing.asking_price < 100) throw new Error('Vraagprijs mist.');
  if (!listing.description || listing.description.length < 50) throw new Error('Beschrijving te kort.');
  if (!listing.city || !listing.street) throw new Error('Adres incompleet.');
  if (!listing.property_type) throw new Error('Woningtype mist.');

  if (images.length === 0) throw new Error('Upload minimaal 1 foto.');

  const hasCover = images.some((img: any) => img.is_cover);
  if (!hasCover) throw new Error('Selecteer een hoofdfoto.');

  await supabase
    .from('listings')
    .update({ status: 'active', updated_at: new Date().toISOString() })
    .eq('id', id);

  revalidatePath('/dashboard');
  revalidatePath(`/listings/${id}`);
  revalidatePath('/listings');

  redirect(`/listings/${id}`);
}

export async function unpublishListing(id: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Niet ingelogd.');

  const { error } = await supabase
    .from('listings')
    .update({ status: 'draft', updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw error;

  revalidatePath('/dashboard');
  revalidatePath(`/listings/${id}`);
  revalidatePath('/listings');
}

export async function deleteListing(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from('listings').delete().eq('id', id);
  if (error) throw error;

  revalidatePath('/dashboard');
  revalidatePath('/listings');
}

export async function updateMarketingBudget(listingId: string, budget: number): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Niet ingelogd.');

  const { error } = await supabase
    .from('listings')
    .update({
      marketing_budget: budget,
      marketing_active: true,
      updated_at: new Date().toISOString()
    })
    .eq('id', listingId)
    .eq('user_id', user.id);

  if (error) throw error;

  revalidatePath('/dashboard');
  revalidatePath(`/listings/${listingId}`);
}