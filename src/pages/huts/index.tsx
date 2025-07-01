import { GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/api";

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

type hut = {
  id: number;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  location: Location;
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
  localizations: Localization[];
};

type hutsPageProps = {
  huts: hut[];
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
};

export default function hutsPage({ huts, pagination }: hutsPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="mt-15 text-5xl font-bold text-gray-900 mb-10 text-center">
          Rifugi
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {huts.map((hut) => (
            <Link href={`/huts/${hut.slug}`} key={hut.id} className="block">
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 border border-transparent hover:border-gray-200">
                {hut.cover_image?.data && (
                  <div className="relative w-full aspect-w-16 aspect-h-9">
                    <Image
                      src={`http://localhost:1337${hut.cover_image.data.attributes.url}`}
                      alt={
                        hut.cover_image.data.attributes.alternativeText ||
                        hut.name
                      }
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}

                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-3 transition-colors group-hover:text-blue-600">
                    {hut.name}
                  </h2>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {hut.description}
                  </p>

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
          Mostrando {huts.length} di {pagination.total} Rifugi
        </div>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const res = await api.get("/huts?populate=*");
    const { data: huts, meta } = res.data;

    if (!huts) {
      throw new Error("No huts found");
    }

    return {
      props: {
        huts,
        pagination: meta.pagination,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error("Error fetching huts:", error);
    return {
      props: {
        huts: [],
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
