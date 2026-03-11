export const formatSemesterNumber = (semesterName: string): string => {
  const numberMatch = semesterName.match(/^(\d+)/);
  if (numberMatch) {
    return `${numberMatch[1]}° período`;
  }

  if (semesterName.match(/Primeiro|primeiro|1/i)) {
    return "1° período";
  } else if (semesterName.match(/Segundo|segundo|2/i)) {
    return "2° período";
  } else if (semesterName.match(/Terceiro|terceiro|3/i)) {
    return "3° período";
  } else if (semesterName.match(/Quarto|quarto|4/i)) {
    return "4° período";
  } else if (semesterName.match(/Quinto|quinto|5/i)) {
    return "5° período";
  } else if (semesterName.match(/Sexto|sexto|6/i)) {
    return "6° período";
  } else if (semesterName.match(/Sétimo|sétimo|7/i)) {
    return "7° período";
  } else if (semesterName.match(/Oitavo|oitavo|8/i)) {
    return "8° período";
  }

  return semesterName;
};
