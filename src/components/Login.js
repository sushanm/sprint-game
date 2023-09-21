import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useNavigate } from 'react-router-dom';
import loginService from '../service/login.service';

function Login() {
    const [userName, SetUserName] = useState();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
const[disable, SetDisble]=useState(false);

    useEffect(() => {
        let loginName = localStorage.getItem('sprintplanningpockernewLoginName')
        if (loginName) {
            SetUserName(loginName)
            handleClose();
        }
        else {
            SetUserName()
            handleShow()
        }
    }, [])
    const history = useNavigate();
    const loginHanler = async () => {
        if (userName) {
            SetDisble(true);
            await loginService.createNewUser({userName}).then((res)=>{
                console.log(res.id)
                localStorage.setItem('sprintplanningpockernewLoginID', res.id);
                localStorage.setItem('sprintplanningpockernewLoginName', userName);
                handleClose();
                window.dispatchEvent(new Event("storage"));
            })
        }
    }

    const logOutHandler = () => {
        localStorage.removeItem("sprintplanningpockernewLoginName");
        localStorage.removeItem("sprintplanningpockernewLoginID");
        history(0);
    }

    return (
        <>
            {
                !show &&
                <>
                    <span className='col-text-middle'> Signed in as: <span className='user-name'>{userName}
                    </span>
                        <NavDropdown id="collapsible-nav-dropdown">
                            <NavDropdown.Item onClick={logOutHandler}>Logout</NavDropdown.Item>
                        </NavDropdown>
                    </span>
                </>
            }
            {
                show &&
                <>
                    <Modal show={show} size="lg" centered animation={true} backdrop="static">
                        <Modal.Header closeButton>
                            <Modal.Title>Login</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="row">
                                <div className="col-10">
                                    <Form.Control required type="text" placeholder="User Name" onChange={(e) => SetUserName(e.target.value)} />
                                </div>
                                {/* <div className="col-5">
                                    <Form.Control required type="text"  placeholder="Public Key" onChange={(e) => SetPublicKey(e.target.value)} />
                                </div> */}
                                <div className="col-2">
                                    <Button variant="primary" onClick={loginHanler} disabled={disable}>
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
