import classes from "../types/classes";

export const nonCancelledClassesIdsGenerator = (weekClasses: classes[], authToken: string) => {
  const nonCancelledClassesIds = weekClasses.reduce((accumulator, currentValue) => {
    if (currentValue.IsCanceled) {
      return accumulator;
    }
    return [...accumulator, { authToken, classId: currentValue?.Id as number }];
  }, [] as { authToken: string; classId: number }[]);

  return nonCancelledClassesIds;
};
