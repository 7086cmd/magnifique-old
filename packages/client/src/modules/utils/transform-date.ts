/** @format */

const transformDate = (grade: number) => {
  const dt = new Date();
  if (dt.getMonth() < 9) {
    return dt.getFullYear() - grade;
  } else {
    return dt.getFullYear() - grade + 1;
  }
};
export default transformDate;
