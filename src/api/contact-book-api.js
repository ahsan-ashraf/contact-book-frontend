import API from "./api-client";

export const getAllContacts = async () => {
  const response = await API.get("/contact-book/");
  return response;
};
export const addContact = async (contactData) => {
  const response = await API.post("/contact-book/add", contactData);
  return response;
};
export const updateContact = async (contactId, contactData) => {
  const response = await API.patch(
    `/contact-book/update/${contactId}`,
    contactData
  );
  return response;
};
export const deleteContact = async (contactId) => {
  const response = await API.delete(`/contact-book/delete/${contactId}`);
  return response;
};
