import express, { Router } from "express";
import { Listing } from "@monorepo/utils";

const data: Listing[] = [
  {
    name: "Beachfront Paradise",
    desc: "Wake up to the sound of waves at this premium beachfront property.",
    address: "890 Ocean Ave, Beachtown, BT 89012",
    parcelID: "PA890123",
    images: null,
    labels: ["Waterfront", "Residential", "Flat", "Clear Title"],
  },
  {
    name: "Desert Oasis",
    desc: "A tranquil spot amidst sand dunes with its very own oasis.",
    address: "234 Sandy Blvd, Desertia, DS 23456",
    parcelID: "PA234567",
    images: null,
    labels: ["Desert", "Recreational", "Hilly", "Clear Title"],
  },
  {
    name: "Forest Hideaway",
    desc: "A secluded cabin in the woods, perfect for a getaway.",
    address: "123 Timber Rd, Woodland, WL 12378",
    parcelID: "PA123789",
    images: null,
    labels: ["Wooded", "Residential", "Hilly", "Clear Title"],
  },
  {
    name: "Golden Vineyard",
    desc: "A fertile plot perfect for wine lovers, surrounded by vineyards.",
    address: "567 Grape Ln, Vineland, VL 56702",
    parcelID: "PA567902",
    images: null,
    labels: ["Fertile", "Agricultural", "Flat", "Clear Title"],
  },
  {
    name: "Green Acres",
    desc: "A serene piece of land located in the countryside.",
    address: "123 Meadow Lane, Countryside, CS 12345",
    parcelID: "PA123456",
    images: null,
    labels: ["Agricultural", "Flat", "Clear Title"],
  },
  {
    name: "Island Getaway",
    desc: "Own a piece of paradise on this private island.",
    address: "101 Paradise Dr, Islandia, ID 10112",
    parcelID: "PA101112",
    images: null,
    labels: ["Waterfront", "Recreational", "Hilly", "Permitted"],
  },
  {
    name: "Lakeside Retreat",
    desc: "A beautiful parcel overlooking a pristine lake.",
    address: "789 Lake Rd, Lakeville, LV 67890",
    parcelID: "PA789012",
    images: null,
    labels: ["Waterfront", "Residential", "Flat", "Clear Title"],
  },
  {
    name: "Mountain Top",
    desc: "A lofty peak offering panoramic views.",
    address: "456 Mountain Dr, Highpeak, HP 45678",
    parcelID: "PA345678",
    images: null,
    labels: ["Mountainous", "Recreational", "Clear Title"],
  },
  {
    name: "Mystic Marsh",
    desc: "An enchanted piece of land, home to diverse flora and fauna.",
    address: "345 Marsh Ln, Wetlands, WL 34567",
    parcelID: "PA345901",
    images: null,
    labels: ["Wetlands", "Conservation", "Flat", "Easements"],
  },
  {
    name: "Null",
    desc: "An undisclosed piece of land. Details on request.",
    address: "Null",
    parcelID: "PA901234",
    images: null,
    labels: [], // Empty or hidden due to being undisclosed
  },
  {
    name: "Polar Retreat",
    desc: "A unique piece of land in the frosty polar regions, a true escape.",
    address: "890 Iceberg Ave, Frostville, FV 89034",
    parcelID: "PA890567",
    images: null,
    labels: ["Recreational", "Flat", "Clear Title"],
  },
  {
    name: "Riverside Ranch",
    desc: "A sprawling ranch nestled by the side of a tranquil river.",
    address: "789 River Rd, Rivertown, RT 78901",
    parcelID: "PA789345",
    images: null,
    labels: ["Waterfront", "Agricultural", "Hilly", "Clear Title"],
  },
  {
    name: "Sunny Suburb",
    desc: "A charming plot in a family-friendly suburban neighborhood.",
    address: "234 Suburb St, Pleasantville, PV 23409",
    parcelID: "PA234908",
    images: null,
    labels: ["Residential", "Flat", "Clear Title"],
  },
  {
    name: "Urban Loft",
    desc: "A spacious loft located in the heart of the bustling city.",
    address: "567 Metro St, Urbancity, UC 56789",
    parcelID: "PA567890",
    images: null,
    labels: ["Commercial", "Flat", "Clear Title"],
  },
];

const router: Router = express.Router();

router.get("/", (req, res) => {
  res.json(data);
});

export default router;
