import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import api from "@/lib/api";
import { useRouter } from "next/router";

// Tipi copiati da index.tsx

type Location = {
  id: number;
  latitude: number;
  longitude: number;
};

type Localization = {
  id: number;
  documentId: string;
  locale: string;
};

type Trail = {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description: string;
  difficulty: "easy" | "moderate" | "hard";
  duration_hours: number;
  elevation_gain_m: number;
  season: "spring" | "summer" | "autumn" | "winter";
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  cover_image: null | {
    data: {
      id: number;
      attributes: {
        url: string;
        alternativeText: string | null;
      };
    };
  };
  gpx_file: null | {
    data: {
      id: number;
      attributes: {
        url: string;
      };
    };
  };
  location: Location;
  localizations: Localization[];
};

const difficultyLabels: Record<Trail["difficulty"], string> = {
  easy: "Facile",
  moderate: "Moderato",
  hard: "Difficile",
};

const seasonLabels: Record<Trail["season"], string> = {
  spring: "Primavera",
  summer: "Estate",
  autumn: "Autunno",
  winter: "Inverno",
};

type TrailDetailProps = {
  trail: Trail | null;
};

export default function TrailDetail({ trail }: TrailDetailProps) {
  const router = useRouter();
  if (router.isFallback) {
    return <div>Caricamento...</div>;
  }
  if (!trail) {
    return <div>Sentiero non trovato.</div>;
  }
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">{trail.title}</h1>
        {trail.cover_image?.data && (
          <div className="relative w-full aspect-w-16 aspect-h-9 mb-6">
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL || ""}${
                trail.cover_image.data.attributes.url
              }`}
              alt={
                trail.cover_image.data.attributes.alternativeText || trail.title
              }
              fill
              className="object-cover rounded-xl"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        <div className="mb-4 text-gray-700 text-lg">{trail.description}</div>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-2 py-1 bg-gray-100 text-gray-700 border border-gray-200 rounded-full text-xs">
            {difficultyLabels[trail.difficulty]}
          </span>
          <span className="px-2 py-1 bg-gray-100 text-gray-700 border border-gray-200 rounded-full text-xs">
            {trail.duration_hours}h
          </span>
          <span className="px-2 py-1 bg-gray-100 text-gray-700 border border-gray-200 rounded-full text-xs">
            {trail.elevation_gain_m}m
          </span>
          <span className="px-2 py-1 bg-gray-100 text-gray-700 border border-gray-200 rounded-full text-xs">
            {seasonLabels[trail.season]}
          </span>
        </div>
        {trail.gpx_file?.data && (
          <div className="mb-4">
            <a
              href={`${process.env.NEXT_PUBLIC_API_URL || ""}${
                trail.gpx_file.data.attributes.url
              }`}
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Scarica traccia GPX
            </a>
          </div>
        )}
        <div className="text-sm text-gray-400 mt-8">
          Ultimo aggiornamento: {new Date(trail.updatedAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await api.get("/trails");
  const { data: trails } = res.data;
  const paths = trails.map((trail: Trail) => ({
    params: { slug: trail.slug },
  }));
  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { slug } = context.params as { slug: string };
  try {
    const res = await api.get(`/trails?filters[slug][$eq]=${slug}&populate=*`);
    const { data } = res.data;
    if (!data || data.length === 0) {
      return { props: { trail: null }, revalidate: 60 };
    }
    return { props: { trail: data[0] }, revalidate: 60 };
  } catch {
    return { props: { trail: null }, revalidate: 60 };
  }
};
