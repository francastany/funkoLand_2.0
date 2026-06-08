import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { FunkoCard } from "@/components/FunkoCard";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFunkos } from "@/hooks/useFunkos";
import type { Funko } from "@/types";
import { X } from "lucide-react";
import sentenceCase from "@/utils/utils";

const AVAILABILITY_OPTIONS = [
  { key: "in-stock", label: "In Stock (5+)" },
  // { key: "pre-order", label: "Pre Order (1-4)" },
  { key: "out-of-stock", label: "Out of Stock" },
] as const;
const SORT_OPTIONS = [
  { key: "title-asc", label: "Title, ASC" },
  { key: "title-desc", label: "Title, DESC" },
  { key: "price-asc", label: "Price, ASC" },
  { key: "price-desc", label: "Price, DESC" },
] as const;

type SortKey = (typeof SORT_OPTIONS)[number]["key"];

const normalizeCategory = (value?: string | null) => sentenceCase(value ?? "");

const getAvailability = (funko: Funko) => {
  const stock = funko.stock ?? 0;
  if (stock >= 5) return "in-stock";
  if (stock > 0) return "pre-order";
  return "out-of-stock";
};

const parseListParam = (value: string | null) =>
  value
    ?.split(",")
    .map((item) => item.trim())
    .filter(Boolean) ?? [];

