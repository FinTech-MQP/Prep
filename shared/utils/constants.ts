import { Program } from "./interfaces";

export const WILLOW_COLOR = "#3068cd";
export const WILLOW_COLOR_HOVER = "#1d478f";
export const SECONDARY_COLOR = "#FFFF";
export const DARK_GREY_COLOR = "#333333";

// Example array of programs with their criteria
export const programs: Program[] = [
  {
    name: "Affordable Housing Trust Fund",
    criteria: {
      amiRange: [0, 80],
      adaRange: [0, 10],
      mixedIncome: false,
      affordabilityTerm: 0,
      priorityAmi: 60,
    },
    description: "Up to 80% AMI, priority for 60% AMI, 10% ADA required.",
    link: "https://www.worcesterma.gov/uploads/e1/6e/e16ee06f7891e370cdedbfc1cde18311/ahtf-application-scoring-guidance.pdf",
  },
  {
    name: "HOME Investment Partnerships Program",
    criteria: {
      amiRange: [0, 80],
      adaRange: [0, 100],
      mixedIncome: false,
      affordabilityTerm: 0,
    },
    description: "Up to 80% AMI for city/federal housing initiatives.",
    link: "https://www.worcesterma.gov/uploads/d5/40/d540113d70884df976490fbed48d0456/home-tbra-rfp-2022.pdf",
  },
  {
    name: "HOME-ARP",
    criteria: {
      amiRange: [0, 30],
      adaRange: [0, 100],
      mixedIncome: false,
      affordabilityTerm: 0,
      unhoused: true,
    },
    description: "30% AMI and housing for unhoused individuals.",
    // No link provided
  },
  {
    name: "First Time Homeownership Development",
    criteria: {
      amiRange: [0, 80],
      adaRange: [0, 100],
      mixedIncome: false,
      affordabilityTerm: 0,
    },
    description: "Supports 80% AMI for first-time homeownership developments.",
    // No link provided
  },
  {
    name: "Housing First Solutions",
    criteria: {
      amiRange: [0, 30],
      adaRange: [0, 100],
      mixedIncome: false,
      affordabilityTerm: 0,
      unhoused: true,
    },
    description: "30% AMI and housing solutions for unhoused populations.",
    // No link provided
  },
  {
    name: "Housing Development Incentive Program / TIE",
    criteria: {
      amiRange: [0, 100],
      adaRange: [0, 100],
      mixedIncome: true,
      affordabilityTerm: 0,
      marketRate: true,
    },
    description: "Encourages market rate and mixed-income housing development.",
    // No link provided
  },
  {
    name: "Inclusionary Zoning",
    criteria: {
      amiRange: [0, 80],
      adaRange: [0, 100],
      mixedIncome: false,
      affordabilityTerm: 0,
      priorityAmi: 60,
    },
    description:
      "Requires affordable housing for developments, priority for 60% AMI.",
    // No link provided
  },
  {
    name: "DHCD HOME Investment Partnerships Program",
    criteria: {
      amiRange: [0, 80],
      adaRange: [0, 100],
      mixedIncome: false,
      affordabilityTerm: 0,
    },
    description: "State-level initiative up to 80% AMI for affordable housing.",
    // No link provided
  },
  {
    name: "Low Income Housing Tax Credits (LIHTC)",
    criteria: {
      amiRange: [0, 80],
      adaRange: [0, 100],
      mixedIncome: false,
      affordabilityTerm: 0,
    },
    description:
      "Offers tax credits for low-income housing developments up to 80% AMI.",
    // No link provided
  },
  {
    name: "Housing Stabilization Fund",
    criteria: {
      amiRange: [0, 80],
      adaRange: [0, 100],
      mixedIncome: false,
      affordabilityTerm: 0,
    },
    description: "Fund aimed at stabilizing affordable housing up to 80% AMI.",
    // No link provided
  },
  {
    name: "Community-Based Housing (Accessibility)",
    criteria: {
      amiRange: [0, 110],
      adaRange: [0, 100],
      mixedIncome: false,
      affordabilityTerm: 0,
      priorityAmi: 80,
    },
    description:
      "Supports accessible housing for individuals up to 110% AMI, with priority under 80% AMI.",
    // No link provided
  },
  {
    name: "Housing Innovations Fund (Special Needs)",
    criteria: {
      amiRange: [0, 100],
      adaRange: [0, 100],
      mixedIncome: true,
      affordabilityTerm: 0,
    },
    description:
      "Funds mixed-income housing including units for individuals at 30% AMI.",
    // No link provided
  },
  {
    name: "Commercial Area Transit Node (CATN) Housing",
    criteria: {
      amiRange: [0, 100],
      adaRange: [0, 100],
      mixedIncome: true,
      affordabilityTerm: 0,
    },
    description: "Fosters mixed-income housing development in transit nodes.",
    // No link provided
  },
  {
    name: "Commonwealth Builders (MassHousing)",
    criteria: {
      amiRange: [70, 120],
      adaRange: [0, 100],
      mixedIncome: false,
      affordabilityTerm: 0,
    },
    description:
      "Focuses on housing for individuals with AMI between 70% and 120%.",
    // No link provided
  },
  {
    name: "Workforce Housing Program",
    criteria: {
      amiRange: [60, 120],
      adaRange: [0, 100],
      mixedIncome: false,
      affordabilityTerm: 0,
    },
    description:
      "Targets workforce housing for those with AMI between 60% and 120%.",
    // No link provided
  },
  // More programs can be added here following the same structure.
];
