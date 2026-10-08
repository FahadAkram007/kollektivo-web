'use client';

import { useEffect, useRef } from 'react';

/** A dialog over the page (native <dialog>: Escape and focus handling come from the browser). */
export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    dialog.current?.showModal();
  }, []);

  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      aria-label={title}
      className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-2xl p-0 backdrop:bg-ink/40"
    >
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <h2 className="text-lg font-bold">{title}</h2>
        <button aria-label="Schließen" className="text-ink-muted" onClick={() => dialog.current?.close()}>
          ✕
        </button>
      </div>
      <div className="flex max-h-[75vh] flex-col gap-6 overflow-y-auto p-5">{children}</div>
    </dialog>
  );
}
