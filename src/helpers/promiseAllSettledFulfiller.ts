const promiseAllSettledWrapper = async (paramsArray: any[], asyncFuntionCall: (params: any) => any, maxFails: number) => {
  let collatedResults: any[] = [];
  let failedRuns = 0;

  const promiseAllSettledHelper = async (helperParamsArray: any[], helperAsyncFuntionCall: (params: any) => any) => {
    console.log("fetchDataRun", failedRuns);
    const apiCallResponses = await Promise.allSettled(
      helperParamsArray.map(async (params) => {
        const apiResponse = await helperAsyncFuntionCall(params);
        return apiResponse;
      })
    );

    const failedBody: any[] = [];
    const apiCallResponsesValues = apiCallResponses.reduce((accumulator, value, index) => {
      if (value?.status === "rejected") {
        failedBody.push(helperParamsArray[index]);
        return accumulator;
      }
      return [...accumulator, value?.value];
    }, [] as any[]);

    collatedResults = [...collatedResults, ...apiCallResponsesValues];

    if (failedBody.length && failedRuns < maxFails) {
      console.log("fetchedDatahasfails", failedRuns, collatedResults.length);
      failedRuns++;
      await promiseAllSettledHelper(failedBody, helperAsyncFuntionCall);
    }
  };

  await promiseAllSettledHelper(paramsArray, asyncFuntionCall);

  return collatedResults;
};

export default promiseAllSettledWrapper;
