import { Footer } from './components/Footer';

import './App.css'

import { useState, useRef } from 'react'
import axios from 'axios';

/*
Some examples:

https://supersimplebackend.dev

GET
https://supersimplebackend.dev/hello

POST
https://supersimplebackend.dev/greeting {"name":"string"}

https://supersimplebackend.dev/orders
{
  "cart": [{
    "productId": "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
    "quantity": 2,
    "deliveryOptionId": "1"
  }, {
    "productId": "15b6fc6f-327a-4ec4-896f-486349e85a3d",
    "quantity": 1,
    "deliveryOptionId": "2"
  }]
}

*/

function App() {
  const [response, setResponse] = useState('');
  const [type, setType] = useState('GET');
  const [errorMessage, setErrorMessage] = useState('');
  const urlRef = useRef(null);
  const textAreaRef = useRef(null);
  // let responseObject = {};
  // const responseObject = JSON.parse(response);

  function updateType(event:React.ChangeEvent<any>) {
    const typeSelected = event.target.value;
    setType(typeSelected);
  }

  function handleSend() {
    const inputElement = urlRef.current;
    if (inputElement) {
      if (type === 'GET') {
        get(inputElement['value'])
      } else if (type === 'POST') {
        const textAreaElement = textAreaRef.current;
        if (textAreaElement) {
          console.log('post')
          if (textAreaElement['value'] === '') {
            setErrorMessage('Error: Please enter JSON data');
          } else {
            post(inputElement['value'], textAreaElement['value']);
          }
        }
        
      }
    }

  }


  function get(url:string) {
    console.log(`sending to ${url}`)
    axios.get(url)
      .then(function (response) {
        // handle success
        setResponse(JSON.stringify(response));
        setErrorMessage('');
        console.log(response);
      })
      .catch(function (error) {
        // handle error
        // console.log('ERROR');
        setErrorMessage(`Error: ${error}`);
        console.log(error);
    })
  }

  function post(url:string, data:string) {
    console.log(`Sending: ${data}`)
    axios.post(url, JSON.parse(data))
      .then(function (response) {
        // handle success
        setResponse(JSON.stringify(response));
        setErrorMessage('');
        console.log(response);
      })
      .catch(function (error) {
        // handle error
        setErrorMessage(`Error: ${error}`);
        console.log(error);
      });
  }

  const requestPOSTHTML = (
    <>
      <textarea className="post-input" placeholder="Enter JSON data" ref={textAreaRef}></textarea>
    </>
  )

  const responseObject = response === '' ? {} : JSON.parse(response); 
  const responseHTML = (
    <div className="box response-box">
      <div>
        {
          Object.keys(responseObject).map((key) => {
            if (responseObject.hasOwnProperty(key)) {
              if (responseObject[key] instanceof Object) {
                return (
                  <div key={`${key}`}>
                    <h2>{`${key}:`}</h2>
                    {Object.keys(responseObject[key]).map((subKey) => {
                      // console.log(`its: ${(responseObject[key])[subKey]}`);
                      return (
                        <div key={`${subKey}`}>
                          <h3>{`${subKey}:`}</h3>
                          {
                            responseObject[key][subKey] === ''
                            ? <p style={{color:'gray'}}>empty</p>
                            : <p>{`${responseObject[key][subKey]}`}</p>
                          }
                        </div>
                      )
                    })}
                  </div>

                )
              } 

              return (
                <div key={`${key}`}>
                  <h2>{`${key}:`}</h2>
                  {
                    responseObject[key] === ''
                    ? <p style={{color:'gray'}}>empty</p>
                    : <p>{`${responseObject[key]}`}</p>
                  }
                </div>
              )
            } else {
              return <h2 key={`${key}`}></h2>
            }
          })
        }
      </div>
    </div>
  )


  return (
    <>
      <div className="main-content">
        <div className="content-grid">
          <div className="box request-box">
            <div>
              <select value={type} onChange={updateType}>
                <option value="GET">GET</option>
                <option value="POST">POST</option>
              </select>
              <input placeholder="Enter URL" ref={urlRef}></input>
              <button onClick={handleSend}>Send Request</button>
            </div>
            
            {
              errorMessage === '' 
              ? '' 
              : <p style={{color: 'red'}}>{errorMessage}</p>
            }

            {type === 'POST' ? requestPOSTHTML : ''}

          </div>

          {response !== '' ? responseHTML : ''}
        
        </div>
      </div>

      <Footer/>

    </>
  )
}

export default App
