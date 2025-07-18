import { useEffect, useRef } from 'react';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX, FiTrash2 } from 'react-icons/fi';
import './ConfirmationBox.scss';

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning", // warning, danger, info, success
  icon: CustomIcon,
  showCloseButton = true
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getIcon = () => {
    if (CustomIcon) return <CustomIcon size={32} />;
    switch (type) {
      case 'danger':
        return <FiTrash2 size={32} />;
      case 'info':
        return <FiInfo size={32} />;
      case 'success':
        return <FiCheckCircle size={32} />;
      default:
        return <FiAlertCircle size={32} />;
    }
  };

  const getColor = () => {
    switch (type) {
      case 'danger':
        return '#f94144';
      case 'info':
        return '#4361ee';
      case 'success':
        return '#10b981';
      default:
        return '#f8961e';
    }
  };

  return (
    <div className="confirmation-modal-overlay">
      <div className="confirmation-modal" ref={modalRef}>
        {showCloseButton && (
          <button className="close-btn" onClick={onClose}>
            <FiX size={24} />
          </button>
        )}

        <div className="modal-content">
          <div className="icon-container" style={{ color: getColor() }}>
            {getIcon()}
          </div>

          <div className="text-content">
            <h3>{title}</h3>
            <p>{message}</p>
          </div>

          <div className="action-buttons">
            <button 
              className="cancel-btn" 
              onClick={onClose}
            >
              {cancelText}
            </button>
            <button 
              className="confirm-btn" 
              onClick={onConfirm}
              style={{ backgroundColor: getColor() }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;