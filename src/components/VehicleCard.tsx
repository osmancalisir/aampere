// src/app/components/VehicleCard.tsx

import Image from "next/image";
import Link from "next/link";
import { Vehicle } from "@/types/vehicle";

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <div className="group h-full">
      <Link href={`/vehicles/${vehicle.id}`}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer h-full flex flex-col border border-gray-200 dark:border-gray-700">
          <div className="relative aspect-square w-full">
            <Image
              src={vehicle.images[0]}
              alt={`${vehicle.brand} ${vehicle.model}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute top-2 right-2">
              <span className="bg-primary text-white text-xs px-2 py-1 rounded-full capitalize">
                {vehicle.condition}
              </span>
            </div>
          </div>
          <div className="p-4 flex-grow flex flex-col">
            <div className="flex justify-between items-start gap-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {vehicle.brand} {vehicle.model}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  {vehicle.year} • {vehicle.range_km.toLocaleString()} km
                </p>
              </div>
            </div>

            <div className="mt-3 flex items-center">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-1.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-sm text-gray-500 dark:text-gray-400 truncate">{vehicle.location}</span>
            </div>

            <div className="mt-auto pt-3 flex justify-between items-center border-t border-gray-100 dark:border-gray-700">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                €{vehicle.price.toLocaleString()}
              </span>
              <span className="text-xs font-medium text-primary dark:text-blue-300">VIEW DETAILS</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
