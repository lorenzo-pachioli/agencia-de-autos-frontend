import Modal from './Modal';

interface Props { open: boolean; onClose: () => void; onConfirm: () => void; title: string; message: string; danger?: boolean; loading?: boolean; }

export default function ConfirmDialog({ open, onClose, onConfirm, title, message, danger, loading }: Props) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <p className="text-slate-600 text-sm mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <button onClick={onClose} className="btn-admin-secondary">Cancelar</button>
        <button onClick={onConfirm} disabled={loading} className={danger ? 'btn-admin-danger' : 'btn-admin-primary'}>
          {loading ? 'Procesando…' : 'Confirmar'}
        </button>
      </div>
    </Modal>
  );
}
