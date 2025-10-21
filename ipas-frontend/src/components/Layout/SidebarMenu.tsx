import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import LogoutIcon from '@mui/icons-material/Logout';
import { NavLink, useLocation } from 'react-router-dom';
import CloudIcon from '@mui/icons-material/Cloud';


function SidebarMenu() {
    const location = useLocation();
    return (
        <nav className={`main-menu ${location.pathname === '/Tasks' && 'taskeMenu'}`}>
            <ul>
                  <li>
                    <NavLink to="/RecentCases" className={({ isActive }) => (isActive ? 'active' : undefined)}>
                        <div className="SideMenuIcon"><AssignmentIcon /></div>
                        <span className="nav-text">
                            Recent Cases
                        </span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/Dashboard" className={({ isActive }) => (isActive ? 'active' : undefined)}>
                        <div className="SideMenuIcon"><DashboardIcon /></div>
                        <span className="nav-text">
                            Dashboard
                        </span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/OCR" className={({ isActive }) => (isActive ? 'active' : undefined)}>
                        <div className="SideMenuIcon"><CameraAltIcon /></div>
                        <span className="nav-text">
                            OCR
                        </span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/Tasks" className={({ isActive }) => (isActive ? 'active' : undefined)}>
                        <div className="SideMenuIcon"><AssignmentIcon /></div>
                        <span className="nav-text">
                            Trucare Classic
                        </span>
                    </NavLink>
                </li>
                 <li>
                    <NavLink to="/TrucareCloud" className={({ isActive }) => (isActive ? 'active' : undefined)}>
                        <div className="SideMenuIcon"><CloudIcon /></div>
                        <span className="nav-text">
                            Trucare Cloud
                        </span>
                    </NavLink>
                </li>
              
            </ul >

            {/* <ul className="logout">
                <li>
                    <NavLink to="/login" className={({ isActive }) => (isActive ? 'active' : undefined)}>
                        <div className="SideMenuIcon"><LogoutIcon /></div>
                        <span className="nav-text">
                            Logout
                        </span>
                    </NavLink>
                </li>
            </ul> */}
        </nav >
    );
}

export default SidebarMenu;