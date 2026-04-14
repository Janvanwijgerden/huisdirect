export async function sendMetaEvent({
  eventName,
  eventId,
}: {
  eventName: string;
  eventId: string;
}) {
  const pixelId = process.env.META_PIXEL_ID;
  const accessToken =
    process.env.META_CONVERSIONS_API_TOKEN || process.env.META_ACCESS_TOKEN;

  if (!pixelId || !accessToken) {
    console.log("Meta CAPI skipped: missing env vars");
    return;
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v19.0/${pixelId}/events`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: [
            {
              event_name: eventName,
              event_time: Math.floor(Date.now() / 1000),
              event_id: eventId,
              action_source: "website",
            },
          ],
          access_token: accessToken,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Meta CAPI error:", errorText);
    } else {
      console.log("Meta CAPI event sent:", eventName);
    }
  } catch (error) {
    console.error("Meta CAPI request failed:", error);
  }
}