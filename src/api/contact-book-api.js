import API from "./api-client";

export const getAllContactsApi = async () => {
  const response = await API.get("/contact-book/");
  return response;
};
export const addContactApi = async (contactData) => {
  const response = await API.post("/contact-book/add", contactData);
  return response;
};
export const updateContactApi = async (contactId, contactData) => {
  const response = await API.patch(
    `/contact-book/update/${contactId}`,
    contactData
  );
  return response;
};
export const deleteContactApi = async (contactId) => {
  const response = await API.delete(`/contact-book/delete/${contactId}`);
  return response;
};
