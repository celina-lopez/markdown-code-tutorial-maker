import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const DeleteModal = ({ onDelete, name }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleDelete = () => {
    onDelete().then(response => {
      handleClose();
    });
  }
  const handleShow = () => setShow(true);
  return (
    <>
      <i className="pointer mdi mdi-delete text-danger" onClick={handleShow}></i>
      {show &&
        <Modal show={true} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Are you sure?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          Delete <span className="text-danger">{name}</span> ?
          You won't be able to revert this!

          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Never mind
            </Button>
          </Modal.Footer>
        </Modal>
      }
    </>
  );
}

export default DeleteModal;
