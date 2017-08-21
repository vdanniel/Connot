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
    this.state = {show:false, showNA:false, currentItemId:'',summary:'',notes:'',speaker:'', msg:'info', when:'', items:[]};
    this.handleChange = this.handleChange.bind(this);
    this.submitData = this.submitData.bind(this);
    this.NotAvailable = this.NotAvailable.bind(this);
    this.ShowViewItem = this.ShowViewItem.bind(this);
  }
  submitData(e) {
    e.preventDefault();
    console.info("about to submit data = " + this.state.summary + " : " + this.state.notes);
    const itemsRef = firebase.database().ref('items');
    const item = {
      summary: this.state.summary,
      notes: this.state.notes,
      speaker: this.state.speaker,
      when: this.state.when
    }
    itemsRef.push(item);
    this.setState({
      summary: '',
      notes: '',
      msg: "success",
      speaker:'',
      when:''
    });
    this.hideModal();
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
          notes: items[item].notes,
          speaker: items[item].speaker,
          when: items[item].when
        });
        console.info("item s: " + ":" + item.when);
      }
      this.setState({
        items: newState
      });
    });
  }
  
  ShowViewItem()
  {

  }



  showModal = () => {
    this.setState({show: true});
  }

  hideModal = () => {
    this.setState({show: false});
    this.setState({showNA: false});
  }

  handleChange (e) {
    console.info("doing this " + e.target.id + " : " + e.target.value);
    this.setState({
      [e.target.id]: e.target.value
    });
  }

  NotAvailable(e)
  {
    e.preventDefault();
    this.setState({showNA:true}); 
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

            <h3>[<span className="glyphicon glyphicon-plane" aria-hidden="true"></span>] Dan's NDC ramblings</h3>
            </div>
            </Col>
            <Col xs={6} md={6} id="buttonTop">
            <div className="right-align">
              <span onClick={this.showModal} className="glyphicon glyphicon-plus" aria-hidden="true"></span>
            </div>
            </Col>
            </Row>
            </Grid>
          </div>
         </header>
       
     
          <Grid>
            <Row className="show-grid">
              {this.state.items.map((item) => {
                  return (
                    <Col sm={8} md={12} lg={12} key={item.id}>
                      <div key={item.id} className="item-card">
                      <div key={item.id} className="item-header">
                      <Grid>
                        <Row className="show-grid">
                          <Col sm={12} md={10} lg={10}>
                         <b>{item.summary}</b> <Label bsStyle="info">{item.speaker}</Label>
                        </Col>
                        <Col sm={2} md={2} lg={2} >
                        <span  className="badge">{item.when}</span>
                          <span onClick={this.NotAvailable} className="badge"><span className="glyphicon glyphicon-pencil" aria-hidden="true"></span></span>&nbsp;
                          <span onClick={this.ShowViewItem} className="badge"><span className="glyphicon glyphicon-blackboard" aria-hidden="true"></span></span>
                        </Col>
                       
                        </Row>
                        <Row className="show-grid">
                          <Col sm={8} md={8} lg={8}>
                          {item.notes}
                          {item.notes.split('\n').map(function(item, key) {
                            return (
                              <span key={key}>
                                {item}
                                <br/>
                              </span>
                            )
                          })}
                          </Col>
                          </Row>
                        </Grid>
                      </div>
                      </div>
                    </Col>
                  )
                })}
              </Row>
            </Grid>
         

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
        <FormGroup
          controlId="speaker" >
          <ControlLabel>who was doing the talk??</ControlLabel>
          <FormControl
            type="text"
            onChange={this.handleChange} />
        </FormGroup>
        <FormGroup
          controlId="when" >
          <ControlLabel>when? </ControlLabel>
          <FormControl componentClass="select" placeholder="select" onChange={this.handleChange}>
          <option value="Wednesday">Wednesday</option>
          <option value="Thursday">Thursday</option>
          <option value="Friday">Friday</option>
          <option value="Saturday">Saturday</option>
        </FormControl>
        </FormGroup>

        <FormGroup controlId="notes">
          <ControlLabel>Take aways? Any?</ControlLabel>
          <FormControl componentClass="textarea" placeholder="" 
          onChange={this.handleChange}/>
        </FormGroup>

        <Label bsStyle={this.state.msg}>fill up and save</Label>

      </form>
    </Modal.Body>
    <Modal.Footer>
    <Button onClick={this.hideModal}>nah, take me back.</Button>
      <Button onClick={this.submitData}>yea, stamp it.</Button>
    </Modal.Footer>
    </Modal>

    <Modal
        {...this.props}
        show={this.state.showNA}
        onHide={this.hideModal}
        dialogClassName="custom-modal"
        >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">Really!! </Modal.Title>
        </Modal.Header>
        <Modal.Body>
                Are you me? Naah! Its Coming!!!
        </Modal.Body>
        <Modal.Footer>
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


