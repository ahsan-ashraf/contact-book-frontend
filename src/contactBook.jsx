import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useCallback, useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import AddContactForm from "./components/addContactForm";
import CollapsibleTable from "./components/collapsibleTable";
import { useAuth } from "./contexts/auth-context";
import ErrorModal from "./components/error-modal";
import {
  getAllContactsApi,
  addContactApi,
  updateContactApi,
  deleteContactApi,
} from "./api/contact-book-api";

function ContactBook() {
  const [loading, setLoading] = useState(false);
  const { userId, accessToken, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [contactToEdit, setContactToEdit] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        const response = await getAllContactsApi();
        //console.log("-=> Contacts: " + JSON.stringify(response.data.contacts));
        setContacts(response.data.contacts || []);
      } catch (err) {
        setError(
          "error can't fetch contacts: " + err?.response?.data?.message ||
            err?.message ||
            "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, [userId, accessToken]);

  const toggleForm = () => {
    setOpen((prev) => !prev);
  };
  const addContact = useCallback((contact) => {
    try {
      const saveContact = async () => {
        setLoading(true);
        const response = await addContactApi(contact);
        // console.log("-=> contact add: " + JSON.stringify(response.data));
        setContacts((prev) => [...prev, { ...response.data.contact }]);
      };
      saveContact();
    } catch (err) {
      setError(
        "error can't add contact: " + err?.response?.data?.message ||
          err?.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, []);
  const updateContact = useCallback(
    (contact) => {
      const editContact = async () => {
        try {
          setLoading(true);
          const response = await updateContactApi(contact.id, contact);
          // console.log("-=> Contact updated: " + JSON.stringify(response.data));
          setContacts((prev) =>
            prev.map((c) => (c.id === contact.id ? { ...contact } : c))
          );
          setContactToEdit(null);
        } catch (err) {
          setError(
            "error can't edit contact: " + err?.response?.data?.message ||
              err?.message ||
              "Something went wrong."
          );
        } finally {
          setLoading(false);
        }
      };
      editContact();
    },
    [contacts]
  );
  const deleteContact = useCallback(
    (id) => {
      const removeContact = async () => {
        try {
          setLoading(true);
          const response = await deleteContactApi(id);
          const filteredContacts = contacts.filter((c) => c.id !== id);
          setContacts(filteredContacts);
          // console.log("-=> Delete Contact: " + JSON.stringify(response.data));
        } catch (err) {
          setError(
            "error can't delete contact: " + err?.response?.data?.message ||
              err?.message ||
              "Something went wrong."
          );
        } finally {
          setLoading(false);
        }
      };
      removeContact();
    },
    [contacts]
  );
  const editContact = useCallback(
    (id) => {
      setContactToEdit(contacts.find((c) => c.id === id));
    },
    [contacts]
  );
  const cancelEditingContact = useCallback(() => {
    setContactToEdit(null);
  }, []);

  const searchContacts = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchInput(value);
  };

  const getFilteredContacts = () => {
    const filteredContacts = contacts.filter((c) => {
      return (
        c.name.toLowerCase().includes(searchInput) ||
        c.phone.toLowerCase().includes(searchInput) ||
        c.address.toLowerCase().includes(searchInput) ||
        c.about.toLowerCase().includes(searchInput) ||
        c.relation.toLowerCase().includes(searchInput)
      );
    });
    return searchInput.length ? filteredContacts : contacts;
  };
  const signOut = async () => {
    try {
      setLoading(true);
      const response = await logout();
    } catch (err) {
      // open modal here
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container>
        <Paper elevation={10} sx={{ mt: 3, padding: 5 }}>
          <Button onClick={signOut}>Logout</Button>
          <Typography variant="h3" gutterBottom>
            Contact Book
          </Typography>
          <Typography variant="h4" sx={{ ml: 10 }} gutterBottom>
            Manage Your Contacts
          </Typography>
          <AddContactForm
            open={open || !!contactToEdit}
            toggleForm={toggleForm}
            addContact={addContact}
            updateContact={updateContact}
            cancelEditingContact={cancelEditingContact}
            contactToEdit={contactToEdit}
          />
          {contacts && contacts.length > 0 ? (
            <>
              <TextField
                id="searchBox"
                type="text"
                label="Search Contacts"
                placeholder="Enter Key words to search contacts..."
                value={searchInput}
                onChange={searchContacts}
                sx={{ width: "100%" }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <SearchIcon color="action" sx={{ mr: 1 }} />
                    ),
                    endAdornment: searchInput ? (
                      <IconButton
                        onClick={() => {
                          setSearchInput("");
                        }}
                        edge="end"
                        size="small"
                      >
                        <ClearIcon />
                      </IconButton>
                    ) : null,
                  },
                }}
              />
              <CollapsibleTable
                data={getFilteredContacts()}
                deleteContact={deleteContact}
                editContact={editContact}
              />
            </>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography>No Contacts Found</Typography>{" "}
              {!open && <Button onClick={toggleForm}>Add New Contact</Button>}
            </Box>
          )}
        </Paper>

        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <ErrorModal
          open={!!error}
          message={error}
          onClose={() => setError(null)}
        />
      </Container>
    </>
  );
}

export default ContactBook;

// PENDING FEATURES:
// FEATURE #1: Formatting via react-input-mask library
// Add image of contact
