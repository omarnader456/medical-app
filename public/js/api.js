export async function apiFetch(path, options = {}) {
  options.credentials = 'include';
  options.headers = options.headers || {};
  if (!options.headers['Content-Type']) {
    options.headers['Content-Type'] = 'application/json';
  }

  const token = document.querySelector('meta[name="csrf-token"]')?.content;
  if (token) options.headers['CSRF-Token'] = token;
  const res = await fetch(path, options);
  const json = await res.json().catch(()=>null);
  if (!res.ok) throw json || { message: 'Network error' };
  return json;
}
