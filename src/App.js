import React, { PropTypes, Component } from 'react';
//import logo from './logo.svg';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import './App.css';

import { Grid, Col, Row, Label, Button, Modal, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
//import Popup from 'react-popup';
//import Reveal from 'react-reveal'; // this package 
import 'animate.css/animate.css'; // CSS animation effects library 

import firebase from './firebase.js';
import { FeatureFlag } from "react-launch-darkly";

class App extends Component {
  constructor(props) {
    super(props);
    //const propTypes = {children:PropTypes.any};
    //const currentItem;
    //this.state = {isToggleOn: true};

    // This binding is necessary to make `this` work in the callback
    this.AddNotes = this.AddNotes.bind(this);
    this.state = {show:false, showNA:false, showPresentation:false,currentItem:[], currentItemId:'',summary:'',notes:'',speaker:'', msg:'info', when:'', items:[]};
    this.handleChange = this.handleChange.bind(this);
    this.submitData = this.submitData.bind(this);
    this.NotAvailable = this.NotAvailable.bind(this);
    //this.ShowViewItem = this.ShowViewItem.bind(this);
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
          when: items[item].when,
          currentItemId: item.id
        });
      }
      this.setState({
        items: newState
      });
    });
  }


 
  showModal = () => {
    //this.setState({showAuth:true})

    this.setState({show: true});
  }

  hideModal = () => {
    this.setState({show: false});
    this.setState({showNA: false});
    this.setState({showPresentation: false});
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

  ShowViewItem(t)
  {
    for(var i=0;i<this.state.items.length;i++)
      {
        if(this.state.items[i].id === t)
          {
            this.setState({
              summary: this.state.items[i].summary,
              notes: this.state.items[i].notes,
              speaker: this.state.items[i].speaker,
              when: this.state.items[i].when,
            });
          }
      }
    
    this.setState({showPresentation:true}); 
  }
  
  _renderFeature () {
    return (
      <div className="right-align">
      <h2><span onClick={this.showModal} className="glyphicon glyphicon-plus" aria-hidden="true"></span></h2>
    </div>
    );
  }

  render() {
    return (
      <div >
        <div>
        
         </div>

        <header>
          <div className="navbar-custom"  >
          <Grid>
            <Row className="show-grid hidden-xs hidden-sm hidden-md">
            <Col xs={6} md={6}>
            <div>
           
            <h2>[<span className="glyphicon glyphicon-plane" aria-hidden="true"></span>] Dan's NDC ramblings</h2>
            </div>
            </Col>
            <Col xs={6} md={6} id="buttonTop">
            <div>
            <div className="right-align">
            <h2><span onClick={this.showModal} className="glyphicon glyphicon-plus" aria-hidden="true"></span></h2>
          </div>
            </div> 
           
            </Col>
            </Row>


            <Row className="show-grid visible-xs visible-sm visible-md">
            <Col xs={8} md={8}>
            <div>

          [<span className="glyphicon glyphicon-plane" aria-hidden="true"></span>] Dan's NDC ramblings
            </div>
            </Col>
            <Col xs={4} md={4} id="buttonTop">
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
                       
                          <span onClick={this.NotAvailable} className="badge"><span className="glyphicon glyphicon-pencil" aria-hidden="true"></span>edit</span>&nbsp;
                          <span key={item.id} id={item.id}  onClick={this.ShowViewItem.bind(this, item.id)} className="badge" value="dsada"><span className="glyphicon glyphicon-blackboard" aria-hidden="true"></span> view</span>
                        </Col>
                       
                        </Row>
                        <Row className="show-grid details">
                          <Col sm={8} md={8} lg={8} >
                            <div >
                              {item.notes.split('\n').map(function(item, key) {
                                return (
                                  <span key={key}>
                                    {item}
                                    <br/>
                                  </span>
                                )
                              })}
                          </div>
                          </Col>
                          </Row>
                          <Row className="show-grid ">
                          <Col sm={6} md={6} lg={6}>
                          <span  className="badge">{item.when}</span>  </Col><Col sm={6} md={6} lg={6}><div className="footer-card" key> {item.id}</div>
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


    <Modal
        {...this.props}
        show={this.state.showPresentation}
        onHide={this.hideModal}
        dialogClassName="custom-modal"
        >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">{this.state.summary}</Modal.Title>
          <Label bsStyle="info">{this.state.speaker}</Label>
         
        </Modal.Header>
        <Modal.Body>
        {this.state.notes.split('\n').map(function(item, key) {
                            return (
                              <span key={key}>
                                {item}
                                <br/>
                              </span>
                            )
                          })}
        </Modal.Body>
        <Modal.Footer>
        <Label bsStyle="primary">{this.state.when}</Label>
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


