import { describe, expect, test } from 'vitest';

import { TRACEORB_HTTP_TOOLS } from '../src/catalog/httpTools';

describe('TRACEORB_HTTP_TOOLS', () => {
  test('exposes query and redact suggestion tools', () => {
    expect(
      TRACEORB_HTTP_TOOLS.map(function nameOf(tool) {
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
      'suggest_redact_keys',
    ]);
  });

  test('maps redact suggestions to the candidates endpoint', () => {
    expect(
      TRACEORB_HTTP_TOOLS.find(function isSuggestRedactKeys(tool) {
        return tool.name === 'suggest_redact_keys';
      }),
    ).toMatchObject({
      pathTemplate: '/v1/redact/candidates',
    });
  });

  test('names do not include sql ingest or webhook', () => {
    for (const tool of TRACEORB_HTTP_TOOLS) {
      expect(tool.name.includes('sql')).toBe(false);
      expect(tool.name.includes('ingest')).toBe(false);
      expect(tool.name.includes('webhook')).toBe(false);
    }
  });
});
