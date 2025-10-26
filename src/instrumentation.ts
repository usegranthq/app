import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { NodeTracerProvider, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-node';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';

import env from './env';

export function register() {
  const provider = new NodeTracerProvider({
    resource: resourceFromAttributes(
      {
        [ATTR_SERVICE_NAME]: 'usegrant-app',
      },
      {
        // Use the latest schema version
        // Info: https://opentelemetry.io/docs/specs/semconv/
        schemaUrl: 'https://opentelemetry.io/schemas/1.37.0',
      },
    ),
    spanProcessors: [
      new SimpleSpanProcessor(
        new OTLPTraceExporter({
          url: `https://api.axiom.co/v1/traces`,
          headers: {
            Authorization: `Bearer ${env.AXIOM_API_TOKEN}`,
            'X-Axiom-Dataset': env.AXIOM_OTEL_DATASET,
          },
        }),
      ),
    ],
  });

  provider.register();
}
