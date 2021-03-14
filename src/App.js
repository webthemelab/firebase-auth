import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';

firebase.initializeApp(firebaseConfig);

function App() {
  const [newUser, setNewUser] = useState(false) 
  const [user, setUser] = useState({
    isSignedIn: false,
    name:'',
    email: '',
    password: '',
    photoURL: '',
    error: '',
    success: false
  })
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const fbProvider = new firebase.auth.FacebookAuthProvider();
  const handleSignIn = () =>{
    firebase.auth().signInWithPopup(googleProvider)
    .then(res =>{
      const {displayName, photoURL, email} =res.user;
      const signedInUser ={
        isSignedIn: true,
        name:displayName,
        email:email,
        photo:photoURL
      }
      setUser(signedInUser);
      console.log(displayName,email,photoURL);
    })
    .catch(err =>{
      console.log(err);
      console.log(err.message);
    })
   }

   const handleFbSignIn = () =>{
    firebase
      .auth()
      .signInWithPopup(fbProvider)
      .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
 
        // The signed-in user info.
        var user = result.user;

        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
         console.log('fb user after sign in', user);

         
      })
      .catch((error) => {
        

      
      });
   }

   const handleSignOut = () =>{
     firebase.auth().signOut()
     .then(res =>{
      const signedOutUser = {
        isSignedIn: false,
        name: '',
        photo:'',
        email: ''
      }
      setUser(signedOutUser);
     })
     .catch(err =>{

     })
   }
   const handleSubmit =(e) =>{
     console.log(user.email, user.password)
     if (newUser && user.email && user.password) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)    
      .then( res => {
        const newUserInfo ={...user};
        newUserInfo.error = '';
        newUserInfo.success = true;
        setUser(newUserInfo);
        updateUserName(user.name);
        console.log("signedInUser user info", res.user);
       })
      .catch((error) => {
        const newUserInfo ={...user};
        newUserInfo.error = error.message;
        newUserInfo.success = false;
        setUser(newUserInfo);
        
      });
     }
     if (!newUser && user.email && user.password) {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then( res => {
        const newUserInfo ={...user};
        newUserInfo.error = '';
        newUserInfo.success = true;
        setUser(newUserInfo);
      })
      .catch((error) => {
        const newUserInfo ={...user};
        newUserInfo.error = error.message;
        newUserInfo.success = false;
        setUser(newUserInfo);
        
      });
     }  

     e.preventDefault();
   }
   const handleChange = (e) =>{
     let isFieldValid = true;
       if (e.target.name === 'email') {
        isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
         
      }
      if (e.target.name === 'password') {
        const isPasswordIsValid =  e.target.value.length > 6;
        const passwordHasNumber = /\d{1}/.test(e.target.value);
        isFieldValid = isPasswordIsValid && passwordHasNumber;
      }
      if (isFieldValid) {
          const newUserInfo ={...user};
          newUserInfo[e.target.name] = e.target.value;
          setUser(newUserInfo);
      }
   }

   const updateUserName = name =>{
    const user = firebase.auth().currentUser;

      updateUserName({
        displayName: name,
       }).then(function() {
         console.log("user name updated successfully",user);
      }).catch(function(error) {
        console.log(error);
       });
   }


  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign out</button> :
        <button onClick={handleSignIn}>Sign in</button>
      }
      <br/> 
      <button onClick={handleFbSignIn}>Sign in using facebook</button>

      {
        user.isSignedIn && <div>
        <p>Welcome,{user.name}</p>
        <p>Your Email:{user.email}</p>
        <img src={user.photo} alt=""/>
        </div>
      }

      <h1>Our won authentication</h1>
      <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id=""/>
      <label htmlFor="newUser">New user signUp</label>
      <form onSubmit={handleSubmit}>
        {newUser && <input type="text" name="name" onChange={handleChange} placeholder="Your name"/>}
        <br/>
        <input type="text" name="email" onChange={handleChange} placeholder="your email address" required/>
        <br/>
        <input type="password" name="password" onChange={handleChange} placeholder="your password" required/>
        <br/>
        <input type="submit" value={newUser ? 'Sign up' : 'Sign in'}/>
      </form>
      <p style={{color:'red'}}>{user.error}</p>
      {user.success && <p style={{color:'green'}}>User { newUser ? 'created' : 'Logged In'} successFully</p> }
    </div>
  );
}

export default App;
