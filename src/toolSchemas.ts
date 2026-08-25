import { z } from 'zod';

import type { TraceorbToolName } from './tools';

const optionalString = z.string().optional();

export const TOOL_SCHEMAS = {
  query_metrics: z.object({
    range: optionalString,
    method: optionalString,
    pathContains: optionalString,
    statusCode: optionalString,
    statusCodeMin: optionalString,
    statusCodeMax: optionalString,
    durationMin: optionalString,
    durationMax: optionalString,
    service: optionalString,
    env: optionalString,
    routePattern: optionalString,
    hasError: optionalString,
    search: optionalString,
    tag: optionalString,
  }),
  query_daily_metrics: z.object({
    range: optionalString,
    method: optionalString,
    service: optionalString,
    env: optionalString,
    routePattern: optionalString,
    statusFamily: optionalString,
  }),
  list_requests: z.object({
    page: optionalString,
    size: optionalString,
    sort: optionalString,
    order: optionalString,
    method: optionalString,
    routePattern: optionalString,
    pathContains: optionalString,
    statusCode: optionalString,
    statusCodeMin: optionalString,
    statusCodeMax: optionalString,
    durationMin: optionalString,
    durationMax: optionalString,
    service: optionalString,
    env: optionalString,
    requestId: optionalString,
    range: optionalString,
    dateFrom: optionalString,
    dateTo: optionalString,
    hasError: optionalString,
    search: optionalString,
    tag: optionalString,
    match: optionalString,
  }),
  get_request: z.object({
    requestId: z.string(),
  }),
  compare_request: z.object({
    requestId: z.string(),
    baseline: optionalString,
  }),
  search_facets: z.object({
    q: optionalString,
  }),
  list_alert_rules: z.object({}),
  list_alert_incidents: z.object({
    status: optionalString,
    page: optionalString,
    size: optionalString,
  }),
  get_alert_incident: z.object({
    incidentId: z.string(),
  }),
  get_firing_count: z.object({}),
  suggest_redact_keys: z.object({
    range: optionalString,
  }),
} satisfies Record<TraceorbToolName, z.ZodObject<z.ZodRawShape>>;
