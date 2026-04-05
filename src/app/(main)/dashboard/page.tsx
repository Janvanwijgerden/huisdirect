import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import { getUserListings, attemptPublishListing } from "../../../lib/actions/listings";
import {
  Camera,
  FileText,
  Euro,
  Check,
  Home,
} from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Actieve listing logica met harde ID validatie flow
  const userListings = await getUserListings(user.id);
  const validListings = userListings.filter((l: any) => l.id);
  
  if (validListings.length > 1) {
    throw new Error("Meerdere woningen per gebruiker nog niet ondersteund in dit model.");
  }

  const dbListing = validListings[0];

  if (!dbListing) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-6">
        <div className="mx-auto max-w-md text-center">
          <h2 className="mb-2 text-2xl font-semibold tracking-tight text-neutral-900">Geen woning gevonden</h2>
          <p className="mb-6 text-base text-neutral-500">Je hebt momenteel geen actieve woning in je profiel. Start eenvoudig door de eerste gegevens in te vullen.</p>
          <Link href="/listings/new" className="rounded-xl bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-800">
            Start met je woning
          </Link>
        </div>
      </div>
    );
  }

  // Pure data checks
  const hasPhotos = Boolean(dbListing.listing_images && dbListing.listing_images.length > 0);
  const hasDetails = Boolean(
    dbListing.description && dbListing.description.length > 20 &&
    dbListing.property_type &&
    dbListing.city
  );
  const hasPrice = Boolean(dbListing.asking_price && dbListing.asking_price > 0);
  const isLive = dbListing.status === "active";

  const canPublish = Boolean(hasPhotos && hasDetails && hasPrice);

  const listing = {
    id: dbListing.id,
    title: dbListing.title || "Concept Woning",
    image: dbListing.image || null,
  };

  const checklist = [
    {
      title: "Woningfoto's",
      done: hasPhotos,
      icon: Camera,
    },
    {
      title: "Woninggegevens",
      done: hasDetails,
      icon: FileText,
    },
    {
      title: "Vraagprijs",
      done: hasPrice,
      icon: Euro,
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        
        {/* HEADER */}
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">Mijn Woning</h1>
        </header>

        {/* 1. HERO (EEN SAMENHANGEND BLOK) */}
        <section className="mb-10 flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.02)] md:flex-row">
          
          {/* LINKS: FOTO / PLACEHOLDER */}
          <div className="relative w-full border-b border-neutral-100 bg-neutral-50 md:w-6/12 lg:w-7/12 md:border-b-0 md:border-r">
            <div className="relative flex h-[360px] w-full flex-col sm:h-[460px]">
              {listing.image ? (
                <Image
                  src={listing.image}
                  alt={listing.title}
                  fill
                  priority
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center p-8 text-center text-neutral-500">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-neutral-200 bg-white shadow-sm">
                    <Camera className="h-6 w-6 text-neutral-400" />
                  </div>
                  <h3 className="mb-1 text-base font-semibold text-neutral-900">
                    Voeg een sterke hoofdfoto toe
                  </h3>
                  <p className="mb-6 max-w-[260px] text-sm leading-relaxed text-neutral-500">
                    Dit is het eerste wat kopers zien.
                  </p>
                  <Link 
                    href={`/listings/${listing.id}/edit`} 
                    className="rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 shadow-sm ring-1 ring-inset ring-neutral-300 transition hover:bg-neutral-50"
                  >
                    Foto toevoegen
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* RECHTS: DETAILS */}
          <div className="flex w-full flex-col justify-center p-8 md:w-6/12 lg:w-5/12 lg:p-10">
            <div className="mb-5">
              {isLive ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                  <Check className="h-3.5 w-3.5" /> Live online
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700 ring-1 ring-inset ring-neutral-500/20">
                  <Home className="h-3.5 w-3.5 text-neutral-500" /> Conceptversie
                </span>
              )}
            </div>

            <h2 className="mb-2 text-3xl font-semibold tracking-tight text-neutral-900">
              {listing.title}
            </h2>
            
            <p className="mb-8 text-xl font-medium text-neutral-500">
              {dbListing.asking_price ? `€ ${dbListing.asking_price.toLocaleString('nl-NL')} k.k.` : 'Vraagprijs nog niet ingesteld'}
            </p>

            <div className="mt-auto flex flex-col gap-3">
              {!isLive && (
                <form action={attemptPublishListing.bind(null, listing.id)}>
                  <button 
                    type="submit" 
                    disabled={!canPublish}
                    className="w-full rounded-xl bg-neutral-900 px-6 py-4 text-base font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-neutral-800 hover:shadow-md disabled:translate-y-0 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:shadow-none disabled:cursor-not-allowed"
                  >
                    Zet woning live – € 195
                  </button>
                </form>
              )}
              <Link
                href={`/listings/${listing.id}/edit`}
                className="flex w-full items-center justify-center rounded-xl border border-neutral-200 bg-white px-6 py-4 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
              >
                Bewerken
              </Link>
            </div>
          </div>
        </section>

        <div className="grid items-start gap-10 lg:grid-cols-[1fr_360px]">
          
          {/* 4. CHECKLIST ONDER HERO */}
          <section>
            <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
              <h3 className="mb-5 text-xl font-semibold tracking-tight text-neutral-900">Wat moet je nog doen</h3>
              
              <div className="flex flex-col gap-5">
                {checklist.map((item) => (
                   <div key={item.title} className="flex items-center justify-between border-b border-neutral-100 pb-5 last:border-0 last:pb-0">
                     <div className="flex items-center gap-3.5">
                       <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                          item.done ? 'bg-green-50 text-green-600' : 'bg-neutral-100 text-neutral-500'
                       }`}>
                         <item.icon className="h-4 w-4" />
                       </div>
                       <div className="flex flex-col">
                         <h4 className="text-base font-medium text-neutral-900">{item.title}</h4>
                         <span className={`text-sm ${item.done ? 'text-green-600' : 'text-neutral-500'}`}>
                           {item.done ? "Afgerond" : "Nog toevoegen"}
                         </span>
                       </div>
                     </div>
                     
                     <div>
                       <Link 
                         href={`/listings/${listing.id}/edit`} 
                         className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900"
                       >
                         {item.done ? "Wijzigen" : "Invullen"}
                       </Link>
                     </div>
                   </div>
                ))}
              </div>
            </div>
          </section>

          {/* 5. RECHTER KOLOM ONDER HERO (CTA BLOK) */}
          <section>
            <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
               
               <h3 className="mb-1 text-xl font-semibold tracking-tight text-neutral-900">Publiceer je woning</h3>
               
               {!isLive ? (
                 <>
                   <p className="mb-5 text-lg font-semibold text-neutral-900">€ 195,00</p>
                   
                   <p className="mb-6 text-sm leading-relaxed text-neutral-500">
                     Eenmalig online zetten. Direct zichtbaar voor kopers.
                   </p>
                   
                   <form action={attemptPublishListing.bind(null, listing.id)}>
                     <button 
                       type="submit" 
                       disabled={!canPublish}
                       className="w-full rounded-xl bg-neutral-900 px-6 py-4 text-base font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-neutral-800 hover:shadow-md disabled:translate-y-0 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:shadow-none disabled:cursor-not-allowed"
                     >
                       Zet woning live
                     </button>
                   </form>

                   {!canPublish && (
                     <p className="mt-5 text-center text-sm font-medium text-neutral-500">
                       Vul eerst je foto’s en woninggegevens aan om live te gaan.
                     </p>
                   )}
                 </>
               ) : (
                 <>
                   <p className="mb-6 mt-4 flex items-center gap-2 text-sm font-medium text-green-700">
                     <Check className="h-4 w-4" /> Je advertentie staat online.
                   </p>
                   <Link
                     href={`/listings/${listing.id}`}
                     target="_blank"
                     className="flex w-full items-center justify-center rounded-xl border border-neutral-200 bg-white px-5 py-3.5 text-sm font-medium text-neutral-900 transition hover:bg-neutral-50"
                   >
                     Bekijk publieke pagina
                   </Link>
                 </>
               )}
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}