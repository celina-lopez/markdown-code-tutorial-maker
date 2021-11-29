import React, { useState, useEffect } from 'react';
import axios from "axios";
import { buildRoute } from '../auth/client/routes';
import CourseCard from './CourseCard';
import AddCourseCard from './AddCourse';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import { isLoggedIn } from '../auth/utils';
import Spinner from '../shared/Spinner';

const Index = () => {
  const [courses, setCourses] = useState([]);
  const [filter, setFilter] = useState('public')
  const [loading, setLoading] = useState(true);

  const fetchCourses = () => {
    setLoading(true);
    axios.get(buildRoute(`/editor/courses/?filter=${filter}`))
      .then(function(response) {
        setCourses(response.data.results)
        setLoading(false);
      }).catch(() => {
      });
  }
  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [filter]);

  const createNewCourse = (e) => {
    axios.post(buildRoute('/editor/courses/'), {name: "Untitled Project"}).then((response) => {
      window.location.href = '/courses/' + response.data.id;
    })
  }

  return (
    <div>
      <div>
        <Navbar fullWidth={true} />
        <div className="main-panel">
          <div className="content-wrapper">
            <div>
              <span className={`pointer p-2 rounded mb-4 mr-5 ${filter === 'public' ? 'h2' : 'h4'}`} onClick={() => {
                setFilter('public')
              }}>Public Courses</span>
              <span className={`pointer p-2 rounded mb-4 ${filter === 'own' ? 'h2' : 'h4'}`} onClick={() => {
                setFilter('own')
              }}>Your Courses</span>
              {loading && (
                <div className="p-6 text-center">
                  <Spinner />
                </div>
              )}
              {!loading && (
                <div className="row project-list-showcase">
                  {courses.map((course, idx) => (
                    <div className="mt-4 col-auto">
                      <CourseCard course={course} />
                    </div>
                  ))}
                  {isLoggedIn() && filter === 'own' && (
                    <div className="mt-4 col-auto">
                      <AddCourseCard createNewCourse={createNewCourse} />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <Footer/>
        </div>
      </div>
    </div>
  );
}

export default Index;