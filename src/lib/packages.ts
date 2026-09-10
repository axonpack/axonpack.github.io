import data from "@/generated/packages.json";

export type Package = {
  name: string;
  slug: string;
  version: string;
  description: string;
  keywords: string[];
  license: string | null;
  weeklyDownloads: number | null;
  docsHref: string;
  npmHref: string;
};

export const packages: Package[] = data.packages;
export const stars: number | null = data.stars;
export const builtAt: string = data.builtAt;

/** "@axonpack/expo-devtools" -> "expo-devtools" */
export const shortName = (name: string) => name.replace(/^@axonpack\//, "");
