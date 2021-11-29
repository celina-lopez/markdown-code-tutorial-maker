import React, { useContext, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import AuthModal from '../auth/AuthModal';
import { logout } from '../auth/utils';
import AppContext from '../contexts';
import md5 from 'blueimp-md5';
import UserProfile from '../user/UserProfile';

export function stringToIntHash(str, upperbound, lowerbound) {
  let result = 0;
  for (let i = 0; i < str.length; i++) {
    result = result + str.charCodeAt(i);
  }

  if (!lowerbound) lowerbound = 0;
  if (!upperbound) upperbound = 500;

  return (result % (upperbound - lowerbound)) + lowerbound;
}

const randomColor = (key) => {
  const val = md5(key).substring(0, 4);
  const integer = stringToIntHash(val)
  const choices = [
    'light',
    'success',
    'danger',
    'info',
    'warning',
    'primary',
    'secondary',
  ]
  return choices[integer % choices.length];
}

function Navbar() {
  const { loggedIn, user } = useContext(AppContext);
  const toggleOffcanvas = () => {
    document.querySelector('.sidebar-offcanvas').classList.toggle('active');
  }
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);

  return (
    <nav
      style={{
        left: '0px',
      }}
      className="navbar p-0 fixed-top d-flex flex-row"
    >
      <div className="navbar-menu-wrapper flex-grow d-flex align-items-stretch">
        <div className="navbar-brand-wrapper d-flex align-items-center justify-content-center">
          <a className="navbar-brand h1 text-light mb-0" href="/">WIP</a>
        </div>
        <ul className="navbar-nav w-100 d-lg-none"></ul>
        <ul className="navbar-nav navbar-nav-right">
          
          { loggedIn && user && (
            <>
              <li className="nav-item">
                <a className="nav-link" href="/projects">
                  <i className="mdi mdi-view-grid"></i>
                </a>
              </li>
              <Dropdown alignRight as="li" className="nav-item">
                <Dropdown.Toggle as="a" className="nav-link cursor-pointer no-caret">
                  <div className="navbar-profile">
                    {user?.username && <i className={`mdi mdi-alpha-${user.username[0]}-circle text-${randomColor(user.username)}`} style={{fontSize: '2em'}}></i>}
                    <p className="mb-0 d-none d-sm-block navbar-profile-name">{user.username}</p>
                    <i className="mdi mdi-menu-down d-none d-sm-block"></i>
                    <i className="mdi mdi-account text-white d-sm-none"></i>
                  </div>
                </Dropdown.Toggle>

                <Dropdown.Menu className="navbar-dropdown preview-list navbar-profile-dropdown-menu">
                  <h6 className="p-3 mb-0">Profile</h6>
                  <Dropdown.Divider />
                  <Dropdown.Item href="!#" onClick={evt =>evt.preventDefault()} className="preview-item">
                    <div className="preview-thumbnail">
                      <div className="preview-icon bg-dark rounded-circle">
                        <i className="mdi mdi-settings text-success"></i>
                      </div>
                    </div>
                    <div className="preview-item-content" onClick={() => setShowUserProfile(!showUserProfile)}>
                      <p className="preview-subject mb-1">Settings</p>
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item href="!#" onClick={logout} className="preview-item">
                    <div className="preview-thumbnail">
                      <div className="preview-icon bg-dark rounded-circle">
                        <i className="mdi mdi-logout text-danger"></i>
                      </div>
                    </div>
                    <div className="preview-item-content">
                      <p className="preview-subject mb-1">Log Out</p>
                    </div>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </>
          ) }
          { (!loggedIn || !user) && (
            <>
              <li className="nav-item">
                <a className="nav-link btn btn-success create-new-button" onClick={(e) => {
                  setShowAuthModal(true)
                  e.preventDefault();
                }}>
                  Sign Up
                </a>
              </li>
            </>
          ) }
        </ul>
        { document.querySelector('.sidebar-offcanvas') && 
          <button className="ml-auto navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" onClick={toggleOffcanvas}>
            <span className="mdi mdi-format-line-spacing"></span>
          </button>
        }
      </div>
      <AuthModal show={showAuthModal} />
      {showUserProfile && <UserProfile show={showUserProfile} setShow={setShowUserProfile} user={user} />}
    </nav>
  );
}

export default Navbar;
