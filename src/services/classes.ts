import classes from "../types/classes";

export const nonCancelledClassesIdsGenerator = (monthClasses: classes[], authToken: string) => {
  const nonCancelledClassesIds = monthClasses.reduce((accumulator, currentValue) => {
    if (currentValue.IsCanceled) {
      return accumulator;
    }
    return [...accumulator, { authToken, classId: currentValue?.Id as number }];
  }, [] as { authToken: string; classId: number }[]);

  return nonCancelledClassesIds;
};
