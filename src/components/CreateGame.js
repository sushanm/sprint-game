import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import sprintServices from '../service/sprint.services';
import loginService from '../service/login.service';
import { useNavigate, createSearchParams } from 'react-router-dom';

function CreateGame() {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [gameName, SetGameName] = useState("");
    const navigate = useNavigate();
    const createNewGame = async () => {
        const id = Math.random().toString(36).slice(2);
      
        let newSprint = {
            id: id,
            name: gameName,
            createdBy: loginService.getUserName(),
            createdId: loginService.getUserId(),
            createdDate: new Date().toISOString().split('T')[0]
        }
        await sprintServices.createNewSprint(newSprint).then(res => {
            handleClose();
            navigate({
                pathname: 'games', search: createSearchParams({
                    key: newSprint.id
                }).toString()
            })
        });
    }

    return (
        <>
            {
                show &&
                <Modal show={show} size="lg" centered animation={true} >
                    <Modal.Header closeButton>
                        <Modal.Title>Create New Game</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row">
                            <div className="col-7">
                                <Form.Control required type="text" placeholder="Game Name" value={gameName} onChange={e => SetGameName(e.target.value)} />
                            </div>
                            <div className="col-3">
                                <Button variant="primary" className='widthfull' onClick={createNewGame} >
                                    Create Game
                                </Button>
                            </div>
                            <div className="col-2">
                                <Button variant="secondary" className='widthfull' onClick={handleClose}>
                                    Close
                                </Button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            }
            {
                !show &&
                <div className='create-game-container'>
                    <h1>
                        Scrum Poker for agile development teams
                    </h1>
                    <h4 className='create-game-title-desc'>Have fun while being productive with our simple and complete tool.</h4>

                    <Button variant="primary" className='create-game-title-btn' size='lg' onClick={handleShow}>
                        Start New Game
                    </Button>

                </div>
            }
        </>
    )
}

export default CreateGame
