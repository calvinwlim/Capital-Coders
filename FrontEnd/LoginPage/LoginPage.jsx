import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithGooglePopup } from "../Firebase/firebase.utils";
import './LoginPage.css'

const SignIn = () => {
const logGoogleUser = async () => {
        const response = await signInWithGooglePopup();
        console.log(response);
    }
return (
        <div id='login-page'>
            <button onClick={logGoogleUser}>Sign In With Google</button>
        </div>
    )
}
export default SignIn;