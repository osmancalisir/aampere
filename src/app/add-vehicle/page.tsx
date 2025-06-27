// src/app/add-vehicle/page.tsx

"use client";

import React from "react";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { gql } from "@apollo/client";
import {
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Box,
  CircularProgress,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";

const ADD_VEHICLE = gql`
  mutation AddVehicle($vehicle: VehicleInput!) {
    addVehicle(vehicle: $vehicle) {
      id
    }
  }
`;

export default function AddVehicle() {
  const router = useRouter();
  const [addVehicle, { loading, error }] = useMutation(ADD_VEHICLE);
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: 2025,
    price: 0,
    range_km: 0,
    color: "",
    condition: "New",
    battery_capacity_kWh: 0,
    charging_speed_kW: 0,
    seats: 5,
    drivetrain: "RWD",
    location: "",
    autopilot: false,
    kilometer_count: 0,
    accidents: false,
    accident_description: "",
    images: [""],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const vehicleInput = {
      ...formData,
      year: Number(formData.year),
      price: Number(formData.price),
      range_km: Number(formData.range_km),
      battery_capacity_kWh: Number(formData.battery_capacity_kWh),
      charging_speed_kW: Number(formData.charging_speed_kW),
      seats: Number(formData.seats),
      kilometer_count: Number(formData.kilometer_count),
    };

    try {
      const { data } = await addVehicle({
        variables: { vehicle: vehicleInput },
      });

      if (data?.addVehicle?.id) {
        router.push(`/vehicles/${data.addVehicle.id}`);
      }
    } catch (err) {
      console.error("Error adding vehicle:", err);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Add New Vehicle
      </Typography>

      {error && (
        <Typography color="error" gutterBottom>
          Error: {error.message}
        </Typography>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField required fullWidth label="Brand" name="brand" value={formData.brand} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField required fullWidth label="Model" name="model" value={formData.model} onChange={handleChange} />
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              required
              fullWidth
              label="Year"
              name="year"
              type="number"
              value={formData.year}
              onChange={handleChange}
              inputProps={{ min: 2000, max: 2025 }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              required
              fullWidth
              label="Price (€)"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              required
              fullWidth
              label="Range (km)"
              name="range_km"
              type="number"
              value={formData.range_km}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField required fullWidth label="Color" name="color" value={formData.color} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Condition</InputLabel>
              <Select
                required
                value={formData.condition}
                label="Condition"
                name="condition"
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              >
                <MenuItem value="New">New</MenuItem>
                <MenuItem value="Used">Used</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              required
              fullWidth
              label="Battery Capacity (kWh)"
              name="battery_capacity_kWh"
              type="number"
              value={formData.battery_capacity_kWh}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              required
              fullWidth
              label="Charging Speed (kW)"
              name="charging_speed_kW"
              type="number"
              value={formData.charging_speed_kW}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              required
              fullWidth
              label="Seats"
              name="seats"
              type="number"
              value={formData.seats}
              onChange={handleChange}
              inputProps={{ min: 1, max: 9 }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth>
              <InputLabel>Drivetrain</InputLabel>
              <Select
                required
                value={formData.drivetrain}
                label="Drivetrain"
                name="drivetrain"
                onChange={(e) => setFormData({ ...formData, drivetrain: e.target.value })}
              >
                <MenuItem value="RWD">RWD</MenuItem>
                <MenuItem value="FWD">FWD</MenuItem>
                <MenuItem value="AWD">AWD</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              required
              fullWidth
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControlLabel
              control={<Checkbox checked={formData.autopilot} onChange={handleChange} name="autopilot" />}
              label="Autopilot Available"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Mileage (km)"
              name="kilometer_count"
              type="number"
              value={formData.kilometer_count}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <FormControlLabel
              control={<Checkbox checked={formData.accidents} onChange={handleChange} name="accidents" />}
              label="Accident History"
            />
          </Grid>

          {formData.accidents && (
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Accident Description"
                name="accident_description"
                value={formData.accident_description}
                onChange={handleChange}
              />
            </Grid>
          )}

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Image URL"
              name="images"
              value={formData.images.join(",")}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  images: e.target.value.split(","),
                })
              }
              helperText="Enter full image URLs separated by commas"
            />
          </Grid>
        </Grid>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          <Button type="submit" variant="contained" disabled={loading} sx={{ ml: 1 }}>
            {loading ? <CircularProgress size={24} /> : "Add Vehicle"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