export function Funkos() {
  const { funkos, loading, error } = useFunkos();
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryFilter = normalizeCategory(searchParams.get("category"));
  const categoryValue = categoryFilter || "all";
  const availabilityFilters = parseListParam(searchParams.get("availability"));
  const rawSort = searchParams.get("sort");
  const sortValue = SORT_OPTIONS.some((option) => option.key === rawSort)
    ? (rawSort as SortKey)
    : "title-asc";
  const priceMinInput = searchParams.get("priceMin") ?? "";
  const priceMaxInput = searchParams.get("priceMax") ?? "";
  const parsedPriceMin = Number(priceMinInput);
  const parsedPriceMax = Number(priceMaxInput);
  const priceMin =
    priceMinInput.trim() === "" || !Number.isFinite(parsedPriceMin)
      ? null
      : parsedPriceMin;
  const priceMax =
    priceMaxInput.trim() === "" || !Number.isFinite(parsedPriceMax)
      ? null
      : parsedPriceMax;

  const updateParam = (key: string, value: string | string[] | null) => {
    const next = new URLSearchParams(searchParams);
    if (
      value == null ||
      (Array.isArray(value) && value.length === 0) ||
      value === ""
    ) {
      next.delete(key);
    } else {
      next.set(key, Array.isArray(value) ? value.join(",") : value);
    }
    setSearchParams(next);
  };

  const toggleListParam = (key: string, value: string) => {
    const current = new Set(parseListParam(searchParams.get(key)));
    if (current.has(value)) {
      current.delete(value);
    } else {
      current.add(value);
    }
    updateParam(key, Array.from(current));
  };

  const updatePriceRange = (min: number | null, max: number | null) => {
    const next = new URLSearchParams(searchParams);
    if (min == null) {
      next.delete("priceMin");
    } else {
      next.set("priceMin", String(min));
    }
    if (max == null) {
      next.delete("priceMax");
    } else {
      next.set("priceMax", String(max));
    }
    setSearchParams(next);
  };

  const maxPrice = useMemo(() => {
    const prices = funkos
      .map((funko) => funko.price)
      .filter((price): price is number => price != null);
    if (prices.length === 0) return 0;
    return Math.max(...prices);
  }, [funkos]);

  const sliderMax = Math.max(maxPrice, 0);
  const sliderMin = 0;
  const sliderValue = useMemo(() => {
    const minValue = Math.max(sliderMin, priceMin ?? sliderMin);
    const maxValue = Math.min(sliderMax, priceMax ?? sliderMax);
    return [Math.min(minValue, maxValue), Math.max(minValue, maxValue)];
  }, [priceMin, priceMax, sliderMax]);

  const categoryOptions = useMemo(() => {
    const categories = new Map<string, string>();
    funkos.forEach((funko) => {
      const raw = funko.category?.trim();
      if (!raw) return;
      categories.set(normalizeCategory(raw), raw);
    });
    return Array.from(categories.entries())
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [funkos]);

  const categoryItems = useMemo(
    () => [{ value: "all", label: "All categories" }, ...categoryOptions],
    [categoryOptions],
  );

  const selectedCategory = useMemo(
    () =>
      categoryItems.find((option) => option.value === categoryValue) ??
      categoryItems[0],
    [categoryItems, categoryValue],
  );

  const filteredFunkos = useMemo(() => {
    let list = [...funkos];

    if (categoryFilter) {
      list = list.filter(
        (funko) => normalizeCategory(funko.category) === categoryFilter,
      );
    }

    if (availabilityFilters.length > 0) {
      list = list.filter((funko) =>
        availabilityFilters.includes(getAvailability(funko)),
      );
    }

    if (priceMin != null || priceMax != null) {
      list = list.filter((funko) => {
        if (funko.price == null) return false;
        if (priceMin != null && funko.price < priceMin) return false;
        if (priceMax != null && funko.price > priceMax) return false;
        return true;
      });
    }

    list.sort((a, b) => {
      switch (sortValue) {
        case "title-desc":
          return b.name.localeCompare(a.name);
        case "price-asc":
          return (
            (a.price ?? Number.POSITIVE_INFINITY) -
            (b.price ?? Number.POSITIVE_INFINITY)
          );
        case "price-desc":
          return (
            (b.price ?? Number.NEGATIVE_INFINITY) -
            (a.price ?? Number.NEGATIVE_INFINITY)
          );
        case "title-asc":
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return list;
  }, [
    funkos,
    categoryFilter,
    availabilityFilters,
    priceMin,
    priceMax,
    sortValue,
  ]);

  return (
    <section className="mx-auto max-w-6xl pb-8 max-lg:px-6 sm:pb-12">
      <header>
        <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">
          Product Collection
        </h2>

        <p className="mt-4 max-w-md text-gray-500">
          Explore the latest Funkos and refine the collection with filters that
          match your style.
        </p>

        <div className="mt-4 flex items-start gap-2 text-sm">
          <span className="text-gray-500">
            Showing{" "}
            {categoryFilter ? (
              <span className="inline-flex items-center gap-2 rounded-sm bg-primary/30 py-1 px-2 text-gray-700">
                {categoryFilter}
                <button
                  type="button"
                  onClick={() => updateParam("category", null)}
                  className="text-gray-800"
                >
                  <X className="size-4" />
                </button>
              </span>
            ) : (
              "All"
            )}{" "}
            | {filteredFunkos.length} items
          </span>
        </div>
      </header>

      <div className="mt-8 block lg:hidden">
        <button className="flex cursor-pointer items-center gap-2 border-b border-gray-400 pb-1 text-gray-900 transition hover:border-gray-600">
          <span className="text-sm font-medium"> Filters &amp; Sorting </span>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-4 rtl:rotate-180"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            ></path>
          </svg>
        </button>
      </div>

      <div className="mt-4 lg:mt-8 lg:grid lg:grid-cols-4 lg:items-start lg:gap-8">
        <div className="hidden space-y-4 lg:block">
          <div>
            <label
              htmlFor="SortBy"
              className="block text-xs font-medium text-gray-700 mb-2"
            >
              Sort By
            </label>

            <Select
              value={sortValue}
              onValueChange={(value) => updateParam("sort", value)}
            >
              <SelectTrigger id="SortBy" className="rounded-sm text-sm p-4">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.key} value={option.key}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <p className="block text-xs font-medium text-gray-700">Filters</p>

            <div className="mt-1 space-y-2">
              <details className="overflow-hidden rounded-sm border border-gray-300 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between gap-2 p-4 text-gray-900 transition">
                  <span className="text-sm font-medium"> Category </span>

                  <span className="transition group-open:-rotate-180">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                      ></path>
                    </svg>
                  </span>
                </summary>

                <div className="border-t border-gray-200 bg-white">
                  <header className="flex items-center justify-between p-4">
                    <span className="text-sm text-gray-700">
                      {categoryFilter
                        ? `Selected: ${categoryFilter}`
                        : "All categories"}
                    </span>

                    <button
                      type="button"
                      onClick={() => updateParam("category", null)}
                      className="text-sm text-gray-900 underline underline-offset-4"
                    >
                      Reset
                    </button>
                  </header>

                  <div className="border-t border-gray-200 p-4 *:cursor-pointer">
                    <label htmlFor="FilterCategory" className="sr-only">
                      Category
                    </label>
                    <Combobox
                      items={categoryItems}
                      value={selectedCategory}
                      onValueChange={(option) =>
                        updateParam(
                          "category",
                          option?.value === "all"
                            ? null
                            : (option?.value ?? null),
                        )
                      }
                      itemToStringValue={(option) => option?.label ?? ""}
                    >
                      <ComboboxInput
                        id="FilterCategory"
                        placeholder="All categories"
                        className="w-full rounded-sm text-sm border border-gray-300 bg-white text-left text-gray-900 shadow-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                      />
                      <ComboboxContent>
                        <ComboboxEmpty>No categories found.</ComboboxEmpty>
                        <ComboboxList>
                          {(option) => (
                            <ComboboxItem
                              className="cursor-pointer"
                              key={option.value}
                              value={option}
                            >
                              {option.label}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  </div>
                </div>
              </details>

              <details className="overflow-hidden rounded-sm border border-gray-300 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between gap-2 p-4 text-gray-900 transition">
                  <span className="text-sm font-medium"> Availability </span>

                  <span className="transition group-open:-rotate-180">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                      ></path>
                    </svg>
                  </span>
                </summary>

                <div className="border-t border-gray-200 bg-white">
                  <header className="flex items-center justify-between p-4">
                    <span className="text-sm text-gray-700">
                      {availabilityFilters.length} Selected
                    </span>

                    <button
                      type="button"
                      onClick={() => updateParam("availability", null)}
                      className="text-sm text-gray-900 underline underline-offset-4"
                    >
                      Reset
                    </button>
                  </header>

                  <ul className="space-y-1 border-t border-gray-200 p-4">
                    {AVAILABILITY_OPTIONS.map((option) => (
                      <li key={option.key}>
                        <label
                          htmlFor={`FilterAvailability-${option.key}`}
                          className="inline-flex items-center gap-2"
                        >
                          <input
                            type="checkbox"
                            id={`FilterAvailability-${option.key}`}
                            className="size-5 rounded-sm border-gray-300 shadow-sm"
                            checked={availabilityFilters.includes(option.key)}
                            onChange={() =>
                              toggleListParam("availability", option.key)
                            }
                          />

                          <span className="text-sm font-medium text-gray-700">
                            {option.label}
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              </details>

              <div className="overflow-hidden rounded-sm border border-gray-300 bg-white">
                <header className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Price</p>
                    <p className="text-xs text-gray-700">
                      The highest price is ${maxPrice.toFixed(0)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      updatePriceRange(null, null);
                    }}
                    className="text-sm text-gray-900 underline underline-offset-4"
                  >
                    Reset
                  </button>
                </header>

                <div className="border-t border-gray-200 p-4">
                  <div className="flex items-center justify-between text-sm text-gray-700">
                    <span>${sliderValue[0].toFixed(0)}</span>
                    <span>${sliderValue[1].toFixed(0)}</span>
                  </div>
                  <div className="mt-4">
                    <Slider
                      min={sliderMin}
                      max={sliderMax}
                      step={1}
                      value={sliderValue}
                      onValueChange={(value) => {
                        const [minValue, maxValue] = value;
                        const isFullRange =
                          minValue <= sliderMin && maxValue >= sliderMax;
                        if (isFullRange) {
                          updatePriceRange(null, null);
                          return;
                        }
                        updatePriceRange(minValue, maxValue);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          {loading && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={`funko-loading-${index}`}
                  className="h-100 rounded-lg bg-gray-200 animate-pulse"
                />
              ))}
            </div>
          )}

          {!loading && error && (
            <p className="rounded-sm border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              Error loading funkos: {error}
            </p>
          )}

          {!loading && !error && filteredFunkos.length === 0 && (
            <p className="rounded-sm border border-gray-200 bg-white p-4 text-sm text-gray-700">
              No funkos match the selected filters.
            </p>
          )}

          {!loading && !error && filteredFunkos.length > 0 && (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredFunkos.map((funko) => (
                <li key={funko.id}>
                  <FunkoCard
                    funko={funko}
                    onCategorySelect={(category) =>
                      updateParam("category", category)
                    }
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
