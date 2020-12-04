import React,{ useState, useEffect, useContext} from 'react'
import Logo from '../images/logo.png'
import { Link, useHistory } from 'react-router-dom'
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import '../components/Navbar.css'
import { UserContext } from '../App'

const Navbar = () =>{
    const { state, dispatch } = useContext(UserContext)
    const history = useHistory()
    const renderList = () =>{
        if(state){
            return[
                <li key="1" className="list_items"><Link className="navbar_links" to="/profile" onClick={closeMobileMenu}>Profile</Link></li>,
                <li key="6" className="list_items"><Link className="navbar_links" to="/explore" onClick={closeMobileMenu}>My Following Post</Link></li>,
                <li key="5" className="list_items"><button className="logout_btn" onClick={()=> {
                        localStorage.clear()
                        dispatch({type:'CLEAR'})
                        history.push('/signin')
                }}>Logout</button></li>
            ]
        }else{
             return[
                <li key="3" className="list_items"><Link className="navbar_links" to="/signin" onClick={closeMobileMenu}>Signin</Link></li>,
                <li key="4" className="list_items"><Link className="navbar_links" to="/signup" onClick={closeMobileMenu}>Signup</Link></li>
            ]
        }
    }

    const [ click, setClick] = useState(false)
    const [ button, setButton ] = useState(true)
    
    const handleClick = () => setClick(!click)
    const closeMobileMenu = () => setClick(false)
    const showButton = () =>{
        if( window.innerWidth <= 960) {
          setButton(false)
        }else{
            setButton(true)
        }
    }

    useEffect(() => {
        showButton();
        window.addEventListener('resize', showButton);
      }, []);

    return(
        <div className="navbar_section">
            <div className="navbar_wrapper">
                <Link className="navbar_logo" src={Logo} to={state?'/': '/signin'} onClick={closeMobileMenu} >
                    <img src={Logo} />
                </Link>
                <div className="menu_icon" onClick={handleClick}>
                    {click ? <CloseIcon /> : <MenuIcon />}
                </div>
                <ul className={ click ? 'navbar_menu active' : 'navbar_menu' }>
                        {renderList()}
                </ul>
            </div>
        </div>
    )
}

export default Navbar