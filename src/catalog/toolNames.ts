export const HTTP_TOOL_NAMES = [
  'query_metrics',
  'query_daily_metrics',
  'list_requests',
  'get_request',
  'compare_request',
  'search_facets',
  'list_alert_rules',
  'list_alert_incidents',
  'get_alert_incident',
  'get_firing_count',
  'suggest_redact_keys',
] as const;

export type TraceorbHttpToolName = (typeof HTTP_TOOL_NAMES)[number];
