(() => {
  if (typeof document === 'undefined') return;

  const $ = id => document.getElementById(id);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function formatSkill(skill) {
    const ja = window.DD_JA_LABELS?.skills?.[skill];
    return ja ? `${skill}（${ja}）` : skill;
  }

  function syncHumanSkillOptions() {
    const species = $('species');
    const background = $('background');
    const select = $('humanSkill');
    const SRD = window.DD_SRD_CHARACTER;
    if (!species || !background || !select || !SRD) return;
    if (species.value !== 'Human') return;

    const unavailable = new Set(SRD.backgrounds?.[background.value]?.skills || []);
    const allowed = (SRD.allSkills || []).filter(skill => !unavailable.has(skill));
    const previous = select.value;

    select.innerHTML = allowed
      .map(skill => `<option value="${esc(skill)}">${esc(formatSkill(skill))}</option>`)
      .join('');

    select.value = allowed.includes(previous) ? previous : (allowed[0] || '');
    select.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function init() {
    $('background')?.addEventListener('change', () => setTimeout(syncHumanSkillOptions, 0));
    $('species')?.addEventListener('change', () => setTimeout(syncHumanSkillOptions, 0));
    setTimeout(syncHumanSkillOptions, 0);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
