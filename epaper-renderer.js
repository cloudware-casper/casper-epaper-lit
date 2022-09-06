/*
 - encoding: utf-8
 -
 - Copyright (c) 2011-2022 Cloudware S.A. All rights reserved
 -
 */

// https://marian-caikovski.medium.com/do-not-waste-users-time-on-rendering-off-screen-content-eed17636e7a7

export class EpaperRenderer {
  static get BOLD_MASK ()       { return 0x01; }
  static get ITALIC_MASK ()     { return 0x02; }
  static get UNDERLINE_MASK ()  { return 0x04; }
  static get STRIKEOUT_MASK ()  { return 0x08; }

  constructor () {
    this._debug      = false;
    this._useClasses = true;

    if ( this._useClasses ) {
      this._styleMap = new Set();
      this._styles   = [];
    }

    this._resetRender();
  }

  _resetRender () {
    this._fillColor  = '#FFFFFF';
    this._textColor  = '#000000';
    this._fontSize   = 10;
    this._fontMask   = 0;
    this._font       = 'DejaVu Sans Condensed';

    this._shapeStyle  = 'S'; // TODO Check 
    this._fillColor   = '#FFFFFF';
    this._strokeWidth = 1.0;
    this._strokeColor = '#000000';

    //this._updateTextStyle();
  }

  _updateShapeProps (props) {
    if ( props.st !== undefined ) { // <s><t>yle
      this._shapeStyle = props.st; // F, S, C<lear> P
    }
    if ( props.fc !== undefined ) { // <f>ill <c>olor
      this._fillColor = props.fc;
    }
    if ( props.sw !== undefined ) { // <s>troke <w>idth
      this._strokeWidth = props.sw;
    }
    if ( props.sc !== undefined ) { // <s>troke <c>olor
      this._strokeColor = props.sc;
    }
    this._updateShapeStyle();
  }

  _updateShapeStyle () {
    if ( this._useClasses ) {
      this._currentLineClass = `L-${this._strokeColor.substring(1)}-${this._strokeWidth}`;
      if (! this._styleMap.has(this._currentLineClass)) {
        this._styleMap.add(this._currentLineClass);
        this._styleSheet.insertRule(`
          .${this._currentLineClass} {
            stroke:${this._strokeColor};
            stroke-width:${this._strokeWidth}
          }
        `);
      }
    } else {
      this._currentLineStyle  = `stroke:${this._strokeColor};stroke-width:${this._strokeWidth}`;
    }
    this._currentShapeStyle = `fill:${this._fillColor}`;
  }

  _updateTextProps (props) {

    if ( props.fn !== undefined ) {
      this._font = props.fn;
    }
    if ( props.fs !== undefined ) {
      this._fontSize = props.fs;
    }
    if ( props.tc !== undefined ) {
      this._textColor = props.tc;
    }
    if ( props.fm !== undefined ) {
      this._fontMask  = props.fm;
    }
    this._updateTextStyle();
  }

  _updateTextStyle () {
    if ( this._useClasses ) {
      this._currentTextClass = `T1-${this._fontSize}-${this._textColor.substring(1)}-${this._fontMask}`; // TODO font idx ??? T1 => Tx
      if ( !this._styleMap.has(this._currentTextClass) ) {
        this._styleMap.add(this._currentTextClass);
        if ( true) {
        this._styleSheet.insertRule(`
          .${this._currentTextClass} {
            font-family: ${this._font};
            font-size: ${this._fontSize}px;
            fill: ${this._textColor};
            font-weight: ${this._fontMask & EpaperRenderer.BOLD_MASK ? 'bold' : 'normal'}
          }
        `);
        } else {
        this._styleSheet.insertRule(
        '.'+ this._currentTextClass
           +'{font-family:'
           + this._font
           +';font-size:'
           + this._fontSize
           + 'px;fill:'
           + this._textColor
           +';font-weight:'
           + this._fontMask & EpaperRenderer.BOLD_MASK ? 'bold' : 'normal'
           + '}');
        }
      }
    } else {
      this._currentTextStyle = `font-family: ${this._font}; font-size: ${this._fontSize}px; fill: ${this._textColor};font-weight: ${this._fontMask & EpaperRenderer.BOLD_MASK ? 'bold' : 'normal'}`;
    }
  }
}
