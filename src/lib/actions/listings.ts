'use server';

import { createClient } from '../supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

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

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractStoragePathFromPublicUrl(publicUrl: string | null | undefined) {
  if (!publicUrl) return null;

  const marker = '/storage/v1/object/public/listing-images/';
  const index = publicUrl.indexOf(marker);

  if (index === -1) return null;

  return publicUrl.slice(index + marker.length);
}

async function generateUniqueSlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  baseInput: string,
  excludeId?: string
): Promise<string> {
  const baseSlug = slugify(baseInput) || `woning-${Date.now()}`;

  const { data, error } = await supabase
    .from('listings')
    .select('id, slug')
    .ilike('slug', `${baseSlug}%`);

  if (error) {
    throw new Error(`Slugcontrole mislukt: ${error.message}`);
  }

  const relevantRows = (data || []).filter((row: any) => {
    if (!row?.slug) return false;
    if (excludeId && row.id === excludeId) return false;
    return true;
  });

  const existingSlugs = new Set(relevantRows.map((row: any) => row.slug));

  if (!existingSlugs.has(baseSlug)) {
    return baseSlug;
  }

  const suffixPattern = new RegExp(`^${escapeRegExp(baseSlug)}-(\\d+)$`);
  let maxSuffix = 1;

  for (const slug of existingSlugs) {
    const match = String(slug).match(suffixPattern);
    if (!match) continue;

    const suffix = Number(match[1]);
    if (Number.isFinite(suffix)) {
      maxSuffix = Math.max(maxSuffix, suffix);
    }
  }

  return `${baseSlug}-${maxSuffix + 1}`;
}

async function insertListingWithUniqueSlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  payload: Record<string, any>,
  slugBase: string
) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const slug =
      attempt === 0
        ? await generateUniqueSlug(supabase, slugBase)
        : `${slugify(slugBase) || 'woning'}-${Date.now().toString(36)}-${Math.random()
            .toString(36)
            .slice(2, 6)}`;

    const { data, error } = await supabase
      .from('listings')
      .insert({
        ...payload,
        slug,
      })
      .select()
      .single();

    if (!error && data) {
      return data;
    }

    const isDuplicateSlug =
      !!error &&
      error.message.toLowerCase().includes('duplicate key value') &&
      error.message.includes('listings_slug_key');

    if (!isDuplicateSlug) {
      throw new Error(`Opslaan mislukt: ${error?.message || 'Onbekende fout'}`);
    }
  }

  throw new Error('Kon geen unieke slug genereren.');
}

