import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image';
import styled from '@emotion/styled';

const StyledImg = styled(Img)`
  picture {
    color: #f7b733;
  }
`;

const MyLogo = () => (
  // eslint-disable-next-line react/jsx-filename-extension
  <StaticQuery
    query={graphql`
      query {
        myLogo: file(relativePath: { eq: "logo_elephant_100x100.png" }) {
          childImageSharp {
            fixed(width: 100, height: 80) {
              ...GatsbyImageSharpFixed_tracedSVG
            }
          }
        }
      }
    `}
    render={data => <StyledImg fixed={data.myLogo.childImageSharp.fixed} alt="Site Logo" />}
  />
);

export default MyLogo;
