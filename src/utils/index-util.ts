export const generateQuery = (arrayString: string[]) => {
  return arrayString.join(",");
};

export const encodedNotes = (note: string) => {
  return encodeURIComponent(note);
};
