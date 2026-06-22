export const openApiDocument = {
    openapi: '3.0.0',
    info: {
        title: "API Documentation",
        version: "1.0.0",
        description:
            "OpenAPI documentation for the Hibiscus Digital Menu platform, featuring multilingual menu management, public menu access, administration tools, settings and media upload services.",
        contact: {
            name: "Renatta de Carvalho",
            // url: "https://github.com/RenattaDeCarvalho",
        },
        license: {
            name: "Private Project",
        },
    },
    servers: [
        {
            url: "https://hibiscus-menu.vercel.app",
            description: "Production",
        },
    ],
    components: {
        schemas: {
            Category: {
                type: "object",
                required: [
                    "id",
                    "slug",
                    "namePt",
                ],
                properties: {
                    id: {
                        type: "string",
                        example: "cmqk2u27s0000kfmxxk9o0tdx",
                    },

                    slug: {
                        type: "string",
                        example: "vinhos",
                    },

                    namePt: {
                        type: "string",
                        example: "Vinhos",
                    },

                    nameEn: {
                        type: "string",
                        example: "Wines",
                    },

                    nameEs: {
                        type: "string",
                        example: "Vinos",
                    },
                    sortOrder: {
                        type: "integer",
                        example: 1,
                    },
                    items: {
                        type: "array",
                        items: {
                            $ref: "#/components/schemas/MenuItem",
                        },
                    },
                    subCategories: {
                        type: "array",
                        items: {
                            $ref: "#/components/schemas/SubCategory",
                        },
                    },
                },
            },
            SubCategory: {
                type: "object",

                required: [
                    "id",
                    "slug",
                    "namePt",
                ],

                properties: {
                    id: {
                        type: "string",
                        example: "cmqk2u27s0000kfmxxk9o0tdx",
                    },

                    slug: {
                        type: "string",
                        example: "argentina",
                    },

                    namePt: {
                        type: "string",
                        example: "Argentina",
                    },

                    nameEn: {
                        type: "string",
                        example: "Argentina",
                    },

                    nameEs: {
                        type: "string",
                        example: "Argentina",
                    },

                    sortOrder: {
                        type: "integer",
                        example: 1,
                    },

                    items: {
                        type: "array",
                        items: {
                            $ref: "#/components/schemas/MenuItem",
                        },
                    },
                },
            },
            MenuItem: {
                type: "object",

                required: [
                    "id",
                    "namePt",
                    "price",
                ],

                properties: {
                    id: {
                        type: "string",
                        example: "cmqk2u27s0000kfmxxk9o0tdx",
                    },

                    namePt: {
                        type: "string",
                        example: "Filé Mignon",
                    },

                    nameEn: {
                        type: "string",
                        example: "Filet Mignon",
                    },

                    nameEs: {
                        type: "string",
                        example: "Filete Mignon",
                    },

                    descPt: {
                        type: "string",
                        example: "Servido com arroz e legumes.",
                    },

                    price: {
                        type: "number",
                        example: 89.9,
                    },

                    imageUrl: {
                        type: "string",
                        example: "/uploads/file-mignon.jpg",
                    },
                },
            },
            CategoryCreateRequest: {
                type: "object",

                required: [
                    "slug",
                    "namePt",
                    "nameEn",
                    "nameEs",
                ],

                properties: {
                    slug: {
                        type: "string",
                        example: "vinhos",
                    },

                    namePt: {
                        type: "string",
                        example: "Vinhos",
                    },

                    nameEn: {
                        type: "string",
                        example: "Wines",
                    },

                    nameEs: {
                        type: "string",
                        example: "Vinos",
                    },

                    descPt: {
                        type: "string",
                        example: "Carta de vinhos",
                    },

                    descEn: {
                        type: "string",
                        example: "Wine list",
                    },

                    descEs: {
                        type: "string",
                        example: "Carta de vinos",
                    },

                    iconUrl: {
                        type: "string",
                        example: "/icons/wine.svg",
                    },
                },
            },
            UserSignupRequest: {
                type: "object",

                required: [
                    "email",
                    "password",
                ],

                properties: {
                    email: {
                        type: "string",
                        example: "admin@hibiscus.com",
                    },

                    password: {
                        type: "string",
                        example: "123456",
                    },

                    name: {
                        type: "string",
                        example: "Administrador",
                    },
                },
            },
            UserSignupResponse: {
                type: "object",

                properties: {
                    id: {
                        type: "string",
                        example: "cmqk2u27s0000kfmxxk9o0tdx",
                    },

                    email: {
                        type: "string",
                        example: "admin@hibiscus.com",
                    },
                },
            },
            ErrorResponse: {
                type: "object",

                properties: {
                    error: {
                        type: "string",
                        example: "Email and password required",
                    },
                },
            },
        },
    },
    tags: [
        { name: "Public", description: "Public endpoints used by customers to browse the menu." },
        { name: "Authentication", description: "Admin authentication and session validation." },
        { name: "Admin Categories", description: "Protected category management endpoints." },
        { name: "Admin Items", description: "Protected menu item management endpoints." },
        { name: "Uploads", description: "Image upload and media handling endpoints." },
        { name: "Settings", description: "Restaurant configuration and visual settings." },
    ],
    paths: {
        "/api/categories": {
            get: {
                tags: ["Public"],
                summary: "List categories",
                description: "Returns all menu categories.",
                responses: {
                    "200": {
                        description: "Categories retrieved successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        $ref: "#/components/schemas/Category",
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        "/api/categories/{slug}/items": {
            get: {
                tags: ["Public"],
                summary: "Get category details",
                description: "Returns a category with its items and subcategories.",

                parameters: [
                    {
                        name: "slug",
                        in: "path",
                        required: true,
                        schema: {
                            type: "string",
                        },
                        example: "vinhos",
                    },
                ],

                responses: {
                    "200": {
                        description: "Category retrieved successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Category",
                                },
                            },
                        },
                    },

                    "404": {
                        description: "Category not found",
                    },
                },
            },
        },
        "/api/search": {
            get: {
                tags: ["Public"],
                summary: "Search menu items",
                description: "Searches categories and menu items.",
                parameters: [
                    {
                        name: "q",
                        in: "query",
                        required: true,
                        description: "Search term",
                        schema: {
                            type: "string",
                        },
                        example: "vinho",
                    },
                ],
                responses: {
                    "200": {
                        description: "Search completed successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        $ref: "#/components/schemas/MenuItem",
                                    },
                                },
                            },
                        },
                    },

                    "500": {
                        description: "Internal server error",
                    },
                },
            },
        },
        "/api/settings": {
            get: {
                tags: ["Public"],

                summary: "Get site settings",

                description:
                    "Returns public site settings.",

                responses: {
                    "200": {
                        description: "Settings retrieved successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    additionalProperties: {
                                        type: "string",
                                    },
                                },
                            },
                        },
                    },

                    "500": {
                        description: "Internal server error",
                    },
                },
            },
        },
        "/api/auth/register": {
            post: {
                tags: ["Authentication"],

                summary: "Register user",

                description:
                    "Creates a new admin user.",

                requestBody: {
                    required: true,

                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/UserSignupRequest",
                            },
                        },
                    },
                },

                responses: {
                    "200": {
                        description: "User created successfully",

                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/UserSignupResponse",
                                },
                            },
                        },
                    },

                    "400": {
                        description: "Validation error",

                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },

                    "500": {
                        description: "Internal server error",

                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                },
            },
        },
        "/api/admin/categories": {
            get: {
                tags: ["Admin Categories"],
                summary: "List categories",
                description:
                    "Returns all categories including item count.",
                responses: {
                    "200": {
                        description: "Categories retrieved successfully",

                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        $ref: "#/components/schemas/Category",
                                    },
                                },
                            },
                        },
                    },

                    "401": {
                        description: "Unauthorized",
                    },

                    "500": {
                        description: "Internal server error",
                    },
                },
            },
            post: {
                tags: ["Admin Categories"],
                summary: "Create category",
                description:
                    "Creates a new category.",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/CategoryCreateRequest",
                            },
                        },
                    },
                },

                responses: {
                    "200": {
                        description: "Category created successfully",

                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Category",
                                },
                            },
                        },
                    },

                    "401": {
                        description: "Unauthorized",
                    },

                    "500": {
                        description: "Internal server error",
                    },
                },
            }
        }
    }
};