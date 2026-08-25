import { describe, expect, test } from 'vitest';

import { TOOL_SCHEMAS } from '../src/toolSchemas';

describe('TOOL_SCHEMAS', () => {
  test('list_requests includes range and match but not groupBy', () => {
    const keys = Object.keys(TOOL_SCHEMAS.list_requests.shape);

    expect(keys).toContain('range');
    expect(keys).toContain('match');
    expect(keys).not.toContain('groupBy');
  });

  test('get_firing_count has no list filters', () => {
    expect(Object.keys(TOOL_SCHEMAS.get_firing_count.shape)).toEqual([]);
  });

  test('uses only the parameters supported by each endpoint', () => {
    expect(
      Object.fromEntries(
        Object.entries(TOOL_SCHEMAS).map(function schemaKeys([name, schema]) {
          return [name, Object.keys(schema.shape)];
        }),
      ),
    ).toEqual({
      query_metrics: [
        'range',
        'method',
        'pathContains',
        'statusCode',
        'statusCodeMin',
        'statusCodeMax',
        'durationMin',
        'durationMax',
        'service',
        'env',
        'routePattern',
        'hasError',
        'search',
        'tag',
      ],
      query_daily_metrics: [
        'range',
        'method',
        'service',
        'env',
        'routePattern',
        'statusFamily',
      ],
      list_requests: [
        'page',
        'size',
        'sort',
        'order',
        'method',
        'routePattern',
        'pathContains',
        'statusCode',
        'statusCodeMin',
        'statusCodeMax',
        'durationMin',
        'durationMax',
        'service',
        'env',
        'requestId',
        'range',
        'dateFrom',
        'dateTo',
        'hasError',
        'search',
        'tag',
        'match',
      ],
      get_request: ['requestId'],
      compare_request: ['requestId', 'baseline'],
      search_facets: ['q'],
      list_alert_rules: [],
      list_alert_incidents: ['status', 'page', 'size'],
      get_alert_incident: ['incidentId'],
      get_firing_count: [],
      suggest_redact_keys: ['range'],
    });
  });
});
