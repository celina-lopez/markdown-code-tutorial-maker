import React, { useState } from 'react';
import { Card, Modal, Form, Button, InputGroup } from 'react-bootstrap'
import axios from 'axios';
import { buildRoute } from '../../auth/client/routes';

export default function EditCourseSettings({resyncCourse, course, show, setShow}) {
  const [isSaving, setIsSaving] = useState(false);
  const deleteCourse = () => {
    setIsSaving(true);
    axios.delete(buildRoute(`/editor/courses/${course.id}/`)).then(() => {
      setIsSaving(false);
      window.location.href = "/courses";
    }).catch(() => {
      setIsSaving(false);
    })
  }
  const save = () => {
    setIsSaving(true);
    axios.put(buildRoute(`/editor/courses/${course.id}/`), newCourse).then(() => {
      resyncCourse();
      setIsSaving(false);
      setShow(false);
    }).catch(() => {
      setIsSaving(false);
    })
  }
  const [newCourse, setNewCourse] = useState(course);

  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Card>
        <Card.Body>
          <Form>
            <Form.Group className="mb-3" controlId="project-name">
              <Form.Label>Course Name</Form.Label>
              <Form.Control onChange={(e) => setNewCourse({...newCourse, name: e.target.value})} value={newCourse.name} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="project-description">
              <Form.Label>Course Description</Form.Label>
              <Form.Control onChange={(e) => setNewCourse({...newCourse, description: e.target.value})} value={newCourse.description} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Website</Form.Label>
              <InputGroup>
                <InputGroup.Text className="input-group-prepend">https://</InputGroup.Text>
                <Form.Control onChange={(e) => setNewCourse({...newCourse, website: e.target.value})} value={newCourse.website} />
              </InputGroup>
            </Form.Group>

            <Form.Label>Visibility</Form.Label>
            <Form.Group className="mb-3" controlId="public">
              <Form.Check type="checkbox" label="Is Public" checked={newCourse.ispublic} onClick={(e) => {
                setNewCourse({...newCourse, ispublic: !newCourse.ispublic});
              }} />
              <Form.Text className="text-muted">
                Make this link shareable.
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="listed">
              <Form.Check type="checkbox" label="Is Listed" checked={newCourse.listed} onClick={(e) => setNewCourse({...newCourse, listed: !newCourse.listed})} />
              <Form.Text className="text-muted">
                We will put this project on our homepage!
              </Form.Text>
            </Form.Group>

            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <Button variant="success" type="submit" disabled={isSaving} onClick={save}>
                { !isSaving && "Save" }
                { isSaving && "..." }
              </Button>
              <Button variant="danger" type="submit" disabled={isSaving} onClick={deleteCourse}>
                Delete Course
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Modal>
  )
}
