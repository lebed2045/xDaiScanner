import React, { Component } from "react";
import QrReader from "react-qr-reader";
import queryString from 'query-string';
 
class Qrscanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      delay: 500,
      result: "",
      status: "No xDai address is found"
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
        const status = "xDai = " + xDaiAddress + ", value = " + xDaiValue;
        this.setState({status: status});
        
        // let's call API and update the right JSON on redis
        console.log(window.location.search);
        this.callApi(xDaiAddress, xDaiValue);

      } else {
        this.setState({status: "No valid xDai address is found"});
      }
      

    }
  }

  callApi = async (address, value) => {
        const url = window.location.search;
        console.log(url);
        const id = queryString.parse(url).tx || "";
        //console.log(id);
        //window.location = "https://ethergram.tk/send/?tx=" + id;
        
        const request = {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                toAddress: address,
                value: value
            })
        };
        
        const responce = await fetch('https://ethergram.tk/api/transactionUpdate/'+id, request)
            .then( (response, err) => {
                console.log()
                response.json();
            })
            .then(json => {
                console.log(json);
                // redirectact
                const newUrl = "https://ethergram.tk/send/?tx=" + id;
                console.log("going to redirect " + newUrl);
                window.location = newUrl;
            })
            .catch(e => {
                console.log(e);
                this.setState({status: "The server is not available" + e});
                return e
            });

        return responce;
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
        <p>{this.state.status}</p>
      </div>
    );
  }
}

export default Qrscanner;