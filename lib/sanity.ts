import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const sanityClient = createClient({
  projectId: "kmhnx1uu", // Replace with your actual project ID
  dataset: "production",
  useCdn: true,
  apiVersion: "2025-02-04",
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: any) {
  return builder.image(source);
}
