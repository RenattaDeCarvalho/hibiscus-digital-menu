"use client";

import Image from "next/image";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

import { openApiDocument } from "@/docs/openapi";

export default function SwaggerDocs() {
  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center gap-4 border-b border-gray-200 px-8 py-6">
        <Image
          src="/logo-hibiscus.png"
          alt="Hibiscus"
          width={96}
          height={96}
          className="object-contain"
        />

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Hibiscus Digital Menu API
          </h1>

          <p className="mt-1 text-gray-500">
            Public menu, administration, authentication and upload endpoints.
          </p>

          <br />
          <a
            href="https://hibiscus-menu.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-600 hover:text-amber-700"
          >
            Open Production Environment ↗
          </a>
          <br />
          <a
            href="https://github.com/RenattaDeCarvalho"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-600 hover:text-amber-700"
          >
            View GitHub Repository ↗
          </a>
        </div>
      </div>

      <div className="p-5">
        <SwaggerUI
          spec={openApiDocument}
          docExpansion="none"
          defaultModelsExpandDepth={1}
          defaultModelExpandDepth={1}
          displayRequestDuration
          persistAuthorization
        />
      </div>
    </div>
  );
}
