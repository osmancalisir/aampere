// src/lib/graphql/resolvers.ts

import { Vehicle, VehicleInput } from "@/types/vehicle";
import { readData, writeData } from "@/lib/data-utils";
import { generateVehicleId } from "../data-utils";

export const resolvers = {
  Query: {
    vehicles: () => {
      const data = readData();
      return data.data;
    },
    vehicle: (_: any, { id }: { id: string }) => {
      const data = readData();
      return data.data.find((v: Vehicle) => v.id === id);
    },
  },
  Mutation: {
    addVehicle: (_: any, { vehicle }: { vehicle: VehicleInput }) => {
      const data = readData();
      const newVehicle: Vehicle = {
        ...vehicle,
        id: generateVehicleId(vehicle as Vehicle),
      };

      const updatedData = {
        count: data.data.length + 1,
        data: [...data.data, newVehicle],
      };

      writeData(updatedData);
      return newVehicle;
    },
    removeVehicle: (_: any, { id }: { id: string }) => {
      const data = readData();
      const initialLength = data.data.length;
      const newData = data.data.filter((v: Vehicle) => v.id !== id);

      if (newData.length < initialLength) {
        const updatedData = {
          count: newData.length,
          data: newData,
        };
        writeData(updatedData);
        return true;
      }
      return false;
    },
  },
};
