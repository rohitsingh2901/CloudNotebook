import React from 'react';

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
    console.log('hi')
  return (
    <div>
      <div
        className="modal fade"
        id="exampleModalCenter2"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLongTitle">
              {message}
              </h5>
              <button
                type="button"
                className="close"
                onClick={onCancel}
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-light"
                data-dismiss="modal"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button data-dismiss="modal" onClick={onConfirm} type="button" className="btn btn-light">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
