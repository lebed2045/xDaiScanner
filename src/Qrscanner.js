import React, { Component } from "react";
import QrReader from "react-qr-reader";
 
class Qrscanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      delay: 500,
      result: "No xDai address is found"
    };
    this.handleScan = this.handleScan.bind(this);
  }
  handleScan(data) {
    if (data && data !== this.state.result) {
      this.setState({
        result: data
      });
      //update, woohooo!
      console.log("new qr code found!");
      // that means that we scanned some sort of qr code
      // now let's check where it's valid xDai address, and if so
      // send this amazing news to the server API and redirect to 
      // the payment page
      let xDaiAddress = "";
      let xDaiValue = "";
      // is it buffdai address?
      const preffix = "https://buffidai.io/";
      if (data.substring(0, preffix.length) === preffix) {
        console.log("found buffidai preffix!");
        let i = 0;
        for (i = preffix.length; i < data.length; i++) {
            if ( /[^a-zA-Z0-9]/.test(data[i]) ) break;
            xDaiAddress += data[i];
        }
        //console.log("xDAi = " + xDaiAddress);
        for ( i++; i < data.length; i++) {
            if ( /[^0-9]/.test(data[i]) ) break;
            xDaiValue += data[i];
        }

      } else {
        // is it ethereum address?
        if (this.isAddress(data)) {
            xDaiAddress = data;
        }
      }
      if (xDaiAddress) {
        // let's call API and update the right JSON on redis
        console.log("xDai = " + xDaiAddress + ", value = " + xDaiValue);
      }
      

    }
  }

   isAddress = function (address) {
        if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
            // check if it has the basic requirements of an address
            return false;
        } 
        return true;
    };

  handleError(err) {
    console.error(err);
  }
  render() {
    return (
      <div>
        <QrReader
          delay={this.state.delay}
          onError={this.handleError}
          onScan={this.handleScan}
          style={{ width: "100%", height: "100%"}}
          facingMode="environment"
        />
        <p>{this.state.result}</p>
      </div>
    );
  }
}

export default Qrscanner;