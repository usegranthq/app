import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { WinstonInstrumentation } from '@opentelemetry/instrumentation-winston';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';

import env from './env';

const resource = resourceFromAttributes(
  {
    [ATTR_SERVICE_NAME]: 'usegrant-app',
  },
  {
    // Use the latest schema version
    // Info: https://opentelemetry.io/docs/specs/semconv/
    schemaUrl: 'https://opentelemetry.io/schemas/1.37.0',
  },
);

const traceExporter = new OTLPTraceExporter({
  url: `https://${env.OTEL_DOMAIN}/v1/traces`,
  headers: {
    Authorization: `Bearer ${env.OTEL_API_TOKEN}`,
    'X-Axiom-Dataset': env.OTEL_AXIOM_DATASET,
  },
});

const logExporter = new OTLPLogExporter({
  url: `https:/${env.OTEL_DOMAIN}/v1/logs`,
  headers: {
    Authorization: `Bearer ${env.OTEL_API_TOKEN}`,
    'X-Axiom-Dataset': env.OTEL_AXIOM_DATASET,
  },
});

if (process.env.ENABLE_OTEL_LOGS === 'true') {
  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);
}

const sdk = new NodeSDK({
  // Registering the resource to the SDK
  resource: resource,

  // batch and send traces
  spanProcessors: [
    new BatchSpanProcessor({ exporter: traceExporter }),
    // print logs to console
    // new SimpleSpanProcessor({ exporter: new ConsoleSpanExporter() }), // for dev
  ],

  // send logs
  logRecordProcessors: [new BatchLogRecordProcessor({ exporter: logExporter })],

  // instrumentations to patch pino
  instrumentations: [
    new WinstonInstrumentation({
      enabled: true,
    }),
  ],
});

export function register() {
  sdk.start();

  if (process.env.NEXT_RUNTIME === 'nodejs') {
    process.on('SIGTERM', () =>
      sdk
        .shutdown()
        .then(
          () => console.log('OTEL SDK shut down successfully'),
          (err) => console.log('Error shutting down OTEL SDK', err),
        )
        .finally(() => process.exit(0)),
    );
  }
}
