import "dotenv/config";
import express from "express";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";

import { connectDB } from "./src/config/db.js";
import typeDefs from "./src/graphql/schema.js";
import resolvers from "./src/graphql/resolvers.js";
import { getUserFromReq } from "./src/middleware/auth.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

await connectDB(process.env.MONGO_URI);

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        const user = getUserFromReq(req);
        return { user };
    }
});

await server.start();
server.applyMiddleware({ app, path: "/graphql" });

const port = process.env.PORT || 8081;

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/graphql`);
});