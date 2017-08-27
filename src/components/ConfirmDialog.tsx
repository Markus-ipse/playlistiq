import * as React from 'react';

interface Props {
  children: Array<string | JSX.Element>;
  title: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog = ({
  children,
  title,
  onConfirm,
  onCancel,
  confirmText = 'Save changes',
  cancelText = 'Cancel',
}: Props) =>
  <div className="modal is-active">
    <div className="modal-background" />
    <div className="modal-card">
      <header className="modal-card-head">
        <p className="modal-card-title">
          {title}
        </p>
        <button className="delete" onClick={onCancel} />
      </header>
      <section className="modal-card-body">
        {children}
      </section>
      <footer className="modal-card-foot ps-justifyContent-end">
        <button className="button" onClick={onCancel}>
          {cancelText}
        </button>
        <button className="button is-danger" onClick={onConfirm}>
          {confirmText}
        </button>
      </footer>
    </div>
  </div>;

export default ConfirmDialog;
