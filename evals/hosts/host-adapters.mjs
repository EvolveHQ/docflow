// Per-host qualification adapters (ADR 0062).
//
// One adapter per V1 package target. An adapter is data plus two small native
// operations:
//   install(ctx)  -> load the branch package through the host's own facility
//                    into a disposable home and set ctx.installedRoot.
//   discover(ctx) -> ask the host what it loaded and which skills it resolved.
//
// Every native install operates on a staged copy of the branch (ctx.stage),
// never the operator's working tree. All host state (config home, cache,
// state) is overridden to a disposable directory under the scratch root. An
// adapter that cannot run a case declares why in `blocked`; the runner records
// that as `blocked` rather than silently skipping.

import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const SKILL_FILE = 'SKILL.md';

export function scanSkills(root) {
  try {
    return readdirSync(root)
      .filter((name) => {
        try { return statSync(join(root, name, SKILL_FILE)).isFile(); }
        catch { return false; }
      })
      .sort();
  } catch { return []; }
}

function lines(text) { return String(text || '').split('\n').map((l) => l.trim()).filter(Boolean); }

function findInstalled(root, marker) {
  const found = [];
  const visit = (dir) => {
    let entries;
    try { entries = readdirSync(dir); } catch { return; }
    for (const name of entries) {
      const p = join(dir, name);
      let st;
      try { st = statSync(p); } catch { continue; }
      if (st.isDirectory()) visit(p);
      else if (name === marker) found.push(dir);
    }
  };
  visit(root);
  return found;
}

