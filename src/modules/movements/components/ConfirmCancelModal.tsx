import type { RefObject } from 'react';

interface Props {
  dialogRef: RefObject<HTMLDialogElement | null>;
  name: string | null;
  onConfirm: () => void;
}

export default function ConfirmCancelModal({ dialogRef, name, onConfirm }: Props) {
  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Confirmar cancelación</h3>
        <p className="pt-4 text-sm">
          ¿Estás seguro de cancelar el movimiento <strong>{name}</strong>?
        </p>
        <div className="modal-action">
          <button className="btn" onClick={() => dialogRef.current?.close()}>
            Cancelar
          </button>
          <button
            className="btn btn-error"
            onClick={() => {
              onConfirm();
              dialogRef.current?.close();
            }}
          >
            Cancelar movimiento
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
