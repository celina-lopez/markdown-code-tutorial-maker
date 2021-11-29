import React, { useState } from 'react';

export default function CourseCard({course}) {

  const badge = () => {
    if (course.listed) {
      return <div className="badge badge-success ml-auto">Public</div>
    }

    if (course.ispublic) {
      return <div className="badge badge-info ml-auto">Shareable</div>
    }

    return <div className="badge badge-primary ml-auto">Private</div>
  }
  return (
    <div className="project-grid pointer">
      <div className="img-holder img-bg-1" onClick={() => window.location = `/courses/${course.id}`}>
        <img src="" />
      </div>
      <div className="project-grid-inner">
        <div className="d-flex align-items-start" onClick={() => window.location = `/courses/${course.id}`}>
          <div className="wrapper">
            <h5 className="project-title">{course.name}</h5>
          </div>
          {badge()}
        </div>
        <p className="project-description" onClick={() => window.location = `/courses/${course.id}`}>{course.description}</p>
      </div>
    </div>  
  )
}


