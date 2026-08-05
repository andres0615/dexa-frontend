import type { RefObject } from 'react';

interface Props {
  dialogRef: RefObject<HTMLDialogElement | null>;
  name: string | null;
  onConfirm: () => void;
}

export default function ConfirmCompleteModal({ dialogRef, name, onConfirm }: Props) {
  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Confirmar completado</h3>
        <p className="pt-4 text-sm">
          ¿Estás seguro de completar el movimiento <strong>{name}</strong>?
        </p>
        <div className="modal-action">
          <button className="btn" onClick={() => dialogRef.current?.close()}>
            Cancelar
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              onConfirm();
              dialogRef.current?.close();
            }}
          >
            Completar
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
