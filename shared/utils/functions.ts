import { ListingPayload } from "database";

export function cleanForAI(listing: ListingPayload): ListingPayload {
  const clonedListing = JSON.parse(JSON.stringify(listing));
  if (clonedListing.images.length > 0) {
    clonedListing.images = [];
  }
  if (clonedListing.address.parcel.polygonJSON) {
    clonedListing.address.parcel.polygonJSON = "";
  }
  if (clonedListing.address.parcel.femaFloodZone?.polygonJSON) {
    clonedListing.address.parcel.femaFloodZone.polygonJSON = "";
  }
  if (clonedListing.analyses.length > 0) {
    clonedListing.analyses = [];
  }
  return clonedListing;
}
