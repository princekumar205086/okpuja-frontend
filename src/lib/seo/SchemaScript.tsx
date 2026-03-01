/**
 * OKPUJA - SchemaScript Component
 * Renders JSON-LD structured data in <script> tags
 * Use in any page/layout for rich Google results
 */

import React from 'react';

interface SchemaScriptProps {
  schemas: unknown | unknown[];
}

/**
 * Renders one or more JSON-LD schema objects as <script type="application/ld+json"> tags
 * 
 * Usage:
 * ```tsx
 * import { SchemaScript } from '@/lib/seo/SchemaScript';
 * import { buildGlobalSchemas } from '@/lib/seo';
 * 
 * export default function Layout({ children }) {
 *   return (
 *     <>
 *       <SchemaScript schemas={buildGlobalSchemas()} />
 *       {children}
 *     </>
 *   );
 * }
 * ```
 */
export function SchemaScript({ schemas }: SchemaScriptProps) {
  const schemaArray = Array.isArray(schemas) ? schemas : [schemas];

  return (
    <>
      {schemaArray.map((schema, index) => (
        <script
          key={`schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 0),
          }}
        />
      ))}
    </>
  );
}

export default SchemaScript;
