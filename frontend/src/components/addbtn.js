import React from 'react';
import { connect } from 'react-redux';
import {
    Button, Modal, ModalHeader, ModalBody, ModalFooter,
    Form, FormGroup, Label, Input, FormText
} from 'reactstrap';

import FontAwesome from 'react-fontawesome';
import { toggleModalOne, toggleModalTwo, uploadSong } from '../actions/app';
import '../assets/css/index.css';

let file = null,
    ytid = null,
    namesong = null,
    artists = null,
    imagecover = null;

const AddBtn = (props) => {



    return (
        <div>
            <Button outline color="primary" size="lg" onClick={() => props.toggleModalOne()}>+</Button>

            <Modal isOpen={props.app.modalStepOne} toggle={() => props.toggleModalOne()}>
                <ModalHeader toggle={props.toggleModal}>Add youtube song or upload</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="uploadFile">File MP3</Label>
                            <Input type="file" name="uploadFile" id="uploadFile" accept=".mp3" onChange={(e) => file = e.target.files[0]} />
                            <FormText color="muted">
                                You can add mp3 files, max size is 20 MO
                          </FormText>
                        </FormGroup>
                        <hr /> OR <hr />
                        <FormGroup>
                            <Label for="exampleEmail">Youtube ID</Label>
                            <Input type="text" name="ytid" id="ytid" placeholder="ex : jAu1ZsTCA64" onChange={(e) => ytid = e.target.value} />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="success" onClick={() => props.toggleModalTwo()}>Next</Button>{' '}
                    <Button color="error" onClick={() => props.toggleModalOne()}>Cancel</Button>
                </ModalFooter>
            </Modal>


            <Modal isOpen={props.app.modalStepTwo} toggle={() => props.toggleModalTwo()}>
                <ModalHeader toggle={props.toggleModalTwo}>Add youtube song or upload</ModalHeader>
                <ModalBody>
                    <Form>

                        <FormGroup>
                            <Label for="nameSong">New name</Label>
                            <Input type="text" name="nameSong" id="nameSong" placeholder="Name" onChange={(e) => namesong = e.target.value} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="artistsSong">Artists separated by tags</Label>
                            <Input type="text" name="artistsSong" id="artistsSong" placeholder="A,B,C" onChange={(e) => artists = e.target.value} />
                        </FormGroup>

                        <FormGroup>
                            <Label for="imageCover">Url image cover</Label>
                            <Input type="url" name="url" id="imageCover" placeholder="url image cover" onChange={(e) => imagecover = e.target.value} />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="success" onClick={() => props.uploadSong({ file: file, ytid: ytid, name: namesong, artists: artists, cover: imagecover })}>Add</Button>{' '}
                    <Button color="error" onClick={() => props.toggleModalTwo()}>Cancel</Button>
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
    toggleModalOne: () => {
        dispatch(toggleModalOne());
    },

    toggleModalTwo: () => {
        dispatch(toggleModalTwo());
    },

    uploadSong: (data) => {
        console.log(data);

        let form = new FormData();
        if (data.file) {
            form.append('song', data.file);
        } else {
            form.append('ytid', data.ytid);
        }

        form.append('name', data.name);
        form.append('artists', data.artists);
        form.append('cover', data.cover);

        dispatch(uploadSong(form));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(AddBtn);