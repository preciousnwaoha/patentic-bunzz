import React, { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PatentsContext from "../context/patents-context";
import Button from "../components/UI/Button";

import Loading from "../components/UI/Loading";
import classes from "./PatentView.module.css";
import ContractContext from "../context/contract-context";
import Header from "../components/Layout/Header";
import NotConnected from "../components/Errors/NotConnected"
import { useEffect } from "react";
import { useState } from "react";
import { formatAddress } from "../utils/contractUtils";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

const PatentView = () => {
  const params = useParams();
  const navigate = useNavigate();
  const contractCtx = useContext(ContractContext);
  const patentsCtx = useContext(PatentsContext);
  const [loadingPatent, setLoadingPatent] = useState(false);

  const { connected } = contractCtx;

  const { patents } = patentsCtx;

  useEffect(() => {
    const getAllPatentsHandler = async () => {
      await patentsCtx.getAllPatents();

      setLoadingPatent(false);
    };
    if (connected) {
      setLoadingPatent(true);
      getAllPatentsHandler();
    }
  }, [connected]);

  if (!connected) {
    console.log("not connected");
    return <>
    <Header />
    <Box sx={{
      mt: "5rem"
    }}>
      <NotConnected />
      </Box></>;
  }

  if (patents.length === 0 && !loadingPatent) {
    console.log("0 patents");
    return <><Header />
    <Box sx={{
      mt: "5rem"
      
    }}>
      No Patents
      </Box></>;
  }

  if (loadingPatent) {
    console.log("loding patent");
    return <><Header />
    <Box sx={{
      mt: "5rem"
      
    }}>
      <Loading />
      </Box></>;
  }

  console.log("loaded patents");
  console.log("patents", patents);

  const [patent] = patents.filter((patent) => {
    return (
      patent.patentOwner === params.address &&
      `${patent.timestamp}` === `${params.timestamp}`
    );
  });

  console.log("patent", patent);
  const { patentOwner, timestamp, patentData } = patent;

  const { patentName, patentText, patentType } = patentData;

  const backHandler = () => {
    navigate(-1);
  };

  const shareClickHandler = () => {
    console.log("share")
  } 

  const createdAt = `${new Date(timestamp * 1000)}`;

function createMarkup() {
    return {__html: patentText};
  }

  return (
    <>
      <Header />
      <Box component="section" className={classes["patent-view"]} sx={{
        mt: "5rem"
      }}>

        <Box className={classes.main} sx={{
          border: 0,
          bgcolor: "secondary2.fade2"
        }}>
          <Box sx={{
            borderRadius: "8px",
            mb: 4,
            display: "inline-block",
            bgcolor: "background.paper",
            p: 1,
            "&:hover": {
              textDecoration: "none",
              color: "primary.dark",
              bgcolor: "primary.fade2",
            }
          }} className={classes["back"]} onClick={backHandler}>
            back
          </Box>
          <Box >
          <Typography variant="body1" sx={{
            fontWeight: 700,
          }}>Patent Name</Typography>
          <Typography variant="h2" sx={{
            fontSize: "2rem",
            mb: 2
          }} className={classes["name"]}>{patentName}</Typography>

          <Typography variant="body1" sx={{
            fontWeight: 700,
          }}>Content</Typography>
          <Box sx={{
            maxHeight: {xs: "calc(100vh - 2rem - 4rem - 6rem)"},
            overflowY: "auto",
          }}>
          <p className={classes["text"]} dangerouslySetInnerHTML={createMarkup()} ></p>
          </Box>
          </Box>
          
          
        </Box>
        <Paper elevation={4} sx={{
          p: 2,
          bgcolor: "background.paperAlt",
          borderRadius: "8px",
          display: {xs: "block", md: "inline-block"},
        width: {xs: "auto", md: "calc(35% - 1rem)"},
        height: "auto",
        marginLeft: {xs: "auto", md: "1rem"},
        minHeight: {xs: "auto", md: "calc(100vh - 4rem - 3.5rem)"},
        color: "primary.contrastText"
        }} className={classes.side}>
          <div className={classes["type"]}>
          <h4>Type:</h4>
           <p>{patentType}</p></div>
          <div className={classes["ownership"]}>
            <h4>Owner</h4>
            <p className={classes["address"]}>{formatAddress(patentOwner)}</p>
            {true && <p className={classes["you-own"]}>You own this patent</p>}
          </div>

          <div className={classes["date"]}>
            <h4>Created At</h4>
            <p>{createdAt || "Failed to get creation time"}</p>
          </div>
          

          <div className={classes["actions"]}>
          <Button
            type={"link"}
            link={`/patents/message-owner/${patentOwner}/${timestamp}`}
            className={classes["msg-btn"]}
            sxObj={{
              mr: {xs: "1rem"}
            }}
          >
            Reach Owner
          </Button>
            <Button className={classes["share-btn"]} onClick={shareClickHandler}>Share</Button>

          </div>
        </Paper>
      </Box>
    </>
  );
};

export default PatentView;
