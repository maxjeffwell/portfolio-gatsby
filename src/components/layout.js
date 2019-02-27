import React from "react"
import PropTypes from "prop-types"
import { StaticQuery, graphql } from "gatsby"

import Header from "./header"
import "./layout.css"

const GET_SITE_METADATA = graphql`
    {
        site {
            siteMetadata {
                title
                author
                createdAt
            }
        }
    }
`;

const Layout = ({ children }) => (
  <StaticQuery
    query={GET_SITE_METADATA}
    render={data => (
      <>
        <Header />
        <div
          style={{
            margin: `0 auto`,
            maxWidth: 960,
            padding: `0px 1.0875rem 1.45rem`,
            paddingTop: 0,
          }}
        >
          <main>{children}</main>
          <footer>
            Built by {data.site.siteMetadata.author}, created{``}
            {data.site.siteMetadata.createdAt}
            <a href="https://www.gatsbyjs.org">Gatsby</a>
          </footer>
        </div>
      </>
    )}
  />
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
