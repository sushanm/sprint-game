import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

function Login() {
    const [userName, SetUserName] = useState();
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        let loginName = localStorage.getItem('sprintplanningpockernewLogin')
        if (loginName) {
            SetUserName(loginName)
            handleClose();
        }
        else {
            SetUserName()
            handleShow()
        }
    }, [])

    const loginHanler = () => {
        if (userName) {
            localStorage.setItem('sprintplanningpockernewLogin', userName);
            handleClose();
        }
    }

    return (
        <>
            {
                !show &&
                <>
                    <div className="col"> <span className='col-text-middle'> Signed in as: <span className='user-name'>{userName}</span></span></div>
                    <div className="col">
                    <Button variant="primary" >
                                        Start New Game
                                    </Button>
                    </div>

                </>
            }
            {
                show &&
                <>
                    <Modal show={show} size="lg" centered animation={false} backdrop="static">
                        <Modal.Header closeButton>
                            <Modal.Title>Login</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="row">
                                <div className="col-10">
                                    <Form.Control required type="text" placeholder="User Name" onChange={(e) => SetUserName(e.target.value)} />
                                </div>
                                <div className="col-2">
                                    <Button variant="primary" onClick={loginHanler} >
                                        Login
                                    </Button>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>
                </>
            }
        </>
    )
}

export default Login
