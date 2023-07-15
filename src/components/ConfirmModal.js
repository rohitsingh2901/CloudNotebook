import React from 'react';

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
    console.log('hi')
  return (
    <div>
      <div
        class="modal fade"
        id="exampleModalCenter2"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">
              {message}
              </h5>
              <button
                type="button"
                class="close"
                onClick={onCancel}
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-dismiss="modal"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button data-dismiss="modal" onClick={onConfirm} type="button" class="btn btn-primary">
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