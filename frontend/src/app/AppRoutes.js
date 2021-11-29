import React, { Suspense, lazy, useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Spinner from '../app/shared/Spinner';

const EditorApp = lazy(() => import('./editor/App'));
const CoursesIndex = lazy(() => import('./courses/Index'));

function AppRoutes() {
  return (
    <Suspense fallback={<Spinner/>}>
      <Switch>
        <Route
          exact
          path="/courses/:courseId/"
          component={(props) => (
            <EditorApp {...props} />
          )}
        />
        <Route
          exact
          path="/courses"
          component={() => (
            <CoursesIndex />
          )}
        />

        <Redirect to="/courses" />
      </Switch>
    </Suspense>
  );
}

export default AppRoutes;