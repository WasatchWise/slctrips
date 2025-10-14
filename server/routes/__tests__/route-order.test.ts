import { beforeAll, afterAll, describe, expect, it, vi } from 'vitest';
import type { Router } from 'express';

type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head' | 'all';

interface RouteLayer {
  route?: {
    path: string;
    methods: Record<string, boolean>;
  };
}

const originalDatabaseUrl = process.env.DATABASE_URL;

let destinationsRouter: Router;
let tripkitsRouter: Router;

vi.mock('postgres', () => ({
  __esModule: true,
  default: vi.fn(() => ({})),
}));

vi.mock('drizzle-orm/postgres-js', () => ({
  __esModule: true,
  drizzle: vi.fn(() => ({})),
}));

vi.mock('../../../shared/schema.ts', () => ({
  __esModule: true,
  destinations: {},
}));

vi.mock('../../../shared/mt-olympus-schema.ts', () => ({
  __esModule: true,
  trip_kits: {},
}));

vi.mock('drizzle-orm', () => ({
  __esModule: true,
  eq: vi.fn(() => ({})),
  ilike: vi.fn(() => ({})),
  or: vi.fn(() => ({})),
  desc: vi.fn(() => ({})),
  asc: vi.fn(() => ({})),
}));

const ensureDatabaseUrl = () => {
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = 'postgres://postgres:postgres@localhost:5432/test';
  }
};

const getRouteIndex = (router: Router, path: string, method: HttpMethod) => {
  const stack = (router as unknown as { stack: RouteLayer[] }).stack ?? [];

  return stack.findIndex(
    (layer) =>
      Boolean(layer.route) &&
      layer.route!.path === path &&
      Boolean(layer.route!.methods?.[method])
  );
};

beforeAll(async () => {
  ensureDatabaseUrl();

  destinationsRouter = (await import('../destinations.js')).default;
  tripkitsRouter = (await import('../tripkits.js')).default;
});

afterAll(() => {
  if (originalDatabaseUrl === undefined) {
    delete process.env.DATABASE_URL;
  } else {
    process.env.DATABASE_URL = originalDatabaseUrl;
  }
});

describe('route ordering regression checks', () => {
  it('keeps /api/destinations/category ahead of the /:id handler', () => {
    const categoryIndex = getRouteIndex(destinationsRouter, '/category/:category', 'get');
    const idIndex = getRouteIndex(destinationsRouter, '/:id', 'get');

    expect(categoryIndex).toBeGreaterThan(-1);
    expect(idIndex).toBeGreaterThan(-1);
    expect(categoryIndex).toBeLessThan(idIndex);
  });

  it('keeps /api/tripkits/featured/list ahead of the /:id handler', () => {
    const featuredIndex = getRouteIndex(tripkitsRouter, '/featured/list', 'get');
    const idIndex = getRouteIndex(tripkitsRouter, '/:id', 'get');

    expect(featuredIndex).toBeGreaterThan(-1);
    expect(idIndex).toBeGreaterThan(-1);
    expect(featuredIndex).toBeLessThan(idIndex);
  });
});
