// src/lib/graphql/schema.ts

import { gql } from "graphql-tag";

export const typeDefs = gql`
  type Vehicle {
    id: ID!
    brand: String!
    model: String!
    year: Int!
    price: Float!
    range_km: Int!
    color: String!
    condition: String!
    battery_capacity_kWh: Float!
    charging_speed_kW: Float!
    seats: Int!
    drivetrain: String!
    location: String!
    autopilot: Boolean!
    kilometer_count: Int!
    accidents: Boolean!
    accident_description: String
    images: [String!]!
  }

  input VehicleInput {
    brand: String!
    model: String!
    year: Int!
    price: Float!
    range_km: Int!
    color: String!
    condition: String!
    battery_capacity_kWh: Float!
    charging_speed_kW: Float!
    seats: Int!
    drivetrain: String!
    location: String!
    autopilot: Boolean!
    kilometer_count: Int!
    accidents: Boolean!
    accident_description: String
    images: [String!]!
  }

  type Query {
    vehicles: [Vehicle!]!
    vehicle(id: ID!): Vehicle
  }

  type Mutation {
    addVehicle(vehicle: VehicleInput!): Vehicle
    removeVehicle(id: ID!): Boolean
  }
`;
