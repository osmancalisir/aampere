// src/app/page.tsx

"use client";

import { useQuery, gql } from "@apollo/client";
import { useState, useMemo, ChangeEvent } from "react";
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
  FormControl,
  InputLabel,
  Pagination,
  SelectChangeEvent,
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
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "">("");
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | "all">(25);

  const filteredVehicles = useMemo(() => {
    if (loading || error || !data?.vehicles) return [];

    return data.vehicles.filter((vehicle: any) => {
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
  }, [data, loading, error, filters]);

  const sortedVehicles = useMemo(() => {
    if (!sortOrder) return filteredVehicles;

    return [...filteredVehicles].sort((a, b) => {
      return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
    });
  }, [filteredVehicles, sortOrder]);

  const paginatedVehicles = useMemo(() => {
    if (itemsPerPage === "all") return sortedVehicles;

    const startIndex = (page - 1) * itemsPerPage;
    return sortedVehicles.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedVehicles, page, itemsPerPage]);

  const handlePageChange = (_: ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const handleItemsPerPageChange = (e: SelectChangeEvent<number | "all">) => {
    const value = e.target.value;
    setItemsPerPage(value === "all" ? "all" : (value as number));
    setPage(1);
  };

  if (loading) {
    return (
      <Container sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4, textAlign: "center" }}>
        <Typography color="error">Error: {error.message}</Typography>
      </Container>
    );
  }

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
        <Grid size={{ xs: 12, md: 2 }}>
          <TextField
            fullWidth
            label="Search"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Condition</InputLabel>
            <Select
              value={filters.condition}
              onChange={(e) => setFilters({ ...filters, condition: e.target.value as string })}
              label="Condition"
            >
              <MenuItem value="">All Conditions</MenuItem>
              <MenuItem value="New">New</MenuItem>
              <MenuItem value="Used">Used</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Location</InputLabel>
            <Select
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value as string })}
              label="Location"
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
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Sort by Price</InputLabel>
            <Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "asc" | "desc" | "")}
              label="Sort by Price"
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="asc">Low to High</MenuItem>
              <MenuItem value="desc">High to Low</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Grid container spacing={1}>
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Min Price (€)"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Max Price (€)"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                inputProps={{ min: 0 }}
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
            onClick={() => {
              setFilters({
                search: "",
                condition: "",
                location: "",
                minPrice: "",
                maxPrice: "",
              });
              setSortOrder("");
            }}
          >
            Reset Filters
          </Button>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {paginatedVehicles.map((vehicle: any) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={vehicle.id}>
                <Link href={`/vehicles/${vehicle.id}`} passHref style={{ textDecoration: "none" }}>
                  <Card
                    sx={{
                      height: "100%",
                      transition: "transform 0.3s",
                      "&:hover": { transform: "scale(1.02)" },
                    }}
                  >
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

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 4,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <FormControl sx={{ minWidth: 120 }} size="small">
              <InputLabel>Items per page</InputLabel>
              <Select value={itemsPerPage} onChange={handleItemsPerPageChange} label="Items per page">
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
                <MenuItem value="all">All</MenuItem>
              </Select>
            </FormControl>

            {itemsPerPage !== "all" && (
              <Pagination
                count={Math.ceil(sortedVehicles.length / (itemsPerPage as number))}
                page={page}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
              />
            )}

            <Typography variant="body2">
              Showing{" "}
              {itemsPerPage === "all"
                ? sortedVehicles.length
                : `${Math.min(
                    (page - 1) * (itemsPerPage as number) + paginatedVehicles.length,
                    sortedVehicles.length
                  )} of ${sortedVehicles.length}`}{" "}
              vehicles
            </Typography>
          </Box>
        </>
      )}
    </Container>
  );
}
