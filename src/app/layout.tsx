// src/app/layout.tsx

"use client";

import React from "react";
import { ApolloClientProvider } from "./providers";
import { Box, Container, AppBar, Toolbar, Typography, Button } from "@mui/material";
import Link from "next/link";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <ApolloClientProvider>
          <AppBar position="static" color="default">
            <Container>
              <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  <Link href="/" className="text-inherit no-underline">
                    Aampere EV
                  </Link>
                </Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button color="inherit" href="/">
                    Home
                  </Button>
                </Box>
              </Toolbar>
            </Container>
          </AppBar>

          <Container component="main" sx={{ py: 4 }}>
            {children}
          </Container>

          <Box component="footer" sx={{ bgcolor: "background.paper", py: 3, mt: "auto" }}>
            <Container maxWidth="lg">
              <Typography variant="body2" color="text.secondary" align="center">
                © {new Date().getFullYear()} Aampere GmbH. All rights reserved.
              </Typography>
            </Container>
          </Box>
        </ApolloClientProvider>
      </body>
    </html>
  );
}
