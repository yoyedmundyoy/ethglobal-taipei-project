// "use client"

// import React, { Component } from 'react'
// import QrReader from 'react-qr-reader'

// class Test extends Component {
//   state = {
//     result: 'No result' // Initial state before any QR is scanned
//   }

//   // Handle the scanned data
//   handleScan = data => {
//     if (data) {
//       this.setState({
//         result: data // Update state with the QR code data
//       })
//     }
//   }

//   // Handle any error
//   handleError = err => {
//     console.error(err)
//   }

//   render() {
//     return (
//       <div style={{ textAlign: 'center', marginTop: '20px' }}>
//         {/* QR Reader Component */}
//         <QrReader
//           delay={300} // Delay between scans in milliseconds
//           onError={this.handleError} // Error handler
//           onScan={this.handleScan}   // Handle successful scans
//           style={{ width: '100%', maxWidth: '400px', margin: 'auto' }} // Styling for the reader
//         />
        
//         {/* Display QR code content */}
//         <p style={{ marginTop: '20px', fontSize: '18px', fontWeight: 'bold' }}>
//           {this.state.result} {/* Display the result from the scan */}
//         </p>
//       </div>
//     )
//   }
// }

// export default Test
