import React,{ useEffect, createContext, useReducer,useContext } from 'react'
import './App.css';
import {BrowserRouter as Router, Switch, Route, useHistory } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Signin from './components/Signin'
import Signup from './components/Signup'
import Profile from './components/Profile'
import UserProfile from './components/UserProfile'
import CreatePost from './components/CreatePost'
import SubscribedUserPosts from './components/SubscribeUserPost'
import { reducer, initialState } from './reducers/userReducer'
import PostImg from './components/PostImg'


export const UserContext = createContext()


const Routing = () =>{
  const history = useHistory()
  const { state, dispatch } = useContext(UserContext)
  useEffect(() =>{
    const user = JSON.parse(localStorage.getItem('user'))
    // console.log(user)
    dispatch({type:"USER",payload:user})
    if(user){
      dispatch({type:"USER",payload:user})
    }else{
      history.push('/signin')
    }
  },[])
  
  return(
    <Switch>
    <Route exact path="/" component={Home} ></Route>
    <Route exact path="/signin" component={Signin} ></Route>
    <Route exact path="/signup" component={Signup} ></Route>
    <Route exact path="/profile" component={Profile} ></Route>
    <Route exact path="/createpost" component={CreatePost} ></Route>
    <Route path="/profile/:userid" component={UserProfile} ></Route>
    <Route path="/explore" component={SubscribedUserPosts} ></Route>
    <Route path="/post" component={PostImg} ></Route>
  </Switch>
  )
}


function App() {
  const [state,dispatch] = useReducer(reducer,initialState)
  return (
      <UserContext.Provider value={{state,dispatch}}>
        <Router>
          <Navbar />
          <Routing />
      </Router>
    </UserContext.Provider>
  );
}

export default App;
