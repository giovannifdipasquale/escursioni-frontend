import { GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/api";
import SearchFilter from "@/components/SearchFilter";
import { useState, useMemo } from "react";
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

type TrailsPageProps = {
  trails: Trail[];
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
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

export default function TrailsPage({ trails, pagination }: TrailsPageProps) {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [season, setSeason] = useState("");
  const [maxDuration, setMaxDuration] = useState<number | undefined>(undefined);

  const filtered = useMemo(() => {
    return trails.filter((trail) => {
      const matchText =
        trail.title.toLowerCase().includes(search.toLowerCase()) ||
        trail.description.toLowerCase().includes(search.toLowerCase());

      const matchDifficulty = !difficulty || trail.difficulty === difficulty;
      const matchSeason = !season || trail.season === season;
      const matchDuration = !maxDuration || trail.duration_hours <= maxDuration;

      return matchText && matchDifficulty && matchSeason && matchDuration;
    });
  }, [search, difficulty, season, maxDuration, trails]);
  return (
    <div className="min-h-screen py-12 ">
      <div className="">
        <h1 className="bg-transparent mt-15 text-9xl font-bold text-gray-900 mb-10 text-center text-gy">
          Sentieri
        </h1>
        <div className="bg-gray-50 m-0 p-4">
          <SearchFilter
            search={search}
            onSearchChange={setSearch}
            difficulty={difficulty}
            onDifficultyChange={setDifficulty}
            season={season}
            onSeasonChange={setSeason}
            maxDuration={maxDuration}
            onDurationChange={setMaxDuration}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((trail) => (
              <Link
                href={`/trails/${trail.slug}`}
                key={trail.id}
                className="block"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 border border-transparent hover:border-gray-200">
                  {trail.cover_image?.data && (
                    <div className="relative w-full aspect-w-16 aspect-h-9">
                      <Image
                        src={`http://localhost:1337${trail.cover_image.data.attributes.url}`}
                        alt={
                          trail.cover_image.data.attributes.alternativeText ||
                          trail.title
                        }
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-3 transition-colors group-hover:text-blue-600">
                      {trail.title}
                    </h2>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {trail.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-2">
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

                    <div className="mt-4 text-right">
                      <span className="text-blue-600 font-medium text-sm hover:underline">
                        Scopri di più →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center text-gray-500">
            Mostrando {trails.length} di {pagination.total} sentieri
          </div>
        </div>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const res = await api.get("/trails?populate=*");
    const { data: trails, meta } = res.data;

    if (!trails) {
      throw new Error("No trails found");
    }

    return {
      props: {
        trails,
        pagination: meta.pagination,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error("Error fetching trails:", error);
    return {
      props: {
        trails: [],
        pagination: {
          page: 1,
          pageSize: 25,
          pageCount: 0,
          total: 0,
        },
      },
      revalidate: 60,
    };
  }
};
