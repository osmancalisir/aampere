// src/app/api/graphql/route.ts

import { NextRequest, NextResponse } from "next/server";
import { graphql, GraphQLSchema } from "graphql";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { typeDefs } from "@/lib/graphql/schema";
import { resolvers } from "@/lib/graphql/resolvers";

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export async function POST(request: NextRequest) {
  const { query, variables } = await request.json();

  try {
    const result = await graphql({
      schema,
      source: query,
      variableValues: variables,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ errors: [(error as Error).message] }, { status: 500 });
  }
}
