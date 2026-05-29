export const generateQuery = (arrayString: string[]) => {
  return arrayString.join(",");
};

export const encodedNotes = (note: string) => {
  return encodeURIComponent(note);
};

export const parseAmount = (value: string) => {
  return Number(value.replace(/,/g, ""));
};

export const unformatDate = (formattedDate: string): Date | null => {
  if (!formattedDate) return null;

  const months = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sept: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  } as any;

  const splitted = formattedDate.split(" ");

  if (splitted.length !== 3) {
    return null;
  }

  const [day, month, year] = splitted as any;

  const parsedDate = new Date(Number(year), months[month], Number(day));

  return isNaN(parsedDate.getTime()) ? null : parsedDate;
};

export const isEmptyAmount = (value?: string) => {
  return !value || value === "0" || value === "0.00";
};

export const isEmptyDate = (value?: string) => {
  return !value || value === "-";
};

export const isEmptyRefDoc = (value: string) => {
  return !value || value === "0";
};

export const unformatDateToOData = (
  formattedDate: string,
  endOfDay = false,
): string | null => {
  if (!formattedDate) return null;

  const months = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sept: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  } as any;

  const splitted = formattedDate.split(" ");

  if (splitted.length !== 3) {
    return null;
  }

  const [day, month, year] = splitted as any;

  const parsedDate = new Date(Number(year), months[month], Number(day));

  if (isNaN(parsedDate.getTime())) {
    return null;
  }

  const yyyy = parsedDate.getFullYear();
  const mm = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const dd = String(parsedDate.getDate()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
};
