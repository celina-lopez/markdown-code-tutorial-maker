import React, { useState, useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { Dropdown, Button } from 'react-bootstrap';
import ChapterSidebar from './components/ChapterSidebar';
import axios from "axios";
import { buildRoute } from '../auth/client/routes';
import EditorContext from './context';
import EditCourseSettings from './components/EditCourseSettings';

const Sidebar = () => {
  const {
    course,
    selected,
    resyncCourse,
  } = useContext(EditorContext);
  const [newChapterName, setNewChapterName] = useState(null);
  const [showEditCourseSettingsModal, setShowEditCourseSettingsModal] = useState(false);

  useEffect(() => {
    const body = document.querySelector('body');
    document.querySelectorAll('.sidebar .nav-item').forEach((el) => {
      el.addEventListener('mouseover', function() {
        if(body.classList.contains('sidebar-icon-only')) {
          el.classList.add('hover-open');
        }
      });
      el.addEventListener('mouseout', function() {
        if(body.classList.contains('sidebar-icon-only')) {
          el.classList.remove('hover-open');
        }
      });
    });
  },[])

  const createNewChapter = (name) => {
    axios.post(
      buildRoute('/editor/chapters/'),
      {course: course.id, name: name}
    ).then((response) => {
      // Reload projects
      resyncCourse();
    })
  }

  return (
    <nav className={`sidebar sidebar-offcanvas ${!selected.lessonId && "active"}`} id="sidebar">
      <div className="sidebar-brand-wrapper d-none d-lg-flex align-items-center justify-content-center fixed-top">
        <a className="sidebar-brand brand-logo h1 text-light" href="/">WIP</a>
        <a className="sidebar-brand brand-logo-mini h1 text-light" href="/">WIP</a>
      </div>
      <ul className="nav">
        <li className="nav-item profile">
          <div className="profile-desc">
            <div className="profile-pic">
              <div className="profile-name">
                <div className="mb-0 font-weight-normal h5">{course.name}</div>
              </div>
            </div>
            <Dropdown alignRight>
              <Dropdown.Toggle as="a" className="cursor-pointer no-caret">
                <i className="mdi mdi-dots-vertical"></i>
              </Dropdown.Toggle>
              <Dropdown.Menu className="sidebar-dropdown preview-list">
                <a href="!#" className="dropdown-item preview-item" onClick={evt =>evt.preventDefault()}>
                  <div className="preview-thumbnail">
                    <div className="preview-icon bg-dark rounded-circle">
                      <i className="mdi mdi-settings text-primary"></i>
                    </div>
                  </div>
                  <div className="preview-item-content" onClick={() => setShowEditCourseSettingsModal(true)}>
                    <p className="preview-subject ellipsis mb-1 text-small">Course settings</p>
                  </div>
                </a>
              </Dropdown.Menu>
            </Dropdown>
            { showEditCourseSettingsModal && (
              <EditCourseSettings resyncCourse={resyncCourse} show={showEditCourseSettingsModal} course={course} setShow={setShowEditCourseSettingsModal} />
            ) }
          </div>
        </li>
        <li className="nav-item nav-category">
          <span className="nav-link">Chapters</span>
        </li>
        {course.chapters.map((chapter, idx) => (
          <ChapterSidebar
            key={idx}
            chapter={chapter}
            icon={""}
            resyncCourse={resyncCourse}
          />
        ))}
        { newChapterName === null && (
          <li className='nav-item menu-items my-1'>
            <Button block className="nav-link btn-info text-white" onClick={() => setNewChapterName('')}>
              + Group
            </Button>
          </li>
        ) }
        { newChapterName !== null && (
          <li className='nav-item menu-items my-1'>
            <input
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  createNewChapter(newChapterName);
                  setNewChapterName(null);
                }
              }}
              autoFocus
              onBlur={() => setNewChapterName(null)}
              onChange={(e) => setNewChapterName(e.target.value)}
              value={newChapterName || ''}
              className="form-control"
            />
          </li>
        ) }
      </ul>
    </nav>
  );
}


  
export default withRouter(Sidebar);
