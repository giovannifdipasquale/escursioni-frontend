// components/SearchFilter.tsx
type SearchFilterProps = {
  search: string;
  onSearchChange: (val: string) => void;

  difficulty?: string;
  onDifficultyChange?: (val: string) => void;

  season?: string;
  onSeasonChange?: (val: string) => void;

  maxDuration?: number;
  onDurationChange?: (val: number) => void;
};

export default function SearchFilter({
  search,
  onSearchChange,
  difficulty,
  onDifficultyChange,
  season,
  onSeasonChange,
  maxDuration,
  onDurationChange,
}: SearchFilterProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 bg-gray-50">
      {/* 🔍 Testo */}
      <input
        type="text"
        className="border rounded-xl px-3 py-2 w-full"
        placeholder="Cerca per titolo o descrizione..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      {/* 🎯 Difficoltà */}
      <select
        className="border rounded-xl px-3 py-2 w-full"
        value={difficulty || ""}
        onChange={(e) => onDifficultyChange?.(e.target.value)}
      >
        <option value="">Tutte le difficoltà</option>
        <option value="easy">Facile</option>
        <option value="moderate">Media</option>
        <option value="hard">Difficile</option>
      </select>

      {/* 🌿 Stagione */}
      <select
        className="border rounded-xl px-3 py-2 w-full"
        value={season || ""}
        onChange={(e) => onSeasonChange?.(e.target.value)}
      >
        <option value="">Tutte le stagioni</option>
        <option value="spring">Primavera</option>
        <option value="summer">Estate</option>
        <option value="autumn">Autunno</option>
        <option value="winter">Inverno</option>
      </select>

      {/* ⏱️ Durata max */}
      <select
        className="border rounded-xl px-3 py-2 w-full"
        value={maxDuration?.toString() || ""}
        onChange={(e) => onDurationChange?.(Number(e.target.value))}
      >
        <option value="">Qualsiasi durata</option>
        <option value="2">Max 2 ore</option>
        <option value="4">Max 4 ore</option>
        <option value="6">Max 6 ore</option>
        <option value="8">Max 8 ore</option>
      </select>
    </div>
  );
}
