import { signal } from '@preact/signals';
import { Dialog } from '../Shared/Dialog';
import { Button } from '../Shared/Button';
import { store } from '../../data/store';
import { canPlayerGetGov } from '../../data/government';
import { sendPlayerChangeGovernment, sendReportReq } from '../../net/commands';
import { clientIsObserver, clientPlaying } from '../../client/clientState';
import { isSmallScreen } from '../../utils/helpers';
import { getTilesetFileExtension } from '../../utils/helpers';
import { setHtml } from '../../utils/dom';

export const REPORT_WONDERS_OF_THE_WORLD = 0;
export const REPORT_WONDERS_OF_THE_WORLD_LONG = 1;
export const REPORT_TOP_CITIES = 2;
export const REPORT_DEMOGRAPHIC = 3;
export const REPORT_ACHIEVEMENTS = 4;

interface GovDialogState {
  open: boolean;
  selectedGovId: number;
}

const state = signal<GovDialogState>({
  open: false,
  selectedGovId: -1,
});

export function openRevolutionDialog(): void {
  if (clientPlaying() == null) return;
  state.value = { open: true, selectedGovId: -1 };
}

function closeDialog(): void {
  state.value = { ...state.value, open: false };
}

function selectGov(govId: number): void {
  state.value = { ...state.value, selectedGovId: govId };
}

function startRevolution(): void {
  const { selectedGovId } = state.value;
  if (selectedGovId !== -1) {
    sendPlayerChangeGovernment(selectedGovId);
  }
  closeDialog();
}

export function set_req_government(gov_id: number): void {
  selectGov(gov_id);
}

export function request_report(rtype: number): void {
  sendReportReq(rtype);
}

export function init_civ_dialog(): void {
  if (!clientIsObserver() && clientPlaying() != null) {
    const pplayer = clientPlaying()!;
    const pnation = store.nations[pplayer['nation']];
    const tag = pnation['graphic_str'];

    let civ_description = '';
    if (!pnation['customized']) {
      civ_description += `<img src='/images/flags/${tag}-web${getTilesetFileExtension()}' width='180'>`;
    }
    civ_description += `<br><div>${pplayer['name']} rules the ${store.nations[pplayer['nation']]['adjective']} with the form of government: ${store.governments[clientPlaying()!['government']!]['name']}</div><br>`;

    const nationTitleEl = document.getElementById('nation_title');
    if (nationTitleEl) nationTitleEl.textContent = 'The ' + store.nations[pplayer['nation']]['adjective'] + ' nation';
    const civTextEl = document.getElementById('civ_dialog_text');
    // Intentional: civ_description contains trusted HTML (flag img, player info)
    if (civTextEl) setHtml(civTextEl, civ_description);
  } else {
    const civTextEl = document.getElementById('civ_dialog_text');
    if (civTextEl) civTextEl.textContent = "This dialog isn't available as observer.";
  }
}

export function GovernmentDialog() {
  const { open, selectedGovId } = state.value;

  if (clientIsObserver()) return null;
  const player = clientPlaying();
  if (!player) return null;

  const currentGovName = store.governments?.[player['government']!]?.name ?? '';

  const govEntries: { id: number; name: string; helptext: string; canGet: boolean; isCurrent: boolean }[] = [];
  for (const govId in store.governments) {
    const govt = store.governments?.[govId as any];
    if (!govt) continue;
    govEntries.push({
      id: govt['id'],
      name: govt['name'],
      helptext: String(govt['helptext'] || ''),
      canGet: canPlayerGetGov(Number(govId)),
      isCurrent: player['government'] === Number(govId),
    });
  }

  return (
    <Dialog
      title="Revolution"
      open={open}
      onClose={closeDialog}
      width={isSmallScreen() ? '95%' : 450}
      modal={false}
    >
      <p style={{ marginBottom: '8px' }}>
        Current form of government: {currentGovName}
      </p>
      <p style={{ marginBottom: '12px' }}>
        To start a revolution, select the new form of government:
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
        {govEntries.map((g) => (
          <Button
            key={g.id}
            disabled={!g.canGet}
            variant={selectedGovId === g.id ? 'primary' : g.isCurrent ? 'secondary' : 'secondary'}
            onClick={() => selectGov(g.id)}
          >
            {g.name}{g.isCurrent ? ' (current)' : ''}{selectedGovId === g.id ? ' ✓' : ''}
          </Button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
        <Button onClick={startRevolution} disabled={selectedGovId === -1}>
          Start revolution!
        </Button>
        <Button variant="secondary" onClick={closeDialog}>
          Cancel
        </Button>
      </div>
    </Dialog>
  );
}
