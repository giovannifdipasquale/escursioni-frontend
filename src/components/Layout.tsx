import { ReactNode } from "react";
import Header from "./Header";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div>
      <div
        className="absolute w-full h-[500px] mb-8 -z-10"
        style={{
          backgroundImage: `linear-gradient(to top, transparent 0%,  rgba(0, 0, 0, 0.6) 100%), url('/assets/images/Corno_grande_da_campo_imperatore.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        aria-label="Corno Grande da Campo Imperatore"
        role="img"
      />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">{children}</main>
        <footer className="bg-gray-100 py-6 mt-auto">
          <div className="container mx-auto px-6">
            <p className="text-center text-gray-600">
              © {new Date().getFullYear()} Escursioni. Tutti i diritti
              riservati.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
