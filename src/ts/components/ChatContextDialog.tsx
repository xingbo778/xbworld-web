/**
 * ChatContextDialog — Preact replacement for chat_context_dialog_show().
 *
 * A floating popup that lets the player choose who to send chat messages to
 * (everybody, allies, or a specific player).  Each row shows a nation flag
 * drawn on a <canvas> plus the recipient description.
 *
 * Opened by setting chatContextSignal; closed by clicking a row or the ×.
 */
import { signal } from '@preact/signals';
import { useEffect, useRef } from 'preact/hooks';

export interface ChatRecipient {
  id: number | null;
  flag: CanvasImageSource | null;
  description: string;
  iconText?: string; // FontAwesome char drawn when no flag
}

interface ChatContextState {
  open: boolean;
  recipients: ChatRecipient[];
  currentId: number | null;
}

export const chatContextSignal = signal<ChatContextState>({
  open: false,
  recipients: [],
  currentId: null,
});

export function showChatContextDialog(
  recipients: ChatRecipient[],
  currentId: number | null,
): void {
  chatContextSignal.value = { open: true, recipients, currentId };
}

export function closeChatContextDialog(): void {
  chatContextSignal.value = { ...chatContextSignal.value, open: false };
}

// ── FlagCanvas — draws a flag or icon onto a <canvas> ─────────────────────

interface FlagCanvasProps {
  flag: CanvasImageSource | null;
  iconText?: string;
}

function FlagCanvas({ flag, iconText }: FlagCanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, 29, 20);
    if (flag != null) {
      ctx.drawImage(flag, 0, 0);
    } else if (iconText) {
      ctx.font = '18px FontAwesome';
      ctx.fillStyle = 'rgba(32,32,32,1)';
      ctx.fillText(iconText, 5, 15);
    }
  }, [flag, iconText]);

  return <canvas ref={ref} width={29} height={20} class="xb-flag-canvas-inline" />;
}

// ── ChatContextDialog component ────────────────────────────────────────────

export function ChatContextDialog() {
  const { open, recipients, currentId } = chatContextSignal.value;
  if (!open) return null;

  function handleRowClick(id: number | null) {
    closeChatContextDialog();
    // Dispatch event so chat.ts can call set_chat_direction()
    document.dispatchEvent(
      new CustomEvent('chat:directionChosen', { detail: { id } }),
    );
  }

  // maxHeight is dynamic (viewport-based) — keep as inline style
  return (
    <div
      id="chat_context_dialog"
      class="xb-chat-context-dialog"
      style={{ maxHeight: Math.floor(0.9 * window.innerHeight) + 'px' }}
    >
      <div class="xb-chat-context-header">
        <span class="xb-chat-context-label">Choose recipient</span>
        <button
          onClick={closeChatContextDialog}
          class="xb-chat-context-close"
        >×</button>
      </div>
      <table class="xb-chat-context-table">
        <tbody>
          {recipients
            .filter(r => r.id !== currentId)
            .map((r, i) => (
              <tr
                key={i}
                onClick={() => handleRowClick(r.id)}
                class="xb-chat-context-row"
              >
                <td class="xb-chat-context-flag-cell">
                  <FlagCanvas flag={r.flag} iconText={r.iconText} />
                </td>
                <td class="xb-chat-context-name-cell">
                  {r.description}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
