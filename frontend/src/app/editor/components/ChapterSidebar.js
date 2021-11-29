import React, { useState, useContext, useEffect } from 'react';
import { Collapse } from 'react-bootstrap';
import { List, arrayMove } from 'react-movable';
import axios from "axios";
import { buildRoute } from '../../auth/client/routes';
import EditorContext from '../context';

const ChapterSidebar = ({ chapter: { id, name }, icon, resyncCourse }) => {
  const {
    course,
    selected,
    setSelected,
  } = useContext(EditorContext);
  const [editingNew, setEditingNew] = useState(false);
  const [newLessonName, setNewLessonName] = useState('');
  let lessons = course.chapters.find(c => c.id == id).lessons.sort(x => x.order)

  const [orderedLessons, setLessons] = useState(lessons)

  useEffect(() => {
    setLessons(lessons)
  }, [lessons])

  const open = selected.chapterId === id;

  const renderLayerList = ({ children, props }) => (
    <ul {...props} className="nav flex-column sub-menu">{children}</ul>
  )

  const renderLayerItem = ({ value, props, isDragged, isSelected }) => (
    <li 
      className="nav-item py-1"
      {...props}
      onKeyDown={(e)=> e.preventDefault()}
      style={{
        ...props.style,
        listStyleType: "none",
        cursor: isDragged ? "grabbing" : "grab",
        zIndex: isDragged || isSelected ? 99 : "inherit"
      }}
    >
      <a
        className={selected.chapterId === value.id ? 'text-light' : 'text-muted' }
        onClick={() => {
          setSelected({...selected, chapterId: value.id})
        }}
      >
        {value.name}
      </a>
    </li>
  )

  const onLayerChange = ({ oldIndex, newIndex }) => {
    let newLessons = arrayMove(orderedLessons, oldIndex, newIndex);
    setLessons(newLessons);
    newLessons.map((l, idx) => {
      axios.put(
        buildRoute(`/editor/lessons/${l.id}/`),
        {order: idx, chapter: id, name: l.name}
      )
    });
  }

  const createNewLesson = (name) => {
    axios.post(
      buildRoute('/editor/lessons/'),
      {chapter: id, name: name, order: lessons.length}
    ).then((response) => {
      setLessons(lessons.concat(response.data));
      setSelected({...selected, lessonId: response.data.id});
      setNewLessonName('');
      resyncCourse();
    })
  }


  return (
    <li className={'nav-item menu-items my-1'}>
      <div
        className={open ? 'nav-link menu-expanded' : 'nav-link'}
        onClick={() => setSelected({...selected, chapterId: id})}
        data-toggle="collapse"
      >
        <span className="menu-icon">
          <i className={"mdi mdi-emoticon" + icon}></i>
        </span>
        <span className="menu-title">{name}</span>
        <i className="menu-arrow"></i>
      </div>
      <Collapse in={open}>
        <div>
          <List
            values={orderedLessons}
            onChange={(e) => onLayerChange(e)}
            renderList={(rl) => renderLayerList(rl)}
            renderItem={(ri) => renderLayerItem(ri)}
          />
          { editingNew && (
            <input
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  createNewLesson(newLessonName);
                  setEditingNew(false);
                }
              }}
              value={newLessonName}
              onBlur={() => {
                setEditingNew(false);
                setNewLessonName('');
              }}
              onChange={(e) => setNewLessonName(e.target.value)}
              className="form-control"
            />
          ) }
          <ul className="nav flex-column sub-menu">
            <li className="nav-item">
              <span className="nav-link" onClick={() => setEditingNew(true)}>
                + Layer
              </span>
            </li>
          </ul>
        </div>
      </Collapse>
    </li>
  );
}



export default ChapterSidebar;