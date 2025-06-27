// src/app/components/ImageCarousel.tsx

"use client";

import React, { useState } from "react";
import { Box, Grid, Card, CardMedia, IconButton, useTheme, useMediaQuery } from "@mui/material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { styled } from "@mui/system";

const ThumbnailCard = styled(Card)(({ theme }) => ({
  cursor: "pointer",
  borderRadius: theme.shape.borderRadius,
  transition: "border 0.3s ease",
  overflow: "hidden",
  height: "100%",
}));

export default function ImageCarousel({ images }: { images: string[] }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <Box sx={{ position: "relative" }}>
      {/* Main Image */}
      <Card sx={{ mb: 2, borderRadius: 2, overflow: "hidden" }}>
        <CardMedia
          component="img"
          image={images[activeIndex]}
          alt={`Vehicle view ${activeIndex + 1}`}
          sx={{
            aspectRatio: "16/9",
            objectFit: "cover",
            [theme.breakpoints.up("md")]: {
              height: 500,
            },
          }}
        />
      </Card>

      <IconButton
        onClick={handlePrev}
        sx={{
          position: "absolute",
          top: "50%",
          left: 8,
          transform: "translateY(-50%)",
          bgcolor: "rgba(0,0,0,0.5)",
          color: "white",
          "&:hover": {
            bgcolor: "rgba(0,0,0,0.8)",
          },
        }}
      >
        <NavigateBeforeIcon fontSize="large" />
      </IconButton>

      <IconButton
        onClick={handleNext}
        sx={{
          position: "absolute",
          top: "50%",
          right: 8,
          transform: "translateY(-50%)",
          bgcolor: "rgba(0,0,0,0.5)",
          color: "white",
          "&:hover": {
            bgcolor: "rgba(0,0,0,0.8)",
          },
        }}
      >
        <NavigateNextIcon fontSize="large" />
      </IconButton>

      <Grid container spacing={1} sx={{ overflowX: "auto", flexWrap: "nowrap", py: 1 }}>
        {images.map((img, index) => (
          <Grid key={index} size={{ xs: 3, sm: 2, md: 1.5 }} sx={{ flexShrink: 0 }}>
            <ThumbnailCard onClick={() => handleThumbnailClick(index)}>
              <CardMedia
                component="img"
                image={img}
                alt={`Thumbnail ${index + 1}`}
                sx={{
                  aspectRatio: "1",
                  objectFit: "cover",
                  height: isMobile ? 60 : 80,
                }}
              />
            </ThumbnailCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
