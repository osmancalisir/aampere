// src/app/page.tsx

"use client";

import { useQuery, gql } from "@apollo/client";
import { useState } from "react";
import {
  Grid,
  Container,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  Box,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Link from "next/link";

const GET_VEHICLES = gql`
  query GetVehicles {
    vehicles {
      id
      brand
      model
      year
      price
      range_km
      condition
      location
      images
    }
  }
`;

export default function Home() {
  const { loading, error, data } = useQuery(GET_VEHICLES);
  const [filters, setFilters] = useState({
    search: "",
    condition: "",
    location: "",
    minPrice: "",
    maxPrice: "",
  });

  if (loading)
    return (
      <Container sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );

  if (error)
    return (
      <Container sx={{ py: 4, textAlign: "center" }}>
        <Typography color="error">Error: {error.message}</Typography>
      </Container>
    );

  const filteredVehicles = data?.vehicles?.filter((vehicle: any) => {
    const matchesSearch =
      vehicle.brand.toLowerCase().includes(filters.search.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(filters.search.toLowerCase());

    const matchesCondition = filters.condition ? vehicle.condition === filters.condition : true;
    const matchesLocation = filters.location ? vehicle.location.includes(filters.location) : true;
    const matchesPrice =
      (!filters.minPrice || vehicle.price >= Number(filters.minPrice)) &&
      (!filters.maxPrice || vehicle.price <= Number(filters.maxPrice));

    return matchesSearch && matchesCondition && matchesLocation && matchesPrice;
  });

  return (
    <Container sx={{ py: 4 }}>
      <Grid container justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Electric Vehicle Marketplace
        </Typography>
        <Button href="/add-vehicle" variant="contained" startIcon={<AddIcon />}>
          Add Vehicle
        </Button>
      </Grid>

      <Grid container spacing={2} mb={4}>
        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            fullWidth
            label="Search"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Select
            fullWidth
            value={filters.condition}
            onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
            displayEmpty
          >
            <MenuItem value="">All Conditions</MenuItem>
            <MenuItem value="New">New</MenuItem>
            <MenuItem value="Used">Used</MenuItem>
          </Select>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Select
            fullWidth
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            displayEmpty
          >
            <MenuItem value="">All Locations</MenuItem>
            {Array.from(new Set(data.vehicles.map((v: any) => v.location)))
              .sort()
              .map((loc: any) => (
                <MenuItem key={loc} value={loc}>
                  {loc}
                </MenuItem>
              ))}
          </Select>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Grid container spacing={1}>
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Min Price"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Max Price"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {filteredVehicles.length === 0 ? (
        <Box textAlign="center" py={6}>
          <Typography variant="h6" gutterBottom>
            No matching vehicles found
          </Typography>
          <Button
            variant="outlined"
            onClick={() =>
              setFilters({
                search: "",
                condition: "",
                location: "",
                minPrice: "",
                maxPrice: "",
              })
            }
          >
            Reset Filters
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredVehicles.map((vehicle: any) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={vehicle.id}>
              <Link href={`/vehicles/${vehicle.id}`} passHref style={{ textDecoration: "none" }}>
                <Card sx={{ height: "100%", transition: "transform 0.3s", "&:hover": { transform: "scale(1.02)" } }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={vehicle.images[0]}
                    alt={vehicle.brand}
                    sx={{ objectFit: "cover" }}
                  />
                  <CardContent>
                    <Typography variant="h6">
                      {vehicle.brand} {vehicle.model}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {vehicle.year} • {vehicle.location}
                    </Typography>
                    <Typography variant="body1" mt={1}>
                      €{vehicle.price.toLocaleString()}
                    </Typography>
                    <Typography variant="body2">Range: {vehicle.range_km} km</Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
