import React from 'react';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import { toggleModal } from '../actions/app';
import '../assets/css/index.css';

const AddBtn = (props) => {
    return (
        <div>
            <Button outline color="primary" size="lg" onClick={() => props.toggleModal()}>+</Button>

            <Modal isOpen={props.app.modal} toggle={() => props.toggleModal()}>
                <ModalHeader toggle={props.toggleModal}>Modal title</ModalHeader>
                <ModalBody>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
               </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={() => props.toggleModal()}>Do Something</Button>{' '}
                    <Button color="secondary" onClick={() => props.toggleModal()}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

const mapStateToProps = (state, ownProps) => ({
    app: state.app,
    player: state.player
});

const mapDispatchToProps = (dispatch) => ({
    toggleModal: () => {
        dispatch(toggleModal());
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(AddBtn);