export const getQueryParams = () => {
  const searchParams = new URLSearchParams(window.location.search).toString();
  return searchParams ? searchParams : null;
};

export const saveQueryParams = () => {
  const currentQueryParams = getQueryParams();
  if (currentQueryParams) {
    localStorage.setItem('queryParams', currentQueryParams);
  }
};

export const removeQueryParams = () => {
  localStorage.removeItem('queryParams');
};

export const getSavedQueryParams: any = () => {
  const saveQueryParams = localStorage.getItem('queryParams') || null;
  if (saveQueryParams) {
    const params = new URLSearchParams(saveQueryParams);
    const paramsObject = Object.fromEntries(params.entries());
    return paramsObject;
  }
  return null;
};
