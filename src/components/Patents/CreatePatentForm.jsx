import React, { useContext, useState } from "react";
import PatentsContext from "../../context/patents-context";
import useInput from "../../hooks/use-input";
import classes from "./CreatePatentForm.module.css";
import PatentCategory from "./PatentCategory";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const lorem = `Lorem, ipsum dolor sit amet consectetur address adipisicing elit. 
    Aperiam error eaque commodi culpa beatae fuga, 
    sed sit ea quod, 
    atque obcaecati illum ipsam? 
    Cumque dolores earum modi veritatis ex tenetur!`;

const CreatePatentForm = () => {
  const [category, setCategory] = useState("");
  const patentsCtx = useContext(PatentsContext);

  const [waitingForSignature, setWaitingForSignature] = useState(false);

  const {
    value: enteredName,
    isValid: nameIsValid,
    hasError: nameHasError,
    valueChangeHandler: nameChangeHandler,
    inputBlurHandler: nameBlurHandler,
    reset: nameResetHandler,
  } = useInput((value) => value.trim() !== "");

  const {
    value: enteredText,
    isValid: textIsValid,
    hasError: textHasError,
    valueChangeHandler: textChangeHandler,
    inputBlurHandler: textBlurHandler,
    reset: textResetHandler,
  } = useInput((value) => value.trim().length >= 50);

  const handleSelectCategory = (_cat) => {
    setCategory(_cat);
    console.log(_cat);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!nameIsValid && !textIsValid) {
      console.log("failed sending");
      return;
    }

    setWaitingForSignature(true);

    const text = enteredText.replace(/\n/g, "<br />");

    await patentsCtx.addPatent(enteredName, text, category ? category : "None");

    console.log("enteredName: ", enteredName);
    console.log("enteredText: ", text);
    console.log("sent");

    nameResetHandler();
    textResetHandler();

    setWaitingForSignature(false);
  };

  return (
    <Paper
      elevation={4}
      component="form"
      sx={{
        display: { xs: "auto", md: "flex" },
        p: 2,
        justifyContent: { xs: "auto", md: "space-between" },
      }}
      onSubmit={submitHandler}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.paper",
          p: { xs: 0, md: 2 },
          borderRadius: { xs: "1rem", md: "1rem 0 0 1rem" },
          marginBottom: "1rem",
          width: { xs: "auto", md: "65%" },
          m: { xs: "auto", md: 0 },
        }}
        className={classes["text"]}
      >
        <label htmlFor="patent-name">Name</label>
        <input
          value={enteredName}
          type={"text"}
          id={"patent-name"}
          placeholder={"Some Name"}
          onChange={nameChangeHandler}
          onBlur={nameBlurHandler}
        />
        <p className={`${nameHasError && classes.error}`}>name is too short!</p>
        <label htmlFor="patent-text">Content</label>
        <textarea
          value={enteredText}
          id={"patent-text"}
          placeholder={lorem}
          onChange={textChangeHandler}
          onBlur={textBlurHandler}
        ></textarea>
        <p className={`${textHasError && classes.error}`}>
          description is too short
        </p>
      </Box>
      <Box
        sx={{
          p: { xs: 0, md: 2 },
          width: { xs: "auto", md: "calc(35% - 1rem)" },
          ml: { xs: "auto", ml: 2 },
          display: { xs: "block", md: "flex" },
          flexDirection: { xs: "auto", md: "column" },
          justifyContent: { xs: "auto", md: "space-between" },
          borderRadius: { xs: 2, md: "0 1rem 1rem 0" },
        }}
      >
        <Box
          sx={{
            height: { xs: "33.33%" },
            width: "100%",
            display: { xs: "inline-block" },
          }}
        >
          <Typography
            variant="body1"
            sx={{
              mb: 1,
            }}
          >
            Category
          </Typography>
          <PatentCategory
            category={category}
            onSelectCategory={handleSelectCategory}
          />
        </Box>

        <Box
          sx={{
            height: { xs: "33.33%" },
            width: "100%",
            display: { xs: "inline-block" },
          }}
          className={classes["fee-note"]}
        >
          <Typography
            variant="body1"
            sx={{
              mb: 1,
              fontWeight: 500,
            }}
          >
            Fee
          </Typography>
          <Box
            sx={{
              border: "2px solid black",
              borderRadius: { xs: "8px", md: "0 8px 8px 0" },
              padding: "1rem",
              marginBottom: { xs: 2, md: 0 },

            }}
          >
            <Typography variant="body1" sx={{

            }}>You will be charged <b>0.2 MATIC</b> for <b>0.2 PAT</b></Typography>
            <Typography variant="body2" sx={{
                color: "primary.main"
            }}>Note: Patents are created by recievin PAT token</Typography>
          </Box>
        </Box>

        <Button
          type={"submit"}
          variant="contained"
          sx={{
            alignSelf: { xs: "auto", md: "flex-end" },
          }}
        >
          Create
        </Button>
      </Box>
    </Paper>
  );
};

export default CreatePatentForm;
