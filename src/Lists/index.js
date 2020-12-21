import React, { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Box,
  Typography,
  Divider,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import WorkIcon from "@material-ui/icons/Work";
import { Loader } from "../Components";
import { BASE_URL, convertDateForShow } from "../Utils";

const ProjectLists = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [allProjects, setAllProjects] = useState([]);
  const [alertMessage, setAlertMessage] = useState({
    show: false,
    message: "",
  });

  useEffect(() => {
    if (!allProjects.length) {
      getProjectsDetails();
    }
  }, []);

  const getProjectsDetails = () => {
    setLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer keyRqp7PeC27ihGVY");

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `${BASE_URL}/v0/appmgJl9lE5hXmoRD/Projects?maxRecords=3&view=Grid%20view`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setLoading(false);
        var records = result.records;
        if (records.length > 0) {
          setAllProjects(records);
        } else {
          setAlertMessage({
            show: true,
            message: "No records found",
          });
        }
      })
      .catch((error) => {
        setLoading(false);
        setAlertMessage({
          show: true,
          message: "Something went wrong. Please try again later",
        });
      });
  };

  return (
    <>
      {loading ? <Loader /> : null}
      <Box
        className={classes.mainWrapper}
        component='div'
        display='flex'
        justifyContent='center'
        alignItems='center'
        flexDirection='column'
      >
        <Typography variant='h6' gutterBottom className={classes.heading}>
          Project Lists
        </Typography>
        {allProjects.length > 0 ? (
          <List className={classes.listWrapper}>
            {allProjects.map((project, i) => (
              <React.Fragment key={i}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <WorkIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={project.fields.Name}
                    secondary={convertDateForShow(project.createdTime)}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        ) : null}
        {alertMessage.show ? (
          <Typography variant='subtitle1' gutterBottom className={classes.error}>
            {alertMessage.message}
          </Typography>
        ) : null}
      </Box>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  mainWrapper: {
    height: "100vh",
    backgroundColor: "#3a3a3a",
  },
  heading: {
    color: theme.palette.background.paper,
  },
  listWrapper: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  error: {
    color: "#ff6b6b",
  },
}));

export default ProjectLists;
