import React, { Component } from "react";

import "../../utilities.css";
import "./Homepage.css";
import { theme } from "../Constants.js";

// Landing page library
import { Provider, Box} from "rebass";
import {
  Hero,
} from "react-landing-page";

import { Container, Row, Col, Table } from "react-bootstrap";
import { Typography } from "@material-ui/core";

const management = [
  {
    name: "Evelyn Wong",
    school: "Harvard, 2021",
    major: "Neuroscience and Spanish Literature"
  },
  {
    name: "Dheekshita Kumar",
    school: "MIT, 2020",
    major: "Mechanical Engineering, Electrical Eng. & Computer Science"
  },
  {
    name: "Tam Nguyen",
    school: "MIT, 2021",
    major: "Biological Engineering"
  },
  {
    name: "Zoya Surani",
    school: "Harvard, 2022",
    major: "Neuroscience"
  },
  {
    name: "Daniela Velez",
    school: "MIT, 2023",
    major: "Computer Science"
  },
  {
    name: "Sarah Dohadwala",
    school: "MIT, 2021",
    major: "Biological Engineering"
  },
  {
    name: "Anne Lheem",
    school: "Harvard, 2021",
    major: "Anthropology, Global Health and Health Policy"
  },
  {
    name: "Nicole (Niki) Kim",
    school: "Harvard, 2023",
    major: "Computer Science and Neuroscience"
  },
];
const resources = [
  {
    name: "Dheekshita Kumar",
    school: "MIT, 2020",
    major: "Mechanical Engineering, Electrical Eng. & Computer Science"
  },
  {
    name: "Garrett Rolph",
    school: "Harvard, 2022",
    major: "Government"
  },
  {
    name: "Benjamin Levy",
    school: "Harvard, 2023",
    major: "Computer Science and Classics"
  },
];
const technology = [
  {
    name: "Dheekshita Kumar",
    school: "MIT, 2020",
    major: "Mechanical Engineering, Electrical Eng. & Computer Science"
  },
  {
    name: "Johan Cervantes",
    school: "MIT, 2021",
    major: "Computer Science"
  },
  {
    name: "Sanjay Yepuri",
    school: "UT Austin, 2021",
    major: "Computer Science and Mathematics"
  },
  {
    name: "April Xie",
    school: "MIT, 2021",
    major: "Computer Science"
  },
];

const coordinators = [
  {
    name: "Tam Nguyen",
    school: "MIT, 2021",
    major: "Biological Engineering"
  },
  {
    name: "Nicole (Niki) Kim",
    school: "Harvard, 2023",
    major: "Computer Science and Neuroscience"
  },
  {
    name: "Evelyn Wong",
    school: "Harvard, 2021",
    major: "Neuroscience, Spanish Literature"
  },
  {
    name: "Pallas Chou",
    school: "Harvard, 2023",
    major: "Molecular and Cellular Biology"
  },
  {
    name: "Jin Wong",
    school: "Southview HS, 2022",
    major: "Computer Science"
  },
  {
    name: "Nathan Liang",
    school: "MIT, 2021",
    major: "Biological Engineering, Comparative Media Studies"
  },
  {
    name: "Srikari Ayyagari",
    school: "Texas A&M, 2021",
    major: "Economics"
  },
];

const pr = [
  {
    name: "Zoya Surani",
    school: "Harvard, 2022",
    major: "Neuroscience"
  },
  {
    name: "Grace Yang",
    school: "UCLA, 2022",
    major: "Human Biology and Society"
  },
  {
    name: "Alina Dong",
    school: "Harvard, 2023",
    major: "Economics"
  },
];

const renderTable = list => {
  return (
    <Table>
      <tbody>
        {
          list.map(person => {
            return (<tr>
              <td><b>{person.name}</b></td>
              <td>{person.school}</td>
              <td>{person.major}</td>
            </tr>)
          })
        }
      </tbody>
    </Table>
  )
}

class WhoWeAre extends Component {
  render() {
    return (
      <>
        <Provider theme={theme}>
          <Hero>
            <Box font="sans" mt={3} mb={7}>
              <Row mt={3} mb={3} className="justify-content-center">
                <Col sm={{span: 12}} className="text-center" p={5}>
                  <Typography variant="h4">
                    Management
                    </Typography>
                </Col>
                <Col xs={12} md={10}>
                  {renderTable(management)}
                </Col>
              </Row>
              <Row mt={3} mb={3} className="justify-content-center">
                <Col sm={{span: 12}} className="text-center" p={3}>
                  <Typography variant="h4">
                    Resource Management Team
                  </Typography>
                </Col>
                <Col xs={12} md={10}>
                  {renderTable(resources)}
                </Col>
              </Row>
              <Row mt={3} mb={3} className="justify-content-center">
                <Col md={{span: 12}} className="text-center" p={3}>
                  <Typography variant="h4">
                    Technology Team
                  </Typography>
                </Col>
                <Col xs={12} md={10}>
                  {renderTable(technology)}
                </Col>
              </Row>
            </Box>
          </Hero>
        </Provider>
      </>
    );
  }
}

export default WhoWeAre;
