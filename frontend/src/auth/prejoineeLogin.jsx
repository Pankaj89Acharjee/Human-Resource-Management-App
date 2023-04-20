import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../App";
import "../assets/import.css";
import { GET_LOGIN } from "../request/auth";

import {showAlert} from "../component/showError"

const PrejoineeLogin = (props) => {
  const { dispatch } = useContext(UserContext);

  const [email, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loadingbtn, setLoadingbtn] = useState(false);

  const getLogin = async () => {
    setLoadingbtn(true);
    // GET_LOGIN(email, password).then(async (res) => {
    //   if (res.statuscode === 1) {
    //     showAlert('error','success', res.message)
    //     localStorage.setItem('prejoinee', res.token);
    //     dispatch({ type: 'HASHCASHPREJOINEE', payload: res.token });
    //     window.location.replace('/prejoinee')
    //   } else {
    //     showAlert('error','danger', res.message)
    //     setLoadingbtn(false);
    //   }
    // })

  }

  useEffect(() => {
    if (localStorage.getItem("hrmsemp")) {
      window.location.href = '/home'
    }
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <body class="hold-transition login-page">
        <div class="login-box">
          <div class="login-logo">
            <b>PreJoinee Login </b> <br /> Hashcash Consultants
          </div>

          <div class="card">
            <div class="card-body login-card-body">
              <p class="login-box-msg">Sign in to start your session</p>
              <div id="error"></div>
              <form>
                <div className="form-group">
                  <label>Username or email *</label>
                  <input type="text" onChange={(e) => setUsername(e.target.value)} className="form-control p_input" />
                </div>
                <div className="form-group">
                  <label>Password *</label>
                  <input type="password" onChange={(e) => setPassword(e.target.value)} className="form-control p_input" />
                </div>
                <div className="text-center">
                  {loadingbtn === false ? (
                    <button type="button" className="btn btn-primary btn-block enter-btn" onClick={getLogin}>Login</button>
                  ) : (
                    <button
                      className='btn btn-primary btn-block enter-btn' disabled>
                      <i className='fa fa-circle-o-notch fa-spin'></i>
                      Please Wait ....
                    </button>
                  )}

                </div>
              </form>
            </div>

          </div>
        </div>

      </body>
    </>
  );
};

export default PrejoineeLogin;