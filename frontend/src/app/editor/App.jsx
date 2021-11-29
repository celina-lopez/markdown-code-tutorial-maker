import React, { useEffect, useState } from 'react';
import Index from './Index';
import EditorContext from './context';
import Sidebar from './Sidebar';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import axios from "axios";
import { Row, Col } from 'react-bootstrap';
import { buildRoute } from '../auth/client/routes';

const buildBaseUrl = (location) => {
  return location.protocol + '//' + location.host + location.pathname
}
export default function App(props) {
  const [selected, _setSelected] = useState({groupId: null, layerId: null});

  const setSelected = (selected) => {
    const params = new URLSearchParams(window.location.search);
    if (selected.chapterId) params.set('group_id', selected.chapterId);
    if (selected.lessonId) params.set('layer_id', selected.lessonId);
    const newUrl = buildBaseUrl(window.location) + "?" + params.toString()
    window.history.pushState({}, null, newUrl);
    _setSelected(selected);
  }

  const [course, setCourse] = useState({
    name: '',
    groups: [],
  });
  const resyncCourse = () => {
    let path = `/editor/courses/${props.match.params.courseId}/`
    axios.get(buildRoute(path))
      .then(function(response) {
        setCourse(response.data)
      }).catch((error) => {
        if (error.response) {
          window.location.href = `/courses`;
        }
      });
  }
  useEffect(() => {
    resyncCourse()
    const params = new URLSearchParams(window.location.search);
    const chapterId = params.get('chapterId')
    const lessonId = params.get('lessonId')
    setSelected({chapterId: chapterId, lessonId: lessonId})
  }, []);

  const currentChapter = course.chapters.find(g => g.id === selected.chapterId);
  let currentLesson;
  if (currentChapter) {
    currentLesson = currentChapter.lessons.find(l => l.id === selected.lessonId);
  }
  
  return (
    <EditorContext.Provider value={{
      course: course,
      selected: selected,
      setSelected: setSelected,
      resyncCourse: resyncCourse,
    }}>
      <div className="container-scroller">
        <Sidebar />
        <div className="container-fluid page-body-wrapper">
          <Navbar /> 
          <Row>
            <Col className="main-editor">
              <div className="content-wrapper">
                <Index
                  currentLesson={currentLesson}
                  reloadCourse={resyncCourse}
                  currentChapter={currentChapter}
                />
              </div>
              <Footer/>
            </Col>
          </Row>
        </div>
      </div>
    </EditorContext.Provider>
  )
}