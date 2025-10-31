import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

function ErrorModal({ open, message, onClose }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="error-dialog-title"
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle
        id="error-dialog-title"
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        <ErrorOutlineIcon color="error" />
        <Typography variant="h6" component="span">
          Error
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1">{message}</Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained" color="error">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ErrorModal;
