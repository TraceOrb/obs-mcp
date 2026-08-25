import { z } from 'zod';

import { SDK_LANGUAGES, SDK_RUNTIMES, SDK_TOPICS } from '../guide/types';

export const SDK_SETUP_GUIDE_INPUT_SCHEMA = z.object({
  language: z.enum(SDK_LANGUAGES).optional(),
  runtime: z.enum(SDK_RUNTIMES).optional(),
  topic: z.enum(SDK_TOPICS).optional(),
});

export const SDK_SETUP_GUIDE_TOOL_NAME = 'sdk_setup_guide';

export const SDK_SETUP_GUIDE_DESCRIPTION =
  'Return a local Traceorb SDK setup guide and repository code-scan playbook. Does not call the Traceorb API or inspect source code.';
