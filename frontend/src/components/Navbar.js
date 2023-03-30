import './Navbar.css';
import { NavLink, Link } from 'react-router-dom';
import { BsSearch, BsHouseDoorFill, BsFillPersonFill, BsFillCameraFill } from 'react-icons/bs'

const Navbar = () => {
    return (
        <nav id='nav'>
            <Link to="/">ReactGram</Link>
            <form id='search-form' >
                <BsSearch />
                <input type="text" />
            </form>
            <ul id='nav-links'>
                <NavLink to="/">
                    <BsHouseDoorFill/>
                </NavLink>
                <NavLink to="/login">
                    Entar
                </NavLink>
                <NavLink to="/register">
                    Cadastrar
                </NavLink>
            </ul>
        </nav>
    )
}

export default Navbar;