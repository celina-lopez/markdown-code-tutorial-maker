import React from 'react';
import { Row } from 'react-bootstrap';
import DeleteModal from "./components/DeleteModal";
import axios from "axios";
import { buildRoute } from '../auth/client/routes';


const Index = ({ currentLesson, currentChapter, reloadCourse }) => {

  const onDelete = (type, id) => axios
    .delete(buildRoute(`/editor/${type}/${id}`))
    .then(r => reloadCourse());

  return (
    <div className="h-100">
      {!currentChapter && (
        <div>
          <Row>Choose a Chapter to get started</Row>
        </div>
      )}
      {currentLesson && (
        <div>
          <div className="d-flex">
            <div className="ml-auto">
              <DeleteModal onDelete={() => onDelete('lessons', currentLesson.id)} name={currentLesson.name}/>
            </div>
          </div>
          <Row>
            something
          </Row>
        </div>
      )}
    </div>
  );
}

export default Index;
