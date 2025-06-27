// src/app/vehicles/[id]/page.tsx

"use client";

import { useState } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { useRouter, useParams } from "next/navigation";
import {
  Container,
  Grid,
  Typography,
  Button,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";

const GET_VEHICLE = gql`
  query GetVehicle($id: ID!) {
    vehicle(id: $id) {
      id
      brand
      model
      year
      price
      range_km
      color
      condition
      battery_capacity_kWh
      charging_speed_kW
      seats
      drivetrain
      location
      autopilot
      kilometer_count
      accidents
      accident_description
      images
    }
  }
`;

const REMOVE_VEHICLE = gql`
  mutation RemoveVehicle($id: ID!) {
    removeVehicle(id: $id)
  }
`;

export default function VehicleDetail() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const { loading, error, data } = useQuery(GET_VEHICLE, {
    variables: { id },
    skip: !id,
  });

  const [removeVehicle] = useMutation(REMOVE_VEHICLE, {
    variables: { id },
    onCompleted: () => router.push("/"),
  });

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  if (loading)
    return (
      <Container sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Container>
    );

  if (error)
    return (
      <Container sx={{ py: 4, textAlign: "center" }}>
        <Typography color="error">Error: {error.message}</Typography>
      </Container>
    );

  const vehicle = data?.vehicle;

  if (!vehicle)
    return (
      <Container sx={{ py: 4, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          Vehicle not found
        </Typography>
        <Button variant="contained" onClick={() => router.push("/")} sx={{ mt: 2 }}>
          Back to Home
        </Button>
      </Container>
    );

  const specs = [
    { label: "Range", value: `${vehicle.range_km} km` },
    { label: "Battery", value: `${vehicle.battery_capacity_kWh} kWh` },
    { label: "Charging", value: `${vehicle.charging_speed_kW} kW` },
    { label: "Drivetrain", value: vehicle.drivetrain },
    { label: "Color", value: vehicle.color },
    { label: "Mileage", value: `${vehicle.kilometer_count.toLocaleString()} km` },
    { label: "Seats", value: `${vehicle.seats} seats` },
    { label: "Autopilot", value: vehicle.autopilot ? "Available" : "Not available" },
  ];

  return (
    <Container sx={{ py: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => router.push("/")}>
        Back
      </Button>

      <Grid container spacing={4} mt={2}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardMedia
              component="img"
              height="500"
              image={vehicle.images[activeImage]}
              alt={`${vehicle.brand} ${vehicle.model}`}
              sx={{ objectFit: "contain" }}
            />
          </Card>
          <Box sx={{ display: "flex", gap: 2, mt: 2, overflowX: "auto" }}>
            {vehicle.images.map((img: string, i: number) => (
              <Card
                key={i}
                sx={{
                  minWidth: 100,
                  border: activeImage === i ? "2px solid #1976d2" : "none",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
                onClick={() => setActiveImage(i)}
              >
                <CardMedia component="img" height="80" image={img} alt={`View ${i + 1}`} />
              </Card>
            ))}
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            <Box>
              <Typography variant="h4" gutterBottom>
                {vehicle.brand} {vehicle.model}
              </Typography>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Chip label={vehicle.condition} color="primary" size="small" />
                <Typography variant="body2" color="text.secondary">
                  {vehicle.year} • {vehicle.location}
                </Typography>
              </Box>
            </Box>
            <IconButton color="error" onClick={() => setShowConfirmation(true)}>
              <DeleteIcon />
            </IconButton>
          </Box>

          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h5" color="primary" gutterBottom>
                €{vehicle.price.toLocaleString()}
              </Typography>
              <Button fullWidth variant="contained">
                Contact
              </Button>
            </CardContent>
          </Card>

          <Typography variant="h6" gutterBottom>
            Specifications
          </Typography>
          <Grid container spacing={2}>
            {specs.map((spec, index) => (
              <Grid size={{ xs: 6 }} key={index}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      {spec.label}
                    </Typography>
                    <Typography variant="body1">{spec.value}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {vehicle.accidents && (
            <Card sx={{ mt: 3, bgcolor: "error.light", borderColor: "error.main" }}>
              <CardContent>
                <Typography variant="subtitle1" color="error.main" gutterBottom>
                  Accident History
                </Typography>
                <Typography variant="body2">{vehicle.accident_description}</Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      <Dialog open={showConfirmation} onClose={() => setShowConfirmation(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this vehicle?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmation(false)}>Cancel</Button>
          <Button
            color="error"
            onClick={() => {
              removeVehicle();
              setShowConfirmation(false);
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
