"use client";

import { useCallback, useState } from "react";
import { DeleteConfirmModal } from "@/components/shared/delete-confirm-modal";

export type DeleteConfirmOptions = {
  title?: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
};

type ActiveRequest = DeleteConfirmOptions;

/**
 * Reusable destructive-action confirmation. Render `deleteConfirmModal` once per page.
 *
 * @example
 * const { requestDeleteConfirm, deleteConfirmModal } = useDeleteConfirm();
 * ...
 * onClick={() => requestDeleteConfirm({
 *   title: "Remove connection",
 *   description: `Remove "${name}"? This cannot be undone.`,
 *   confirmLabel: "Remove",
 *   onConfirm: () => deleteConn(id),
 * })}
 * {deleteConfirmModal}
 */
export function useDeleteConfirm() {
  const [request, setRequest] = useState<ActiveRequest | null>(null);
  const [pending, setPending] = useState(false);

  const requestDeleteConfirm = useCallback((options: DeleteConfirmOptions) => {
    setRequest(options);
  }, []);

  const close = useCallback(() => {
    if (!pending) setRequest(null);
  }, [pending]);

  const handleConfirm = useCallback(async () => {
    if (!request) return;
    setPending(true);
    try {
      await request.onConfirm();
      setRequest(null);
    } finally {
      setPending(false);
    }
  }, [request]);

  const deleteConfirmModal = (
    <DeleteConfirmModal
      open={request !== null}
      title={request?.title}
      description={request?.description ?? ""}
      confirmLabel={request?.confirmLabel}
      cancelLabel={request?.cancelLabel}
      pending={pending}
      onConfirm={() => void handleConfirm()}
      onCancel={close}
    />
  );

  return { requestDeleteConfirm, deleteConfirmModal, close, isOpen: request !== null };
}
