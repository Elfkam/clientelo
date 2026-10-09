// Inactive example for a future form endpoint. This function is not called.
/*
export async function sendLeadEmailViaAjax(email: string, endpoint: string): Promise<void> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
}
*/
