import parseSdkSetupArgs from './parseArgs';
import codeScanSections from './snippets/codeScan';
import installSections from './snippets/install';
import middlewareSections from './snippets/middleware';
import redactSections from './snippets/redact';
import tagsSections from './snippets/tags';
import type {
  SdkSetupGuideArgs,
  SdkSetupSelection,
  SdkTopic,
} from './types';

const GUIDE_TITLE = '# Traceorb SDK setup guide';

type TopicBuilder = (selection: SdkSetupSelection) => string[];

const TOPIC_BUILDERS: Record<Exclude<SdkTopic, 'all'>, TopicBuilder> = {
  install: function buildInstall(selection) {
    return installSections(selection);
  },
  middleware: function buildMiddleware(selection) {
    return middlewareSections(selection);
  },
  redact: function buildRedact(selection) {
    return redactSections(selection);
  },
  tags: function buildTags(selection) {
    return tagsSections(selection);
  },
  code_scan: function buildCodeScan() {
    return codeScanSections();
  },
};

const TOPIC_ORDER: Array<Exclude<SdkTopic, 'all'>> = [
  'install',
  'middleware',
  'redact',
  'tags',
  'code_scan',
];

export default function buildSdkSetupGuide(args: SdkSetupGuideArgs): string {
  const selection = parseSdkSetupArgs(args);
  const sections = [GUIDE_TITLE];

  if (selection.topic === 'all') {
    for (const topic of TOPIC_ORDER) {
      sections.push(...TOPIC_BUILDERS[topic](selection));
    }

    return `${sections.join('\n\n')}\n`;
  }

  sections.push(...TOPIC_BUILDERS[selection.topic](selection));
  return `${sections.join('\n\n')}\n`;
}