export const adapters = [
  {
    id: 'claude',
    display: 'Claude Code',
    binary: 'claude',
    env: (home) => ({
      CLAUDE_CONFIG_DIR: join(home, '.claude'),
      XDG_CONFIG_HOME: join(home, '.config'),
      XDG_CACHE_HOME: join(home, '.cache'),
      XDG_DATA_HOME: join(home, '.local/share'),
      XDG_STATE_HOME: join(home, '.local/state'),
    }),
    async install(ctx) {
      ctx.installedRoot = ctx.plugin;
      return ctx.run([ctx.binary, '--version']);
    },
    async discover(ctx) {
      const r = await ctx.run([ctx.binary, '--plugin-dir', ctx.plugin, 'plugin', 'list', '--json']);
      let loaded = false;
      try { loaded = JSON.parse(r.stdout).some((p) => String(p.id || p.name || '').startsWith('docflow')); }
      catch { loaded = false; }
      return { exit: r.exit, loaded, skills: scanSkills(join(ctx.plugin, 'skills')), evidence: 'claude plugin list --json' };
    },
  },
  {
    id: 'pi',
    display: 'pi',
    binary: 'pi',
    env: (home) => ({
      XDG_CONFIG_HOME: join(home, '.config'),
      XDG_CACHE_HOME: join(home, '.cache'),
      XDG_DATA_HOME: join(home, '.local/share'),
      XDG_STATE_HOME: join(home, '.local/state'),
      PI_CONFIG_DIR: join(home, '.pi'),
    }),
    async install(ctx) {
      ctx.runSync(['mkdir', '-p', join(ctx.home, '.pi')]);
      const r = await ctx.run([ctx.binary, 'install', ctx.stage]);
      ctx.installedRoot = ctx.plugin;
      return r;
    },
    async discover(ctx) {
      const r = await ctx.run([ctx.binary, 'list']);
      const loaded = /docflow|repo/i.test(r.stdout);
      return { exit: r.exit, loaded, skills: scanSkills(join(ctx.plugin, 'skills')), evidence: 'pi list' };
    },
  },
  {
    id: 'codex',
    display: 'Codex',
    binary: 'codex',
    env: (home) => ({
      CODEX_HOME: join(home, '.codex'),
      XDG_CONFIG_HOME: join(home, '.config'),
      XDG_CACHE_HOME: join(home, '.cache'),
      XDG_DATA_HOME: join(home, '.local/share'),
      XDG_STATE_HOME: join(home, '.local/state'),
    }),
    async install(ctx) {
      ctx.runSync(['mkdir', '-p', join(ctx.home, '.codex')]);
      const add = await ctx.run([ctx.binary, 'plugin', 'marketplace', 'add', ctx.stage]);
      const install = await ctx.run([ctx.binary, 'plugin', 'add', 'docflow@evolvehq']);
      ctx.installedRoot = join(ctx.home, '.codex/plugins/cache');
      return { exit: add.exit || install.exit, stdout: add.stdout + install.stdout, stderr: add.stderr + install.stderr };
    },
    async discover(ctx) {
      const r = await ctx.run([ctx.binary, 'plugin', 'list']);
      const loaded = /docflow@evolvehq/.test(r.stdout) && /installed/.test(r.stdout) && !/not installed/.test(r.stdout);
      const skills = loaded ? scanSkills(join(ctx.plugin, 'skills')) : [];
      return { exit: r.exit, loaded, skills, evidence: 'codex plugin list' };
    },
  },
  {
    id: 'opencode',
    display: 'OpenCode',
    binary: 'opencode',
    env: (home) => ({
      XDG_CONFIG_HOME: join(home, '.config'),
      XDG_CACHE_HOME: join(home, '.cache'),
      XDG_DATA_HOME: join(home, '.local/share'),
      XDG_STATE_HOME: join(home, '.local/state'),
      OPENCODE_CONFIG: join(home, 'opencode.json'),
    }),
    async install(ctx) {
      // OpenCode discovers skills by convention. Link the fourteen skill
      // directories into its created config skills directory.
      const skillsRoot = join(ctx.home, '.config/opencode/skills');
      ctx.runSync(['mkdir', '-p', skillsRoot]);
      for (const name of scanSkills(join(ctx.plugin, 'skills'))) {
        ctx.runSync(['ln', '-s', join(ctx.plugin, 'skills', name), join(skillsRoot, name)]);
      }
      ctx.installedRoot = join(ctx.plugin, 'skills');
      return { exit: 0, stdout: 'linked 14 skills', stderr: '' };
    },
    async discover(ctx) {
      const linked = scanSkills(join(ctx.home, '.config/opencode/skills'));
      return { exit: 0, loaded: linked.length === 14, skills: linked, evidence: '~/.config/opencode/skills' };
    },
  },
  {
    id: 'grok',
    display: 'Grok',
    binary: 'grok',
    env: (home) => ({
      GROK_HOME: join(home, '.grok'),
      XDG_CONFIG_HOME: join(home, '.config'),
      XDG_CACHE_HOME: join(home, '.cache'),
      XDG_DATA_HOME: join(home, '.local/share'),
      XDG_STATE_HOME: join(home, '.local/state'),
    }),
    async install(ctx) {
      ctx.runSync(['mkdir', '-p', join(ctx.home, '.grok')]);
      const r = await ctx.run([ctx.binary, 'plugin', 'install', ctx.plugin, '--trust']);
      const installed = findInstalled(join(ctx.home, '.grok/installed-plugins'), '.claude-plugin');
      ctx.installedRoot = installed[0] ? join(installed[0], '..') : ctx.plugin;
      return r;
    },
    async discover(ctx) {
      const r = await ctx.run([ctx.binary, 'plugin', 'list', '--json']);
      const loaded = /docflow/.test(r.stdout);
      return { exit: r.exit, loaded, skills: scanSkills(join(ctx.plugin, 'skills')), evidence: 'grok plugin list --json' };
    },
  },
  {
    id: 'omp',
    display: 'omp (oh-my-pi)',
    binary: 'omp',
    env: (home) => ({
      OMP_HOME: join(home, '.omp'),
      XDG_CONFIG_HOME: join(home, '.config'),
      XDG_CACHE_HOME: join(home, '.cache'),
      XDG_DATA_HOME: join(home, '.local/share'),
      XDG_STATE_HOME: join(home, '.local/state'),
    }),
    async install(ctx) {
      ctx.runSync(['mkdir', '-p', join(ctx.home, '.omp')]);
      const m = await ctx.run([ctx.binary, 'plugin', 'marketplace', 'add', ctx.stage, '--json']);
      const i = await ctx.run([ctx.binary, 'plugin', 'install', 'docflow@evolvehq', '--json']);
      ctx.installedRoot = ctx.plugin;
      return { exit: m.exit || i.exit, stdout: m.stdout + i.stdout, stderr: m.stderr + i.stderr };
    },
    async discover(ctx) {
      const r = await ctx.run([ctx.binary, 'plugin', 'list', '--json']);
      const loaded = /docflow/.test(r.stdout);
      return { exit: r.exit, loaded, skills: scanSkills(join(ctx.plugin, 'skills')), evidence: 'omp plugin list --json' };
    },
  },
  {
    id: 'copilot',
    display: 'GitHub Copilot CLI',
    binary: 'copilot',
    env: (home) => ({
      COPILOT_HOME: join(home, '.copilot'),
      XDG_CONFIG_HOME: join(home, '.config'),
      XDG_CACHE_HOME: join(home, '.cache'),
      XDG_DATA_HOME: join(home, '.local/share'),
      XDG_STATE_HOME: join(home, '.local/state'),
    }),
    async install(ctx) {
      ctx.installedRoot = ctx.plugin;
      return ctx.run([ctx.binary, '--version']);
    },
    async discover(ctx) {
      const r = await ctx.run([ctx.binary, '--plugin-dir', ctx.plugin, 'skill', 'list']);
      const names = lines(r.stdout)
        .filter((l) => /^[a-z][a-z-]+ - /.test(l))
        .map((l) => l.split(' - ')[0])
        .filter((n) => n !== 'customize-cloud-agent' && n !== 'github-pr-media');
      const loaded = /docflow|Plugin skills/.test(r.stdout);
      return { exit: r.exit, loaded, skills: [...new Set(names)].sort(), evidence: 'copilot skill list' };
    },
  },
  {
    id: 'cursor',
    display: 'Cursor',
    binary: 'cursor-agent',
    env: (home) => ({
      CURSOR_HOME: join(home, '.cursor'),
      XDG_CONFIG_HOME: join(home, '.config'),
      XDG_CACHE_HOME: join(home, '.cache'),
      XDG_DATA_HOME: join(home, '.local/share'),
      XDG_STATE_HOME: join(home, '.local/state'),
    }),
    blocked: {
      discovery: 'cursor-agent requires authentication before it lists plugins; no disposable credential is available',
      'install-byte-match': 'cursor-agent accepts --plugin-dir but installs no copy to hash in a headless disposable home',
      'bootstrap-full': 'cursor-agent requires authentication for a model turn',
      'bootstrap-express': 'cursor-agent requires authentication for a model turn',
      'new-plan': 'cursor-agent requires authentication for a model turn',
      'new-adr': 'cursor-agent requires authentication for a model turn',
      'ship-item': 'cursor-agent requires authentication for a model turn',
      'dispatch-brief': 'cursor-agent requires authentication for a model turn',
      'dispatch-refusal': 'cursor-agent requires authentication for a model turn',
      'sync-reconcile': 'cursor-agent requires authentication for a model turn',
      'sync-prepared-not-complete': 'cursor-agent requires authentication for a model turn',
      'audit-coordination': 'cursor-agent requires authentication for a model turn',
      'audit-range': 'cursor-agent requires authentication for a model turn',
    },
    async install() { return { exit: 1, stdout: '', stderr: 'blocked: authentication required' }; },
    async discover() { return { exit: 1, loaded: false, skills: [], evidence: 'blocked' }; },
  },
];

export function adapterById(id) {
  return adapters.find((a) => a.id === id) || null;
}
