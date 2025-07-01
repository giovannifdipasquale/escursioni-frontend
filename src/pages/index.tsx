import { GetStaticProps } from "next";
import api from "@/lib/api";

type ImageFormat = {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path: null;
  width: number;
  height: number;
  size: number;
  sizeInBytes: number;
  url: string;
};

type HeroImage = {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail: ImageFormat;
    small: ImageFormat;
    medium: ImageFormat;
    large: ImageFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

type Localization = {
  id: number;
  documentId: string;
  locale: string;
};

type HomepageProps = {
  homepage: {
    id: number;
    documentId: string;
    main_title: string;
    intro_text: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string;
    hero_image: HeroImage | null;
    localizations: Localization[];
  };
};

export default function Home({ homepage }: HomepageProps) {
  return (
    <div>
      <div className="w-full h-[500px] mb-8 flex items-center justify-center">
        <div>
          <h1 className="text-[200px] font-bold h-full w-full text-center text-smoky-black-t">
            {homepage.main_title}
          </h1>
        </div>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const res = await api.get("/homepage?populate=*");
    const data = res.data.data;

    if (!data) {
      throw new Error("No homepage data found");
    }

    return {
      props: {
        homepage: {
          id: data.id,
          documentId: data.documentId,
          main_title: data.main_title || "",
          intro_text: data.intro_text || "",
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          publishedAt: data.publishedAt,
          locale: data.locale,
          hero_image: data.hero_image || null,
          localizations: data.localizations || [],
        },
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    return {
      props: {
        homepage: {
          id: 0,
          documentId: "",
          main_title: "",
          intro_text: "",
          createdAt: "",
          updatedAt: "",
          publishedAt: "",
          locale: "it",
          hero_image: null,
          localizations: [],
        },
      },
      revalidate: 60,
    };
  }
};
