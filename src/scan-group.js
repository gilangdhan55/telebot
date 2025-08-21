import fs from 'fs'; 
const groupsFile = './groups.json';

export const getGroups = () => {
  try {
    const data = fs.readFileSync(groupsFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
};

export const saveGroups = (currentGroups) => {
  fs.writeFileSync(groupsFile, JSON.stringify(currentGroups, null, 2));
};

export const groups = getGroups();
