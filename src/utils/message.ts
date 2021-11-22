const getEmojiFromPlace = (index: number) => {
  switch (index) {
    case 0:
      return ":first_place:";
    case 1:
      return ":second_place:";
    case 2:
      return ":third_place:";
    default:
      return "";
  }
};

const tagUsers = (users: string[]) => {
  return users.map((userId) => `<@${userId}>`).join(", ");
};

export { getEmojiFromPlace, tagUsers };
