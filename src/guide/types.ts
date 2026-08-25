export const SDK_LANGUAGES = ['node', 'go', 'both'] as const;
export type SdkLanguage = (typeof SDK_LANGUAGES)[number];

export const SDK_LANGUAGE_BY_VALUE: Record<string, SdkLanguage | undefined> = {
  node: 'node',
  go: 'go',
  both: 'both',
};

export const SDK_RUNTIMES = [
  'express',
  'fastify',
  'net/http',
  'gin',
  'auto',
] as const;
export type SdkRuntime = (typeof SDK_RUNTIMES)[number];

export const SDK_RUNTIME_BY_VALUE: Record<string, SdkRuntime | undefined> = {
  express: 'express',
  fastify: 'fastify',
  'net/http': 'net/http',
  gin: 'gin',
  auto: 'auto',
};

export const SDK_TOPICS = [
  'install',
  'middleware',
  'redact',
  'tags',
  'code_scan',
  'all',
] as const;
export type SdkTopic = (typeof SDK_TOPICS)[number];

export const SDK_TOPIC_BY_VALUE: Record<string, SdkTopic | undefined> = {
  install: 'install',
  middleware: 'middleware',
  redact: 'redact',
  tags: 'tags',
  code_scan: 'code_scan',
  all: 'all',
};

export const DEFAULT_SDK_LANGUAGE: SdkLanguage = 'both';
export const DEFAULT_SDK_RUNTIME: SdkRuntime = 'auto';
export const DEFAULT_SDK_TOPIC: SdkTopic = 'all';

export type SdkSetupGuideArgs = {
  language?: string | undefined;
  runtime?: string | undefined;
  topic?: string | undefined;
};

export type SdkSetupSelection = {
  language: SdkLanguage;
  runtime: SdkRuntime;
  topic: SdkTopic;
};

export function includesNode(language: SdkLanguage): boolean {
  return language === 'node' || language === 'both';
}

export function includesGo(language: SdkLanguage): boolean {
  return language === 'go' || language === 'both';
}