export async function getListings(limit?: number, featuredOnly?: boolean) {
  const supabase = await createClient();

  let query = supabase
    .from('listings')
    .select(`
      *,
      listing_images(id, public_url, public_url_thumb, public_url_medium, public_url_large, is_cover, position)
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
      image:
        cover?.public_url_thumb ||
        cover?.public_url_medium ||
        cover?.public_url ||
        null,
    };
  });

  return mapped;
}

export async function getSoldListings(limit: number = 100) {
  const supabase = await createClient();

  let query = supabase
    .from('listings')
    .select(`
      *,
      listing_images(id, public_url, public_url_thumb, public_url_medium, public_url_large, is_cover, position)
    `)
    .eq('status', 'sold')
    .order('updated_at', { ascending: false })
    .limit(limit);

  const { data, error } = await query;
  if (error) throw error;

  const mapped = (data ?? []).map((listing: any) => {
    const cover =
      listing.listing_images?.find((img: any) => img.is_cover) ||
      listing.listing_images?.[0];

    return {
      ...listing,
      image:
        cover?.public_url_thumb ||
        cover?.public_url_medium ||
        cover?.public_url ||
        null,
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
      listing_images(id, public_url, public_url_thumb, public_url_medium, public_url_large, is_cover, position)
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
      image:
        cover?.public_url_thumb ||
        cover?.public_url_medium ||
        cover?.public_url ||
        null,
    };
  });

  return mapped;
}

export async function createDraftListing(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Je bent niet ingelogd.');
  }

  const title = String(formData.get('title') || '').trim();
  const plotSize = String(formData.get('plot_size') || '').trim();

  if (!title) {
    throw new Error('Geef in ieder geval een werk- of projecttitel op.');
  }

  const street = String(formData.get('street') || '').trim();
  const houseNumber = String(formData.get('house_number') || '').trim();
  const postalCode = String(formData.get('postal_code') || '').trim();
  const city = String(formData.get('city') || '').trim();
  const province = String(formData.get('province') || '').trim();

  const lat = formData.get('lat');
  const lng = formData.get('lng');

  const propertyType = String(formData.get('property_type') || '').trim();
  const askingPrice = String(formData.get('asking_price') || '').trim();
  const livingArea = String(formData.get('living_area') || '').trim();
  const yearBuilt = String(formData.get('year_built') || '').trim();

  const bagAddressId = String(formData.get('bag_address_id') || '').trim();
  const bagObjectId = String(formData.get('bag_object_id') || '').trim();
  const bagPandId = String(formData.get('bag_pand_id') || '').trim();

  const featuresRaw = formData.get('features');
  let features: any = null;

  if (featuresRaw) {
    try {
      features = JSON.parse(String(featuresRaw));
    } catch {
      features = null;
    }
  }

  const sourceStreet = String(formData.get('source_street') || '').trim();
  const sourceHouseNumber = String(
    formData.get('source_house_number') || ''
  ).trim();
  const sourceHouseNumberAddition = String(
    formData.get('source_house_number_addition') || ''
  ).trim();
  const sourcePostalCode = String(formData.get('source_postal_code') || '').trim();
  const sourceCity = String(formData.get('source_city') || '').trim();
  const sourceLat = String(formData.get('source_lat') || '').trim();
  const sourceLng = String(formData.get('source_lng') || '').trim();
  const sourceBuildYear = String(formData.get('source_build_year') || '').trim();
  const sourceLivingArea = String(formData.get('source_living_area') || '').trim();
  const sourcePropertyType = String(
    formData.get('source_property_type') || ''
  ).trim();

  const sourceWozValue = String(formData.get('source_woz_value') || '').trim();
  const estimatedValueLow = String(formData.get('estimated_value_low') || '').trim();
  const estimatedValueMid = String(formData.get('estimated_value_mid') || '').trim();
  const estimatedValueHigh = String(formData.get('estimated_value_high') || '').trim();
  const valuationPricePerM2 = String(formData.get('valuation_price_per_m2') || '').trim();
  const valuationConfidence = String(formData.get('valuation_confidence') || '').trim();
  const valuationSource = String(formData.get('valuation_source') || '').trim();
  const valuationModelVersion = String(
    formData.get('valuation_model_version') || ''
  ).trim();

  const payload = {
    user_id: user.id,
    title,
    status: 'draft',
    is_featured: false,

    street: street || null,
    house_number: houseNumber || null,
    postal_code: postalCode || null,
    city: city || null,
    province: province || null,
    property_type: propertyType || null,
    asking_price: askingPrice ? Number(askingPrice) : null,
    living_area: livingArea ? Number(livingArea) : null,
    plot_size: plotSize ? Number(plotSize) : null,
    year_built: yearBuilt ? Number(yearBuilt) : null,
    latitude: lat ? Number(lat) : null,
    longitude: lng ? Number(lng) : null,

    bag_address_id: bagAddressId || null,
    bag_object_id: bagObjectId || null,
    bag_pand_id: bagPandId || null,

    features: features || {},

    source_street: sourceStreet || street || null,
    source_house_number: sourceHouseNumber || houseNumber || null,
    source_house_number_addition: sourceHouseNumberAddition || null,
    source_postal_code: sourcePostalCode || postalCode || null,
    source_city: sourceCity || city || null,
    source_lat: sourceLat ? Number(sourceLat) : lat ? Number(lat) : null,
    source_lng: sourceLng ? Number(sourceLng) : lng ? Number(lng) : null,
    source_build_year: sourceBuildYear
      ? Number(sourceBuildYear)
      : yearBuilt
      ? Number(yearBuilt)
      : null,
    source_living_area: sourceLivingArea
      ? Number(sourceLivingArea)
      : livingArea
      ? Number(livingArea)
      : null,
    source_property_type: sourcePropertyType || propertyType || null,
    source_woz_value: sourceWozValue ? Number(sourceWozValue) : null,
    source_data_provider: valuationSource || 'simple_valuation_v1',

    estimated_value_low: estimatedValueLow ? Number(estimatedValueLow) : null,
    estimated_value_mid: estimatedValueMid ? Number(estimatedValueMid) : null,
    estimated_value_high: estimatedValueHigh ? Number(estimatedValueHigh) : null,
    valuation_source: valuationSource || 'simple_valuation_v1',
    valuation_model_version: valuationModelVersion || 'simple_valuation_v1',
    valuation_confidence: valuationConfidence ? Number(valuationConfidence) : null,
    valuation_price_per_m2: valuationPricePerM2 ? Number(valuationPricePerM2) : null,
    valuation_metadata: {
      entry_point: 'listing_new',
      bag_address_id: bagAddressId || null,
      bag_object_id: bagObjectId || null,
      bag_pand_id: bagPandId || null,
    },
  };

  const newListing = await insertListingWithUniqueSlug(supabase, payload, title);

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/listings');

  redirect(`/listings/${newListing.id}/edit`);
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

  const featuresRaw = formData.get('features');
  if (featuresRaw !== null) {
    try {
      updates.features = JSON.parse(String(featuresRaw));
    } catch {}
  }

  if (title) {
    updates.title = title;

    const { data: currentListing, error: currentError } = await supabase
      .from('listings')
      .select('title, slug')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (currentError || !currentListing) {
      return {
        error: `Concept opslaan mislukt: ${
          currentError?.message || 'huidige listing niet gevonden'
        }`,
      };
    }

    const currentTitle = String(currentListing.title || '').trim();
    const currentSlug = String(currentListing.slug || '').trim();
    const normalizedCurrentTitle = slugify(currentTitle);
    const normalizedNewTitle = slugify(title);

    const titleChanged = normalizedNewTitle && normalizedNewTitle !== normalizedCurrentTitle;

    if (titleChanged && normalizedNewTitle !== currentSlug) {
      updates.slug = await generateUniqueSlug(supabase, title, id);
    }
  }

  const desc = formData.get('description');
  if (desc !== null) updates.description = String(desc).trim() || null;

  const askingPrice = formData.get('asking_price');
  if (askingPrice !== null) updates.asking_price = Number(askingPrice) || null;

  const city = formData.get('city');
  if (city !== null) updates.city = String(city).trim() || null;

  const province = formData.get('province');
  if (province !== null) updates.province = String(province).trim() || null;

  const street = formData.get('street');
  if (street !== null) updates.street = String(street).trim() || null;

  const postalCode = formData.get('postal_code');
  if (postalCode !== null) {
    updates.postal_code = String(postalCode).trim() || null;
  }

  const houseNumber = formData.get('house_number');
  if (houseNumber !== null) {
    updates.house_number = String(houseNumber).trim() || null;
  }

  const lat = formData.get('lat');
  if (lat !== null) {
    updates.latitude = lat ? Number(lat) : null;
  }

  const lng = formData.get('lng');
  if (lng !== null) {
    updates.longitude = lng ? Number(lng) : null;
  }

  const bagAddressId = formData.get('bag_address_id');
  if (bagAddressId !== null) {
    updates.bag_address_id = String(bagAddressId).trim() || null;
  }

  const bagObjectId = formData.get('bag_object_id');
  if (bagObjectId !== null) {
    updates.bag_object_id = String(bagObjectId).trim() || null;
  }

  const bagPandId = formData.get('bag_pand_id');
  if (bagPandId !== null) {
    updates.bag_pand_id = String(bagPandId).trim() || null;
  }

  const sourceStreet = formData.get('source_street');
  if (sourceStreet !== null) {
    updates.source_street = String(sourceStreet).trim() || null;
  } else if (street !== null) {
    updates.source_street = String(street).trim() || null;
  }

  const sourceHouseNumber = formData.get('source_house_number');
  if (sourceHouseNumber !== null) {
    updates.source_house_number = String(sourceHouseNumber).trim() || null;
  } else if (houseNumber !== null) {
    updates.source_house_number = String(houseNumber).trim() || null;
  }

  const sourceHouseNumberAddition = formData.get('source_house_number_addition');
  if (sourceHouseNumberAddition !== null) {
    updates.source_house_number_addition =
      String(sourceHouseNumberAddition).trim() || null;
  }

  const sourcePostalCode = formData.get('source_postal_code');
  if (sourcePostalCode !== null) {
    updates.source_postal_code = String(sourcePostalCode).trim() || null;
  } else if (postalCode !== null) {
    updates.source_postal_code = String(postalCode).trim() || null;
  }

  const sourceCity = formData.get('source_city');
  if (sourceCity !== null) {
    updates.source_city = String(sourceCity).trim() || null;
  } else if (city !== null) {
    updates.source_city = String(city).trim() || null;
  }

  const sourceLat = formData.get('source_lat');
  if (sourceLat !== null) {
    updates.source_lat = sourceLat ? Number(sourceLat) : null;
  } else if (lat !== null) {
    updates.source_lat = lat ? Number(lat) : null;
  }

  const sourceLng = formData.get('source_lng');
  if (sourceLng !== null) {
    updates.source_lng = sourceLng ? Number(sourceLng) : null;
  } else if (lng !== null) {
    updates.source_lng = lng ? Number(lng) : null;
  }

  const livingArea = formData.get('living_area');
  if (livingArea !== null) {
    updates.living_area = parseInt(livingArea as string, 10) || null;
  }

  const sourceLivingArea = formData.get('source_living_area');
  if (sourceLivingArea !== null) {
    updates.source_living_area = parseInt(sourceLivingArea as string, 10) || null;
  } else if (livingArea !== null) {
    updates.source_living_area = parseInt(livingArea as string, 10) || null;
  }

  const plotSize = formData.get('plot_size');
  if (plotSize !== null) {
    updates.plot_size = parseInt(plotSize as string, 10) || null;
  }

  const bedrooms = formData.get('bedrooms');
  if (bedrooms !== null) {
    updates.bedrooms = parseInt(bedrooms as string, 10) || null;
  }

  const energyLabel = formData.get('energy_label');
  if (energyLabel !== null) {
    updates.energy_label = String(energyLabel).trim() || null;
  }

  const yearBuilt = formData.get('year_built');
  if (yearBuilt !== null) {
    updates.year_built = parseInt(yearBuilt as string, 10) || null;
  }

  const sourceBuildYear = formData.get('source_build_year');
  if (sourceBuildYear !== null) {
    updates.source_build_year = parseInt(sourceBuildYear as string, 10) || null;
  } else if (yearBuilt !== null) {
    updates.source_build_year = parseInt(yearBuilt as string, 10) || null;
  }

  const propType = formData.get('property_type');
  if (propType !== null) {
    updates.property_type = String(propType).trim() || null;
  }

  const sourcePropertyType = formData.get('source_property_type');
  if (sourcePropertyType !== null) {
    updates.source_property_type = String(sourcePropertyType).trim() || null;
  } else if (propType !== null) {
    updates.source_property_type = String(propType).trim() || null;
  }

  const sourceWozValue = formData.get('source_woz_value');
  if (sourceWozValue !== null) {
    updates.source_woz_value = sourceWozValue ? Number(sourceWozValue) : null;
  }

  const estimatedValueLow = formData.get('estimated_value_low');
  if (estimatedValueLow !== null) {
    updates.estimated_value_low = estimatedValueLow
      ? Number(estimatedValueLow)
      : null;
  }

  const estimatedValueMid = formData.get('estimated_value_mid');
  if (estimatedValueMid !== null) {
    updates.estimated_value_mid = estimatedValueMid
      ? Number(estimatedValueMid)
      : null;
  }

  const estimatedValueHigh = formData.get('estimated_value_high');
  if (estimatedValueHigh !== null) {
    updates.estimated_value_high = estimatedValueHigh
      ? Number(estimatedValueHigh)
      : null;
  }

  const valuationPricePerM2 = formData.get('valuation_price_per_m2');
  if (valuationPricePerM2 !== null) {
    updates.valuation_price_per_m2 = valuationPricePerM2
      ? Number(valuationPricePerM2)
      : null;
  }

  const valuationConfidence = formData.get('valuation_confidence');
  if (valuationConfidence !== null) {
    updates.valuation_confidence = valuationConfidence
      ? Number(valuationConfidence)
      : null;
  }

  const valuationSource = formData.get('valuation_source');
  if (valuationSource !== null) {
    updates.valuation_source = String(valuationSource).trim() || null;
    updates.source_data_provider = String(valuationSource).trim() || null;
  }

  const valuationModelVersion = formData.get('valuation_model_version');
  if (valuationModelVersion !== null) {
    updates.valuation_model_version =
      String(valuationModelVersion).trim() || null;
  }

  updates.valuation_metadata = {
    entry_point: 'listing_edit',
    bag_address_id:
      String(formData.get('bag_address_id') || '').trim() || null,
    bag_object_id:
      String(formData.get('bag_object_id') || '').trim() || null,
    bag_pand_id:
      String(formData.get('bag_pand_id') || '').trim() || null,
  };

  const { error } = await supabase
    .from('listings')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    return { error: `Concept opslaan mislukt: ${error.message}` };
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/listings');
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
    supabase
      .from('listings')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single(),
    supabase.from('listing_images').select('*').eq('listing_id', id),
  ]);

  if (listingRes.error || !listingRes.data) {
    throw new Error('Woning niet gevonden.');
  }

  const listing = listingRes.data;
  const images = imagesRes.data || [];

  if (!listing.title || listing.title.length < 5) {
    throw new Error('Titel mist.');
  }

  if (!listing.asking_price || listing.asking_price < 100) {
    throw new Error('Vraagprijs mist.');
  }

  if (!listing.description || listing.description.length < 50) {
    throw new Error('Beschrijving te kort.');
  }

  if (!listing.city || !listing.street) {
    throw new Error('Adres incompleet.');
  }

  if (!listing.property_type) {
    throw new Error('Woningtype mist.');
  }

  if (images.length === 0) {
    throw new Error('Upload minimaal 1 foto.');
  }

  const hasCover = images.some((img: any) => img.is_cover);
  if (!hasCover) {
    throw new Error('Selecteer een hoofdfoto.');
  }

  const { error } = await supabase
    .from('listings')
    .update({
      status: 'active',
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    throw new Error(`Publiceren mislukt: ${error.message}`);
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/listings');
  revalidatePath(`/listings/${id}`);
  revalidatePath('/listings');

  redirect(`/listings/${id}`);
}

export async function markListingAsSold(id: string): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Niet ingelogd.');

  const { error } = await supabase
    .from('listings')
    .update({
      status: 'sold',
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    throw new Error(`Markeren als verkocht mislukt: ${error.message}`);
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/listings');
  revalidatePath(`/listings/${id}`);
  revalidatePath('/listings');
  revalidatePath('/');
}

export async function unpublishListing(id: string): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Niet ingelogd.');

  const { error } = await supabase
    .from('listings')
    .update({
      status: 'draft',
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    throw new Error(`Offline halen mislukt: ${error.message}`);
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/listings');
  revalidatePath(`/listings/${id}`);
  revalidatePath('/listings');
  revalidatePath('/');
}

export async function deleteListing(id: string): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Niet ingelogd.');
  }

  const { data: listing, error: listingError } = await supabase
    .from('listings')
    .select('id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (listingError || !listing) {
    throw new Error('Woning niet gevonden.');
  }

  const { data: images, error: imagesError } = await supabase
    .from('listing_images')
    .select('storage_path, public_url_thumb, public_url_medium, public_url_large')
    .eq('listing_id', id);

  if (imagesError) {
    throw new Error(`Afbeeldingen ophalen mislukt: ${imagesError.message}`);
  }

  const pathsToDelete = Array.from(
    new Set(
      (images || [])
        .flatMap((img: any) => [
          img.storage_path || null,
          extractStoragePathFromPublicUrl(img.public_url_thumb),
          extractStoragePathFromPublicUrl(img.public_url_medium),
          extractStoragePathFromPublicUrl(img.public_url_large),
        ])
        .filter(Boolean) as string[]
    )
  );

  if (pathsToDelete.length > 0) {
    const { error: storageDeleteError } = await supabase.storage
      .from('listing-images')
      .remove(pathsToDelete);

    if (storageDeleteError) {
      throw new Error(`Bestanden verwijderen mislukt: ${storageDeleteError.message}`);
    }
  }

  const { error: deleteImagesError } = await supabase
    .from('listing_images')
    .delete()
    .eq('listing_id', id);

  if (deleteImagesError) {
    throw new Error(`Afbeeldingen verwijderen mislukt: ${deleteImagesError.message}`);
  }

  const { error: deleteListingError } = await supabase
    .from('listings')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (deleteListingError) {
    throw new Error(`Verwijderen mislukt: ${deleteListingError.message}`);
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/listings');
  revalidatePath('/listings');

  redirect('/dashboard/listings');
}

export async function updateMarketingBudget(
  listingId: string,
  budget: number
): Promise<void> {
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
      updated_at: new Date().toISOString(),
    })
    .eq('id', listingId)
    .eq('user_id', user.id);

  if (error) throw error;

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/listings');
  revalidatePath(`/listings/${listingId}`);
}