import 'types'

import React from 'react'
import { hot } from 'react-hot-loader/root'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

// SCSS
import GlobalStyles from './components/layout/GlobalStyles'

// Toast notifications
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'

// Main layout
import Layout from 'components/layout/'

// Pages
import About from 'pages/About'
import NotFound from 'pages/NotFound'

toast.configure({ position: toast.POSITION.BOTTOM_RIGHT, closeOnClick: false })

// App
const App: React.FC = () => (
  <>
    <GlobalStyles />
    <Router basename={process.env.BASE_URL}>
      <Layout>
        <Switch>
          <Route path="/about" exact component={About} />
          <Redirect from="/" to="/about" />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </Router>
  </>
)

export default hot(App)
