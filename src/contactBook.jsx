import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useCallback, useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { v4 as uuid } from "uuid";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import axios from "axios";
import AddContactForm from "./components/addContactForm";
import CollapsibleTable from "./components/collapsibleTable";
import { useAuth } from "./contexts/auth-context";

const API_BASE = "http://localhost:5000/api/contact-book";

function ContactBook() {
  const { userId, accessToken, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [contactToEdit, setContactToEdit] = useState(null);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get(`${API_BASE}/${userId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        console.log(
          "-=> Contacts Response: " + JSON.stringify(response.data.contacts)
        );
        setContacts(response.data.contacts || []);
      } catch (err) {
        console.log(
          "-=> error can't fetch contacts: " +
            (err?.response?.data?.message || err?.message || err)
        );
      }
    };
    fetchContacts();
  }, [userId, accessToken]);

  const toggleForm = () => {
    setOpen((prev) => !prev);
  };
  const addContact = useCallback((contact) => {
    try {
      const addContact = async () => {
        const response = await axios.post(
          `${API_BASE}/add`,
          {
            name: contact.name,
            phone: contact.phone,
            address: contact.address,
            about: contact.about,
            relation: contact.relation,
          },
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        console.log(
          "-=> contact add response: " + JSON.stringify(response.data)
        );
        setContacts((prev) => [...prev, { ...contact, id: uuid() }]);
      };
      addContact();
    } catch (err) {
      console.log(
        "error can't add contact: " +
          (err?.response?.data?.message || err?.message || err)
      );
    }
  }, []);
  const updateContact = useCallback(
    (contact) => {
      const updateContact = async () => {
        console.log("id: " + contact.id);
        try {
          const response = await axios.patch(
            `${API_BASE}/update/${contact.id}`,
            {
              name: contact.name,
              phone: contact.phone,
              address: contact.address,
              about: contact.about,
              relation: contact.relation,
            },
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );
          console.log("-=> Contact updated: " + JSON.stringify(response.data));
          setContacts((prev) =>
            prev.map((c) => (c.id === contact.id ? { ...contact } : c))
          );
          setContactToEdit(null);
        } catch (err) {
          console.log(
            "-=> Can't edit contact: " +
              (err?.response?.data?.message || err?.message)
          );
        }
      };
      updateContact();
    },
    [contacts]
  );
  const deleteContact = useCallback(
    (id) => {
      const filteredContacts = contacts.filter((c) => c.id !== id);
      setContacts(filteredContacts);
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

  return (
    <>
      <Container>
        <Paper elevation={10} sx={{ mt: 3, padding: 5 }}>
          <Button onClick={logout}>Logout</Button>
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
      </Container>
    </>
  );
}

export default ContactBook;

// PENDING FEATURES:
// FEATURE #1: Formatting via react-input-mask library
// Add image of contact
