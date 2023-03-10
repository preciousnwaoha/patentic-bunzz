import React, { useContext } from "react";
import {Link} from "react-router-dom"
import MessagesContext from "../../context/messages-context";
import useInput from "../../hooks/use-input";
import { formatAddress } from "../../utils/contractUtils";
import Button from "../UI/Button";
import classes from "./MessageOwnerForm.module.css";
import Box from "@mui/material/Box"

const MessageOwnerForm = ({ to, patent }) => {
  const messagesCtx = useContext(MessagesContext);

  const {
    value: enteredText,
    isValid: textIsValid,
    hasError: textHasError,
    valueChangeHandler: textChangeHandler,
    inputBlurHandler: textBlurHandler,
    reset: textResetHandler,
  } = useInput((value) => value.trim().length >= 10);

  const lorem = `Lorem, ipsum dolor sit amet consectetur address adipisicing elit. 
    Aperiam error eaque commodi culpa beatae fuga, 
    sed sit ea quod, 
    atque obcaecati illum ipsam? 
    Cumque dolores earum modi veritatis ex tenetur!`;

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!textIsValid) {
      console.log("failed sending");
      return;
    }

    await messagesCtx.addMessage(to, enteredText, patent);

    console.log("to: ", to);
    console.log("enteredText: ", enteredText);
    console.log("patent: ", patent);
    console.log("sent");

    textResetHandler();
  };

  return (
    <Box component="form" className={classes["message-owner-form"]} onSubmit={submitHandler} sx={{
      display: {xs: "block", md: "flex"},
      flexDirection: {xs: "column", md: "row"},
    }}>
      <Box sx={{
        border: 0,
        bgcolor: "secondary2.fade2",
        mb: {xs: 2, md: 0},
      }} className={classes.text}>
        <label htmlFor="message-text">Message</label>
        <textarea
          value={enteredText}
          id={"message-text"}
          placeholder={lorem}
          onChange={textChangeHandler}
          onBlur={textBlurHandler}
        ></textarea>
        {textHasError && <p className={classes.error}>Text has error</p>}
      </Box>
      <Box className={classes.info} sx={{
        bgcolor: "background.paperAlt"
      }}>
        <div className={classes.to}>
          <h4>To</h4>
          <p>{formatAddress(to)}</p>
        </div>

        <div className={classes.patent}>
          <h4>Patent</h4>
          <p><Link to={`/patents/${patent}`}>{patent}</Link></p>
        </div>

        {/* <div className={classes["fee-note"]}>
          <h4>Fee</h4>
          <p className={classes.fee}>0.002ETH</p>
          <p className={classes.note}>Note</p>
        </div> */}

        <Button type={"submit"} className={classes.submit} sxObj={{
          my: 2,
        }}>
          Send Message
        </Button>
      </Box>
    </Box>
  );
};

export default MessageOwnerForm;
