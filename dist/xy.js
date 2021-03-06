'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var clamp = require('clamp');

var isMobile = 'ontouchstart' in document;

var XYControl = React.createClass({
  displayName: 'XYControl',

  propTypes: {
    x: React.PropTypes.number.isRequired,
    y: React.PropTypes.number.isRequired,
    xmax: React.PropTypes.number.isRequired,
    ymax: React.PropTypes.number.isRequired,
    handleClass: React.PropTypes.string,
    onChange: React.PropTypes.func.isRequired
  },
  getInitialState: function getInitialState() {
    return {
      dragging: false
    };
  },
  change: function change(pos) {
    var rect = this.getOwnBoundingRect();
    this.props.onChange({
      x: clamp(pos.left, 0, rect.width) / rect.width * this.props.xmax,
      y: clamp(pos.top, 0, rect.height) / rect.height * this.props.ymax
    });
  },
  getOwnBoundingRect: function getOwnBoundingRect() {
    return ReactDOM.findDOMNode(this).getBoundingClientRect();
  },
  _dragStart: function _dragStart(e) {
    e.preventDefault();
    var rect = this.getOwnBoundingRect();
    var x = isMobile ? e.changedTouches[0].clientX : e.clientX,
        y = isMobile ? e.changedTouches[0].clientY : e.clientY;

    var offset = {
      left: x - rect.left,
      top: y - rect.top
    };

    this.change(offset);

    // Handle interaction
    this.setState({
      start: { x: offset.left, y: offset.top },
      offset: { x: x, y: y }
    });

    window.addEventListener(isMobile ? 'touchmove' : 'mousemove', this._drag);
    window.addEventListener(isMobile ? 'touchend' : 'mouseup', this._dragEnd);
  },
  _drag: function _drag(e) {
    e.preventDefault();
    this.setState({ dragging: true });
    var posX = (isMobile ? e.changedTouches[0].clientX : e.clientX) + this.state.start.x - this.state.offset.x;
    var posY = (isMobile ? e.changedTouches[0].clientY : e.clientY) + this.state.start.y - this.state.offset.y;

    this.change({
      left: posX,
      top: posY
    });
  },
  _dragEnd: function _dragEnd() {
    this.setState({ dragging: false });
    window.removeEventListener(isMobile ? 'touchmove' : 'mousemove', this._drag);
    window.removeEventListener(isMobile ? 'touchend' : 'mouseup', this._dragEnd);
  },
  render: function render() {
    return React.createElement(
      'div',
      {
        onTouchStart: this._dragStart,
        onMouseDown: this._dragStart,
        className: 'slider-xy ' + (this.state.dragging ? 'dragging-xy' : '') },
      React.createElement('div', {
        className: 'handle-xy ' + this.props.handleClass,
        style: {
          top: clamp(this.props.y / this.props.ymax * 100, 0, 100) + '%',
          left: clamp(this.props.x / this.props.xmax * 100, 0, 100) + '%'
        } })
    );
  }
});

module.exports = XYControl;