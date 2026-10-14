(() => {
  const labels = {claude:'Claude Code',pi:'pi',codex:'Codex',opencode:'OpenCode',grok:'Grok',cursor:'Cursor Agent CLI',omp:'omp',copilot:'Copilot CLI'};
  const picker = document.querySelector('#agent-choice');
  const panels = [...document.querySelectorAll('.host-panel')];
  let selected = '';
  try { selected = localStorage.getItem('docflow-agent') || ''; } catch (_) {}
  const hashHost = () => location.hash.startsWith('#host-') ? location.hash.slice(6) : '';
  if (labels[hashHost()]) selected = hashHost();
  if (!labels[selected]) selected = '';
  function update(value) {
    selected = labels[value] ? value : '';
    if (picker) picker.value = selected;
    panels.forEach(panel => { panel.hidden = panel.id !== 'host-' + selected; });
    document.querySelectorAll('.host-hint').forEach(el => { el.textContent = selected ? 'Examples now use ' + labels[selected] + '. Change this choice at any time.' : (panels.length ? 'Choose an agent to see its installation steps.' : 'Your choice sets the invocation form in the prompts below.'); });
    document.querySelectorAll('.prompt').forEach(el => {
      const skill = el.dataset.skill;
      const prefix = selected === 'codex' ? '$' : ['pi','omp'].includes(selected) ? '/skill:' : selected === 'claude' ? '/' : '';
      const invocation = el.querySelector('.invocation');
      invocation.replaceChildren();
      invocation.append(document.createTextNode(prefix ? '' : 'Use '));
      const code = document.createElement('code'); code.textContent = prefix + skill; invocation.append(code);
      if (selected && !prefix) invocation.append(document.createTextNode(' (select it in your host’s skill menu)'));
    });
    try { if (selected) localStorage.setItem('docflow-agent', selected); else localStorage.removeItem('docflow-agent'); } catch (_) {}
  }
  if (picker) {
    picker.closest('.host-picker').hidden = false;
    picker.addEventListener('change', () => {
      update(picker.value);
      if (panels.length && hashHost()) {
        history.replaceState(null, '', selected ? '#host-' + selected : '#install');
      }
    });
  }
  window.addEventListener('hashchange', () => { if (labels[hashHost()]) update(hashHost()); });
  document.querySelectorAll('.host-links a').forEach(a => a.addEventListener('click', () => update(a.hash.slice(6))));
  update(selected);
  window.addEventListener('pageshow', () => {
    let saved = selected;
    try { saved = localStorage.getItem('docflow-agent') || ''; } catch (_) {}
    update(labels[hashHost()] ? hashHost() : saved);
  });
  document.querySelectorAll('.section-sidebar a,.mobile-navigation a').forEach(a => { if (a.pathname === location.pathname && !a.hash) a.setAttribute('aria-current','page'); });
  document.querySelectorAll('.content table').forEach((table, i) => { if (table.scrollWidth > table.clientWidth) { table.tabIndex = 0; table.setAttribute('role','region'); table.setAttribute('aria-label','Scrollable reference table ' + (i + 1)); } });
})();
