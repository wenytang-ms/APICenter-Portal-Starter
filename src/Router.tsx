/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '@/pages/Home';
import ApiInfo from '@/pages/ApiInfo';
import Swagger from './routes/Main/Swagger';
import Layout from './Layout';

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
        children: [
          {
            path: 'api-info/:id',
            element: <ApiInfo />,
          },
        ],
      },
      {
        path: 'specs/:name/:version/:definition',
        element: <Swagger />,
      },
    ],
  },
]);

const Router = () => <RouterProvider router={router} />;

export default Router;
