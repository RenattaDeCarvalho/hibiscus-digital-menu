"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

import { openApiDocument } from "@/docs/openapi";

export default function SwaggerDocs() {
  return (
    <div
      style={{
        background: "#fff",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <SwaggerUI spec={openApiDocument} />
    </div>
  );
}
