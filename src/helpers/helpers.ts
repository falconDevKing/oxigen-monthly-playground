//create date modifier
export const modifyDate = (date: string) => (date.includes("Z") ? date : date + "Z");
