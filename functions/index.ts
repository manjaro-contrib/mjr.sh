export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url);

  return Response.json({
    add: `${url.origin}/add?url=https://example.com`,
    edit: `${url.origin}/edit/SECRET?url=https://example.com`,
  });
};
