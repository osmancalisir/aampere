// src/lib/data-utils.ts

import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { Vehicle } from "@/types/vehicle";

export const generateVehicleId = (vehicle: Vehicle) => {
  const baseId = `${vehicle.brand}-${vehicle.model}-${vehicle.year}`
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  return `${baseId}-${uuidv4().split("-")[0]}`;
};

export const getDataPath = () => {
  if (process.env.NODE_ENV === "development") {
    return path.join(process.cwd(), "src/data/vehicle_data.json");
  } else {
    return path.join("/tmp/vehicle_data.json");
  }
};

export const readData = () => {
  const dataPath = getDataPath();

  try {
    if (!fs.existsSync(dataPath)) {
      const initialData = { count: 0, data: [] };
      fs.writeFileSync(dataPath, JSON.stringify(initialData, null, 2), "utf8");
      return initialData;
    }

    const rawData = fs.readFileSync(dataPath, "utf8");
    const data = JSON.parse(rawData);

    const validatedData = {
      count: data.count,
      data: data.data.map((v: Vehicle) => {
        if (!v.id) {
          return { ...v, id: generateVehicleId(v) };
        }
        return v;
      }),
    };

    if (
      validatedData.data.length !== data.data.length ||
      validatedData.data.some((v: any, i: any) => v.id !== data.data[i]?.id)
    ) {
      fs.writeFileSync(dataPath, JSON.stringify(validatedData, null, 2), "utf8");
    }

    return validatedData;
  } catch (error) {
    console.error("Error reading data:", error);
    return { count: 0, data: [] };
  }
};

export const writeData = (data: any) => {
  try {
    const dataPath = getDataPath();
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing data:", error);
  }
};
