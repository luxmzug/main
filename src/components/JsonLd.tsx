/**
 * Renders a JSON-LD script tag for structured data.
 */
export const JsonLd = (props: { data: unknown }) => {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(props.data).replace(/</g, '\\u003c'),
      }}
      type="application/ld+json"
    />
  );
};
