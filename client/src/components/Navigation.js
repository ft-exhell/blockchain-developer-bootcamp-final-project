import React from "react";
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'

const Navigation = (props) => {
    return(
        <div id='Navbar'>
            <Navbar>
                <Container>
                    <Navbar.Brand href='#home'>
                        <img
                            alt=''
                            width='160'
                            src='/assets/simetri-logo.svg'
                            className='d-inline-block align-top'
                        /> 
                    </Navbar.Brand>
                    <Nav>
                        <Nav.Link href='#home'>News</Nav.Link>
                        <Nav.Link href='#home'>Ratings</Nav.Link>
                        <Nav.Link href='#home'>Contact Us</Nav.Link>
                        <Nav.Link href='#home'>Connect Your Wallet</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        </div>
    )
}

export default Navigation;