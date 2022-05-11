export function isValidAuthRequest(req) {
  if (!req.query) {
    return false;
  }

  const { state, client_id, response_type, redirect_uri } = req.query;
  return !!(
    typeof state === 'string' &&
    state &&
    typeof client_id === 'string' &&
    client_id &&
    typeof response_type === 'string' &&
    response_type === 'code' && // Only allow code response type currently
    typeof redirect_uri === 'string' &&
    redirect_uri
  );
}
