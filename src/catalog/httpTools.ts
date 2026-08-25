import { TOOL_PAYLOAD_WARNING } from '../constants';
import type { TraceorbHttpToolName } from './toolNames';

export type TraceorbHttpTool = {
  name: TraceorbHttpToolName;
  pathTemplate: string;
  description: string;
};

export const TRACEORB_HTTP_TOOLS: TraceorbHttpTool[] = [
  {
    name: 'query_metrics',
    pathTemplate: '/v1/metrics',
    description: 'Query aggregate request metrics.',
  },
  {
    name: 'query_daily_metrics',
    pathTemplate: '/v1/metrics/daily',
    description: 'Query daily request metrics.',
  },
  {
    name: 'list_requests',
    pathTemplate: '/v1/requests',
    description: 'List and filter observed requests.',
  },
  {
    name: 'get_request',
    pathTemplate: '/v1/requests/{requestId}',
    description: 'Get one observed request.',
  },
  {
    name: 'compare_request',
    pathTemplate: '/v1/requests/{requestId}/compare',
    description: 'Compare an observed request with a baseline.',
  },
  {
    name: 'search_facets',
    pathTemplate: '/v1/facets',
    description: 'Search available filter facets.',
  },
  {
    name: 'list_alert_rules',
    pathTemplate: '/v1/alerts/rules',
    description: 'List alert rules.',
  },
  {
    name: 'list_alert_incidents',
    pathTemplate: '/v1/alerts/incidents',
    description: 'List alert incidents.',
  },
  {
    name: 'get_alert_incident',
    pathTemplate: '/v1/alerts/incidents/{incidentId}',
    description: 'Get one alert incident.',
  },
  {
    name: 'get_firing_count',
    pathTemplate: '/v1/alerts/firing-count',
    description: 'Count firing alert incidents.',
  },
  {
    name: 'suggest_redact_keys',
    pathTemplate: '/v1/redact/candidates',
    description: 'Suggest observed keys that may need redaction.',
  },
];

export function httpToolDescription(tool: TraceorbHttpTool): string {
  return `${tool.description} ${TOOL_PAYLOAD_WARNING} GET ${tool.pathTemplate}.`;
}
