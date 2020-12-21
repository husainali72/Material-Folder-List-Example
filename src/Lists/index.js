import React, { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  IconButton,
  Avatar,
  Box,
  Typography,
  Divider,
  useMediaQuery,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import WorkIcon from "@material-ui/icons/Work";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { Loader } from "../Components";
import { BASE_URL, convertDateForShow } from "../Utils";

const ProjectLists = () => {
  var Pathname = window.location.pathname.split("/").join("");
  const classes = useStyles();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const [loading, setLoading] = useState(false);
  const [allProjects, setAllProjects] = useState([]);
  const [allContracts, setAllContracts] = useState([]);
  const [selectedProject, setSelectedProject] = useState({
    index: "",
    name: "",
  });
  const [alertMessage, setAlertMessage] = useState({
    show: false,
    message: "",
  });

  useEffect(() => {
    console.log("Pathname", Pathname);
    if (Pathname) {
      getProjectsDetails(Pathname);
    }else{
      if (!allProjects.length) {
        getProjectsDetails();
      }
    }
    return () => {
      setAlertMessage({
        show: false,
        message: "",
      });
      setAllContracts([]);
      setAllProjects([]);
      setLoading(false);
      setSelectedProject({
        index: "",
        name: "",
      });
    };
  }, []);

  useEffect(() => {
    if (alertMessage.show) {
      setTimeout(() => {
        setAlertMessage({
          show: false,
          message: "",
        });
      }, 6000);
    }
  }, [alertMessage]);

  const getProjectsDetails = (projectName) => {
    setLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer keyRqp7PeC27ihGVY");

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    var URL = "";
    if (projectName) {
      URL = `Projects?filterByFormula=Name%3D'${projectName}'`;
    } else {
      URL = "Projects?maxRecords=3&view=Grid%20view";
    }

    fetch(`${BASE_URL}/v0/appmgJl9lE5hXmoRD/${URL}`, requestOptions)
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

  const getProjectContractsDetails = (id) => {
    setLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer keyRqp7PeC27ihGVY");

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `${BASE_URL}/v0/appmgJl9lE5hXmoRD/Contracts?maxRecords=3&view=Grid%20view&filterByFormula=%7BProject%20Record%20ID%7D%3D"${id}"`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setLoading(false);
        var records = result.records;
        if (records.length > 0) {
          setAllContracts(records);
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

  // Item selected
  const handleListItemSelected = (event, index, name, id) => {
    setAllContracts([]);
    setSelectedProject({
      index,
      name,
    });
    // var contractsName = name.split("Project of ").join("");
    getProjectContractsDetails(id);
  };

  return (
    <>
      {loading ? <Loader /> : null}
      <Box className={classes.mainWrapper} component='div' p={5}>
        <Box
          component='div'
          display='flex'
          flexDirection={isSmall ? "column" : "row"}
        >
          {/* =============All Projects Listing ============= */}
          <Box component='div' display='flex' flexDirection='column'>
            <Typography variant='h6' gutterBottom className={classes.heading}>
              Project Lists
            </Typography>
            {allProjects.length > 0 ? (
              <List className={classes.listWrapper}>
                {allProjects.map((project, i) => (
                  <React.Fragment key={i}>
                    <ListItem
                      button
                      selected={selectedProject.index === i}
                      onClick={(event) =>
                        handleListItemSelected(
                          event,
                          i,
                          project.fields.Name,
                          project.id
                        )
                      }
                    >
                      <ListItemAvatar>
                        <Avatar>
                          <WorkIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={project.fields.Name}
                        secondary={convertDateForShow(project.createdTime)}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge='end'
                          aria-label='comments'
                          onClick={(event) =>
                            handleListItemSelected(
                              event,
                              i,
                              project.fields.Name,
                              project.id
                            )
                          }
                        >
                          <ChevronRightIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            ) : null}
          </Box>

          {/* =============Project contracts Listing============= */}
          <Box
            component='div'
            display='flex'
            flexDirection='column'
            ml={isSmall ? 0 : 3}
          >
            {allContracts.length > 0 ? (
              <>
                <Typography
                  variant='h6'
                  gutterBottom
                  className={classes.heading}
                >
                  {selectedProject.name} Contract Lists
                </Typography>
                <List className={classes.listWrapper}>
                  {allContracts.map((contract, i) => (
                    <React.Fragment key={i}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar>
                            <WorkIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={contract.fields.Name}
                          secondary={convertDateForShow(contract.createdTime)}
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              </>
            ) : null}
          </Box>
        </Box>
        {/* =============Error Message Show============= */}
        {alertMessage.show ? (
          <Typography variant='caption' gutterBottom className={classes.error}>
            {alertMessage.message}
          </Typography>
        ) : null}
      </Box>
    </>
  );
};

// =============Lists Styles=============
const useStyles = makeStyles((theme) => ({
  mainWrapper: {
    height: "100vh",
    backgroundColor: "#d3d3d3",
  },
  heading: {
    [theme.breakpoints.down("sm")]: {
      marginTop: 10,
    },
  },
  listWrapper: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.down("sm")]: {
      maxWidth: "100%",
    },
  },
  error: {
    backgroundColor: "#ff4a4a",
    color: theme.palette.background.paper,
    position: "absolute",
    top: 20,
    right: 20,
    padding: "5px 8px",
    borderRadius: 5,
  },
}));

export default ProjectLists;
