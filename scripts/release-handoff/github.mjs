import { check, hex, REPOSITORY } from './contract.mjs';

const root = `https://api.github.com/repos/${REPOSITORY}`;
const positiveId = id => { check(Number.isSafeInteger(id) && id > 0, 'invalid GitHub object ID'); return id; };

export class GitHub {
  constructor({ token = '', fetchImpl = fetch } = {}) { this.token = token; this.fetch = fetchImpl; }

  async request(path, { method = 'GET', body, binary = false, upload = false, missing = false } = {}) {
    const url = upload ? `https://uploads.github.com/repos/${REPOSITORY}${path}` : `${root}${path}`;
    const headers = { Accept: binary ? 'application/octet-stream' : 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2026-03-10', 'User-Agent': 'docflow-clarity-release' };
    if (this.token) headers.Authorization = `Bearer ${this.token}`;
    if (body) headers['Content-Type'] = Buffer.isBuffer(body) ? 'application/octet-stream' : 'application/json';
    let response;
    try {
      response = await this.fetch(url, { method, headers, body: Buffer.isBuffer(body) ? body : body ? JSON.stringify(body) : undefined,
        redirect: 'manual', signal: AbortSignal.timeout(120000) });
      // Asset downloads can redirect to GitHub's unauthenticated asset storage.
      // Never forward credentials or accept a redirect for a write/JSON request.
      for (let redirects = 0; binary && method === 'GET' && [301, 302, 303, 307, 308].includes(response.status); redirects++) {
        check(redirects < 3, 'too many asset redirects');
        const location = new URL(response.headers.get('location'));
        check(location.protocol === 'https:' && !location.username && !location.password
          && (['release-assets.githubusercontent.com', 'objects.githubusercontent.com', 'github.com'].includes(location.hostname)
            || location.hostname.endsWith('.blob.core.windows.net')), 'unsafe asset redirect');
        response = await this.fetch(location.href, { headers: { Accept: 'application/octet-stream' },
          redirect: 'manual', signal: AbortSignal.timeout(120000) });
      }
    } catch { throw new Error('GitHub request failed; network or redirect unavailable; remote state may be unknown'); }
    if (response.status === 404 && missing) return null;
    check(response.ok, `GitHub request failed (HTTP ${response.status}); inspect authentication, permissions or remote state`);
    return binary ? Buffer.from(await response.arrayBuffer()) : response.json();
  }

  async pages(path) {
    const all = [];
    for (let page = 1; page <= 10000; page++) {
      const rows = await this.request(`${path}?per_page=100&page=${page}`);
      check(Array.isArray(rows), 'invalid GitHub list response'); all.push(...rows);
      if (rows.length < 100) return all;
    }
    throw new Error('GitHub pagination limit reached; state unverified');
  }
  async checkRepository() {
    const repo = await this.request('');
    check(repo.full_name === REPOSITORY && repo.private === false, 'wrong or non-public repository');
  }
  async checkCommit(sha) { hex(sha, 40); check((await this.request(`/commits/${sha}`)).sha === sha, 'public target commit unavailable'); }
  listReleases() { return this.pages('/releases'); }
  listAssets(id) { return this.pages(`/releases/${positiveId(id)}/assets`); }
  downloadAsset(id) { return this.request(`/releases/assets/${positiveId(id)}`, { binary: true }); }
  async tagCommit(tag) {
    let ref = await this.request(`/git/ref/tags/${encodeURIComponent(tag)}`, { missing: true });
    if (!ref) return null;
    let object = ref.object;
    for (let i = 0; object?.type === 'tag' && i < 8; i++) {
      hex(object.sha, 40); object = (await this.request(`/git/tags/${object.sha}`)).object;
    }
    check(object?.type === 'commit', 'unsupported tag target'); hex(object.sha, 40); return object.sha;
  }
  createDraft(body) { return this.request('/releases', { method: 'POST', body }); }
  uploadAsset(id, name, bytes) { return this.request(`/releases/${positiveId(id)}/assets?name=${encodeURIComponent(name)}`, { method: 'POST', body: bytes, upload: true }); }
  publishDraft(id) { return this.request(`/releases/${positiveId(id)}`, { method: 'PATCH', body: { draft: false, make_latest: 'false' } }); }
  async checkApprovalEnvironment({ runId, actors, comment } = {}) {
    const env = await this.request('/environments/clarity-publication');
    check(env.protection_rules?.some(r => r.type === 'required_reviewers' && r.prevent_self_review === true && r.reviewers?.length > 0), 'publication environment requires independent reviewers and prevention of self-review');
    check(/^[1-9]\d*$/.test(runId) && actors?.length && actors.every(a => typeof a === 'string' && a.length > 0)
      && typeof comment === 'string', 'publication environment review context missing');
    const history = await this.request(`/actions/runs/${runId}/approvals`);
    check(Array.isArray(history), 'publication environment review history unavailable');
    const reviews = history.filter(r => r.environments?.some(e => e.id === env.id && e.name === 'clarity-publication'));
    check(!reviews.some(r => r.state !== 'approved') && reviews.some(r => r.state === 'approved'
      && r.comment === comment && r.user?.type === 'User' && r.user.login
      && !actors.map(a => a.toLowerCase()).includes(r.user.login.toLowerCase())),
    'publication environment lacks an independent approval bound to this payload; bypass is not approval');
  }
}
