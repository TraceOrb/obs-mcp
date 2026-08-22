import { describe, expect, test } from 'vitest';

import { TRACEORB_TOOLS } from '../src/tools';

describe('TRACEORB_TOOLS', () => {
  test('exposes the ten query tools', () => {
    expect(
      TRACEORB_TOOLS.map(function nameOf(tool) {
        return tool.name;
      }),
    ).toEqual([
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
    ]);
  });

  test('names do not include sql ingest or webhook', () => {
    for (const tool of TRACEORB_TOOLS) {
      expect(tool.name.includes('sql')).toBe(false);
      expect(tool.name.includes('ingest')).toBe(false);
      expect(tool.name.includes('webhook')).toBe(false);
    }
  });
});
