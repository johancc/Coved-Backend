import React from "react";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Dialog from '@material-ui/core/Dialog';
import MentorResultDisplay from "./MentorResultDisplay";
import "./MentorResultDisplay.css"
import { Col, Row } from "react-bootstrap";
/*
Helper component to show the expanded mentor profile
*/

function MentorDisplay({mentor}) {
    const fullScreen = useMediaQuery("600px");
    const [open, setOpen] = React.useState(true);
    const handleClose = () => {
        setOpen(false);
    };
   // return <div>HELLO I'M TEST HOW R U</div>
    return <Dialog open={open} onClose={handleClose} fullScreen={fullScreen} ><MentorResultDisplay mentor={mentor}/></Dialog>

}
/*
This component renders a table displaying
all mentors retrieved.
Props:
    mentors - list of mentors
    onSelect - fx(mentor)
*/
export default function MentorTable({mentors, onSelect}) {
    const [selected, setSelected] = React.useState("");
    const formatList = (subjects) => {
        return subjects.map((subject, i) => i === (subjects.length -1) ? subject : subject + ", ");
    };
    const handleClick = (event, name) => {
        setSelected(name)
    };
    const isSelected = (name) => selected === name;

    return (
    <TableContainer component={Paper}>
        <Table stickyHeader aria-label="mentor table">
            <TableHead>
                <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="left">Major</TableCell>
                    <TableCell align="left">Subjects</TableCell>
                    <TableCell align="left">Tags</TableCell>
                    <TableCell align="left">Timezone</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {mentors.map((mentor, i) => {
                    const isItemSelected = isSelected(mentor.name + i);

                    return (
                    <>
                    <TableRow
                    hover
                    onClick={(event) => handleClick(event, mentor.name + i)}
                    key={mentor.name + mentor.major}>
                        <TableCell component="th" scope="row">
                            {mentor.name}
                        </TableCell>
                        <TableCell align="left">{mentor.major}</TableCell>
                        <TableCell align="left">{formatList(mentor.subjects)}</TableCell>
                        <TableCell align="left">{formatList(mentor.tags)}</TableCell>
                        <TableCell align="left">{mentor.timezone}</TableCell>

                    </TableRow>
                    {isItemSelected && (<MentorDisplay mentor={mentor}/>)}
                    </>
                    )
                })}
            </TableBody>
        </Table>
    </TableContainer>
    )
}