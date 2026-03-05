import { signal } from '@preact/signals';
import { Dialog } from '../Shared/Dialog';
import { Button } from '../Shared/Button';

const w = window as any;

interface PillageState {
  open: boolean;
  unitId: number;
  unitTypeName: string;
  targets: { id: number; name: string }[];
}

const state = signal<PillageState>({
  open: false,
  unitId: -1,
  unitTypeName: '',
  targets: [],
});

export function openPillageDialog(punit: any, tgt: number[]): void {
  if (!punit) return;
  if (typeof w.client_is_observer === 'function' && w.client_is_observer()) return;
  if (!tgt || tgt.length === 0) return;

  const unitType = w.unit_types?.[punit.type];
  const targets = tgt
    .filter((id: number) => id !== w.EXTRA_NONE)
    .map((id: number) => ({
      id,
      name: w.extras?.[id]?.name ?? `Extra #${id}`,
    }));

  state.value = {
    open: true,
    unitId: punit.id,
    unitTypeName: unitType?.name ?? 'Unit',
    targets,
  };
}

function closePillageDialog(): void {
  state.value = { ...state.value, open: false };
}

function selectTarget(extraId: number): void {
  const { unitId } = state.value;
  if (typeof w.request_unit_do_action === 'function') {
    const punit = w.units?.[unitId];
    w.request_unit_do_action(w.ACTION_PILLAGE, unitId, punit?.tile, extraId);
  }
  closePillageDialog();
}

export function PillageDialog() {
  const { open, unitTypeName, targets } = state.value;

  return (
    <Dialog
      title="Choose Your Target"
      open={open}
      onClose={closePillageDialog}
      width={390}
      modal={false}
    >
      <p style={{ marginBottom: '12px' }}>
        Your {unitTypeName} is waiting for you to select what to pillage.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {targets.map((t) => (
          <Button key={t.id} onClick={() => selectTarget(t.id)}>
            {t.name}
          </Button>
        ))}
        <Button variant="secondary" onClick={closePillageDialog}>
          Cancel
        </Button>
      </div>
    </Dialog>
  );
}
