export const options = {
    definition:{
        openapi: "3.0.0",
        info:{
            title: "B4RCM Project OpenAPI Document",
            version: "1.0.0",
            description: "Express library API"

        },
        servers: [
            {
                url: "http://localhost:3000"
            }
        ],
        components:{
            securitySchemes:{
                bearerAuth:{
                    type:"http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },
        security: [
            {   
                bearerAuth: []
            }
        ],
    },
    apis:["./src/router/*.ts"]
};