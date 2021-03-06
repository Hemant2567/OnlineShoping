import React from 'react';
import './App.css';
import HomePage  from './pages/homepage/homepage.component';
import { Switch, Route, Redirect}  from 'react-router-dom';
import ShopPage from './pages/shop/shop.component';
import CheckoutPage from './pages/checkout/checkout.component'
import SignInAndSignOut from './pages/sign-in-and-sign-up/sign-in-and-sign-up.component'
import Header from '../src/components/header/header.component'
import { auth,createUserProfileDocument } from './firebase/firebase.utils';
import {connect} from 'react-redux';
import { setCurrentUser } from './redux/user/user.actions'
import {createStructuredSelector} from 'reselect'
import {selectCurrentUser} from './redux/user/user.selector'
class App extends React.Component {
  
  unsubscribeFromAuth = null;

  componentDidMount(){
    
    const {setCurrentUser} = this.props;

    
    this.unSubscribeFromAuth= auth.onAuthStateChanged( async userAuth=>{

      //if user have enter some info then only create the firestore
     if(userAuth){
      
      const userRef= await createUserProfileDocument(userAuth);
      
      userRef.onSnapshot(snapshot=>{
        setCurrentUser(
          {
            id:snapshot.id,
            ...snapshot.data()
          }
        );
        
      })

     }else{
       
       setCurrentUser(userAuth);
     }
     
      

    })
  }
  
  componentWillUnmount(){
    this.unSubscribeFromAuth();
  }
  render()
  {
    return (
    <div >
      <Header/>
      <Switch>
        <Route exact path='/' component={HomePage}/>
        <Route  path='/shop' component={ShopPage}/>
        <Route exact path='/checkout' component={CheckoutPage}/>
        <Route exact path='/signin' render={()=>this.props.currentUser ?(<Redirect to='/'/>): (<SignInAndSignOut/>)}/>
      </Switch>
    </div>
  );
}
}


const mapStateToProps =createStructuredSelector({
  currentUser:selectCurrentUser,
  
})


const mapDispatchToProps=(dispatch)=>({
  
  setCurrentUser:(user)=>dispatch(setCurrentUser(user))
})




export default connect(mapStateToProps,mapDispatchToProps)(App);
  