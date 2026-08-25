import {
  DEFAULT_SDK_LANGUAGE,
  DEFAULT_SDK_RUNTIME,
  DEFAULT_SDK_TOPIC,
  SDK_LANGUAGE_BY_VALUE,
  SDK_RUNTIME_BY_VALUE,
  SDK_TOPIC_BY_VALUE,
  type SdkLanguage,
  type SdkRuntime,
  type SdkSetupGuideArgs,
  type SdkSetupSelection,
  type SdkTopic,
} from './types';

export default function parseSdkSetupArgs(
  args: SdkSetupGuideArgs,
): SdkSetupSelection {
  return {
    language: resolveLanguage(args.language),
    runtime: resolveRuntime(args.runtime),
    topic: resolveTopic(args.topic),
  };
}

function resolveLanguage(value: string | undefined): SdkLanguage {
  if (value === undefined) {
    return DEFAULT_SDK_LANGUAGE;
  }

  const matched = SDK_LANGUAGE_BY_VALUE[value];
  if (matched === undefined) {
    return DEFAULT_SDK_LANGUAGE;
  }

  return matched;
}

function resolveRuntime(value: string | undefined): SdkRuntime {
  if (value === undefined) {
    return DEFAULT_SDK_RUNTIME;
  }

  const matched = SDK_RUNTIME_BY_VALUE[value];
  if (matched === undefined) {
    return DEFAULT_SDK_RUNTIME;
  }

  return matched;
}

function resolveTopic(value: string | undefined): SdkTopic {
  if (value === undefined) {
    return DEFAULT_SDK_TOPIC;
  }

  const matched = SDK_TOPIC_BY_VALUE[value];
  if (matched === undefined) {
    return DEFAULT_SDK_TOPIC;
  }

  return matched;
}
