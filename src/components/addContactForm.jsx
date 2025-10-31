import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import { useFormik } from "formik";
import MenuItem from "@mui/material/MenuItem";
import { contactValidationSchema } from "./addContact-validationSchema";
import Typography from "@mui/material/Typography";

function AddContactForm({
  open,
  toggleForm,
  addContact,
  updateContact,
  contactToEdit = null,
  cancelEditingContact,
}) {
  const initialValues = React.useMemo(
    () => ({
      id: "",
      name: "",
      phone: "",
      address: "",
      about: "",
      relation: "",
    }),
    []
  );
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: contactToEdit || initialValues,
    validationSchema: contactValidationSchema,
    onSubmit: (values) => {
      if (contactToEdit) {
        updateContact(values);
      } else {
        addContact(values);
      }
    },
  });

  const handleResetForm = () => {
    contactToEdit = null;
    cancelEditingContact();
    formik.resetForm();
    toggleForm();
  };

  return (
    <Box
      sx={{
        textAlign: "center",
      }}
    >
      <Typography>
        {contactToEdit !== null ? "Update Contact" : "Add Contact"}
      </Typography>
      <IconButton onClick={toggleForm}>
        {open ? (
          <KeyboardArrowUp fontSize="large" />
        ) : (
          <KeyboardArrowDown fontSize="large" />
        )}
      </IconButton>
      <Collapse in={open}>
        <form onSubmit={formik.handleSubmit}>
          <FormControl>
            <Box>
              <TextField
                variant="standard"
                id="name"
                name="name"
                label="Name"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                sx={{ ml: 3, mr: 3, mt: 1, mb: 1 }}
              />
              <TextField
                variant="standard"
                id="phone"
                name="phone"
                label="Phone"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phone}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
                sx={{ ml: 3, mr: 3, mt: 1, mb: 1 }}
              />
            </Box>
            <TextField
              variant="standard"
              id="address"
              name="address"
              label="Address"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.address}
              error={formik.touched.address && Boolean(formik.errors.address)}
              helperText={formik.touched.address && formik.errors.address}
              sx={{ ml: 3, mr: 3, mt: 1, mb: 1 }}
            />
            <TextField
              variant="standard"
              id="about"
              name="about"
              label="About this contact"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.about}
              error={formik.touched.about && Boolean(formik.errors.about)}
              helperText={formik.touched.about && formik.errors.about}
              sx={{ ml: 3, mr: 3, mt: 1, mb: 1 }}
            />
            <TextField
              select
              id="relation"
              name="relation"
              label="Relation"
              value={formik.values.relation}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.relation && Boolean(formik.errors.relation)}
              helperText={formik.touched.relation && formik.errors.relation}
              sx={{ width: 400, alignSelf: "center" }}
            >
              <MenuItem value="Self">Self</MenuItem>
              <MenuItem value="Family">Family</MenuItem>
              <MenuItem value="Friend">Friend</MenuItem>
              <MenuItem value="Office">Office</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
            <Button
              type="submit"
              variant="contained"
              color="success"
              disabled={!formik.isValid || !formik.dirty}
              sx={{ margin: 1, width: 400, alignSelf: "center" }}
            >
              {contactToEdit !== null ? "Update Contact" : "Save Contact"}
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleResetForm}
              sx={{ margin: 1, width: 400, alignSelf: "center" }}
            >
              Cancel
            </Button>
          </FormControl>
        </form>
      </Collapse>
    </Box>
  );
}

export default React.memo(AddContactForm);
