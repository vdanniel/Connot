import React, { Component } from 'react';
import logo from './logo.svg';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import './App.css';

import { Grid, Col, Row, Navbar, Label, Jumbotron, Button, Modal, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import Popup from 'react-popup';
import Reveal from 'react-reveal'; // this package 
import 'animate.css/animate.css'; // CSS animation effects library 

import firebase from './firebase.js'

class App extends Component {
  constructor(props) {
    super(props);
    //this.state = {isToggleOn: true};

    // This binding is necessary to make `this` work in the callback
    this.AddNotes = this.AddNotes.bind(this);
    this.state = {show:false, summary:'',notes:'', msg:'info', items:[]};
    this.handleChange = this.handleChange.bind(this);
    this.submitData = this.submitData.bind(this);
  }
  submitData(e) {
    e.preventDefault();
    console.info("about to submit data = " + this.state.summary + " : " + this.state.notes);
    const itemsRef = firebase.database().ref('items');
    const item = {
      summary: this.state.summary,
      notes: this.state.notes
    }
    itemsRef.push(item);
    this.setState({
      summary: '',
      notes: '',
      msg: "success"
    });
  }
  componentDidMount() {
    const itemsRef = firebase.database().ref('items');
    itemsRef.on('value', (snapshot) => {
      let items = snapshot.val();
      let newState = [];
      for (let item in items) {
        newState.push({
          id: item,
          summary: items[item].summary,
          notes: items[item].notes
        });
        console.info("item s: " + items[item].notes)
      }
      this.setState({
        items: newState
      });
    });
  }

  showModal = () => {
    this.setState({show: true});
  }

  hideModal = () => {
    this.setState({show: false});
  }

  handleChange (e) {
    console.info("doing this " + e.target.id + " : " + e.target.value);
    this.setState({
      [e.target.id]: e.target.value
    });
  }

  render() {
    return (
      <div >
       <header>
          <div className="navbar-custom"  >
          <Grid>
            <Row className="show-grid">
            <Col xs={6} md={6}>
            <div>
            <h3>Dan's NDC ram</h3>
            </div>
            </Col>
            <Col xs={6} md={6} id="buttonTop">
            <div className="right-align">
              <Button bsSize="large" id onClick={this.showModal}>+</Button>
            </div>
            </Col>
            </Row>
            </Grid>
          </div>
         </header>
       
        <Reveal effect="animated fadeInUp">
          <Grid>
            <Row className="show-grid">
              {this.state.items.map((item) => {
                  return (
                    <Col sm={6} md={6} id={item.id}>
                    <div className="item-card">
                      <div className="item-header">
                        <h4>{item.summary}</h4>
                      </div>
                        <p>{item.notes}</p>
                      </div>
                    </Col>
                  )
                })}
                </Row>
            </Grid>
          </Reveal>

<Modal
{...this.props}
show={this.state.show}
onHide={this.hideModal}
dialogClassName="custom-modal"
>
<Modal.Header closeButton>
  <Modal.Title id="contained-modal-title-lg">Add my NDC session  </Modal.Title>
</Modal.Header>
<Modal.Body>

<form>
        <FormGroup
          controlId="summary" >
          <ControlLabel>Wat was the session about??</ControlLabel>
          <FormControl
            type="text"
            onChange={this.handleChange} />
        </FormGroup>

        <FormGroup controlId="notes">
          <ControlLabel>Take aways? Any?</ControlLabel>
          <FormControl componentClass="textarea" placeholder="" 
          onChange={this.handleChange}/>
        </FormGroup>

        <Label bsStyle={this.state.msg}>{this.state.msg}</Label>

      </form>
</Modal.Body>
<Modal.Footer>
<Button onClick={this.hideModal}>nah, take me back.</Button>
  <Button onClick={this.submitData}>yea, stamp it.</Button>
</Modal.Footer>
</Modal>
</div>
    );
  }

  AddNotes = () => { 
    this.showModal();
  }
}

export default App;


